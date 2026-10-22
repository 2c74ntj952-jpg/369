'use client';

import { Plant } from '@/lib/types';

export interface PlantMetricsSnapshot {
  moistureBeforeWatering?: number;
  moistureAfterWatering?: number;
  phBeforeWatering?: number;
  phAfterWatering?: number;
  currentPH?: number;
  ppmBeforeWatering?: number;
  ppmAfterWatering?: number;
  currentEC?: number;
  currentTemp?: number;
  currentHumidity?: number;
  lightDistanceCm?: number;
  lightPPFD?: number;
  cleanWaterPPM?: number;
  potSize?: number;
  lastUpdated?: number;
}

export interface MetricChangePayload {
  plantId: string;
  field: string;
  value: any;
  source: 'ai_control_task' | 'plant_metrics' | 'room_climate' | 'solution_calculator' | 'system';
  taskId?: string;
  timestamp: number;
  allUpdatedFields: Partial<PlantMetricsSnapshot>;
}

type MetricsListener = (snapshot: PlantMetricsSnapshot, payload: MetricChangePayload) => void;

class MetricsStateService {
  private snapshots: Map<string, PlantMetricsSnapshot> = new Map();
  private listeners: Map<string, Set<MetricsListener>> = new Map();
  private globalListeners: Set<MetricsListener> = new Set();

  /**
   * Sync or initialize snapshot from plant data
   */
  public syncWithPlant(plant: Plant): PlantMetricsSnapshot {
    if (!plant || !plant.id) return {};

    const existing = this.snapshots.get(plant.id);
    const newSnapshot: PlantMetricsSnapshot = {
      moistureBeforeWatering: plant.moistureBeforeWatering ?? existing?.moistureBeforeWatering ?? 25,
      moistureAfterWatering: plant.moistureAfterWatering ?? existing?.moistureAfterWatering ?? 25,
      phBeforeWatering: plant.phBeforeWatering ?? existing?.phBeforeWatering ?? plant.currentPH ?? 6.2,
      phAfterWatering: plant.phAfterWatering ?? existing?.phAfterWatering ?? plant.currentPH ?? 6.2,
      currentPH: plant.currentPH ?? existing?.currentPH ?? plant.phBeforeWatering ?? 6.2,
      ppmBeforeWatering: plant.ppmBeforeWatering ?? existing?.ppmBeforeWatering ?? 650,
      ppmAfterWatering: plant.ppmAfterWatering ?? existing?.ppmAfterWatering ?? 650,
      currentEC: plant.currentEC ?? existing?.currentEC ?? Number(((plant.ppmBeforeWatering || 650) / 500).toFixed(1)),
      currentTemp: plant.currentTemp ?? existing?.currentTemp ?? 24,
      currentHumidity: plant.currentHumidity ?? existing?.currentHumidity ?? 50,
      lightDistanceCm: plant.lightDistanceCm ?? existing?.lightDistanceCm ?? 45,
      lightPPFD: plant.lightPPFD ?? existing?.lightPPFD ?? 520,
      cleanWaterPPM: plant.cleanWaterPPM ?? existing?.cleanWaterPPM ?? 100,
      potSize: plant.potSize ?? existing?.potSize ?? 10,
      lastUpdated: Date.now(),
    };

    this.snapshots.set(plant.id, newSnapshot);
    return newSnapshot;
  }

  /**
   * Get current metrics snapshot for a plant
   */
  public getSnapshot(plantId: string): PlantMetricsSnapshot | undefined {
    return this.snapshots.get(plantId);
  }

  /**
   * Subscribe to real-time metric updates for a specific plant or all plants
   */
  public subscribe(
    plantId: string | null,
    listener: MetricsListener
  ): () => void {
    if (plantId) {
      if (!this.listeners.has(plantId)) {
        this.listeners.set(plantId, new Set());
      }
      this.listeners.get(plantId)!.add(listener);

      return () => {
        const set = this.listeners.get(plantId);
        if (set) {
          set.delete(listener);
          if (set.size === 0) {
            this.listeners.delete(plantId);
          }
        }
      };
    } else {
      this.globalListeners.add(listener);
      return () => {
        this.globalListeners.delete(listener);
      };
    }
  }

  /**
   * Update metrics in real time and broadcast to all listeners
   */
  public updateMetrics(
    plantId: string,
    fieldKey: string,
    value: any,
    source: MetricChangePayload['source'] = 'system',
    taskId?: string
  ): { updatedFields: Partial<PlantMetricsSnapshot>; snapshot: PlantMetricsSnapshot } {
    const existing = this.snapshots.get(plantId) || {};
    const updatedFields: Partial<PlantMetricsSnapshot> = {};

    if (fieldKey === 'moisture') {
      const numVal = typeof value === 'number' ? value : parseFloat(value);
      updatedFields.moistureBeforeWatering = numVal;
      updatedFields.moistureAfterWatering = numVal;
    } else if (fieldKey === 'ph') {
      const numVal = typeof value === 'number' ? value : parseFloat(value);
      updatedFields.phBeforeWatering = numVal;
      updatedFields.phAfterWatering = numVal;
      updatedFields.currentPH = numVal;
    } else if (fieldKey === 'ppm') {
      const numVal = typeof value === 'number' ? value : parseInt(value, 10);
      updatedFields.ppmBeforeWatering = numVal;
      updatedFields.ppmAfterWatering = numVal;
      updatedFields.currentEC = Number((numVal / 500).toFixed(1));
    } else if (fieldKey === 'temp') {
      const numVal = typeof value === 'number' ? value : parseInt(value, 10);
      updatedFields.currentTemp = numVal;
    } else if (fieldKey === 'humidity') {
      const numVal = typeof value === 'number' ? value : parseInt(value, 10);
      updatedFields.currentHumidity = numVal;
    } else if (fieldKey === 'lightDistance') {
      const numVal = typeof value === 'number' ? value : parseInt(value, 10);
      updatedFields.lightDistanceCm = numVal;
    } else if (fieldKey === 'ppfd') {
      const numVal = typeof value === 'number' ? value : parseInt(value, 10);
      updatedFields.lightPPFD = numVal;
    } else if (fieldKey === 'cleanWaterPpm' || fieldKey === 'waterPpm' || fieldKey === 'cleanWaterPPM') {
      const numVal = typeof value === 'number' ? value : parseInt(value, 10);
      updatedFields.cleanWaterPPM = numVal;
    } else if (fieldKey === 'waterPh') {
      const numVal = typeof value === 'number' ? value : parseFloat(value);
      updatedFields.phBeforeWatering = numVal;
    } else if (fieldKey === 'potSize') {
      const numVal = typeof value === 'number' ? value : parseFloat(value);
      updatedFields.potSize = numVal;
    } else {
      (updatedFields as any)[fieldKey] = value;
    }

    const newSnapshot: PlantMetricsSnapshot = {
      ...existing,
      ...updatedFields,
      lastUpdated: Date.now(),
    };

    this.snapshots.set(plantId, newSnapshot);

    const payload: MetricChangePayload = {
      plantId,
      field: fieldKey,
      value,
      source,
      taskId,
      timestamp: Date.now(),
      allUpdatedFields: updatedFields,
    };

    // Notify listeners for this plantId
    const plantListeners = this.listeners.get(plantId);
    if (plantListeners) {
      plantListeners.forEach(listener => {
        try {
          listener(newSnapshot, payload);
        } catch (err) {
          console.error('Error in metrics listener:', err);
        }
      });
    }

    // Notify global listeners
    this.globalListeners.forEach(listener => {
      try {
        listener(newSnapshot, payload);
      } catch (err) {
        console.error('Error in global metrics listener:', err);
      }
    });

    return { updatedFields, snapshot: newSnapshot };
  }
}

export const metricsStateService = new MetricsStateService();
