import { Plant, ReminderTask } from './types';

export interface CriticalAlert {
  id: string;
  plantId: string;
  plantName: string;
  type: 'moisture' | 'ph' | 'ppm' | 'climate' | 'task';
  severity: 'critical' | 'warning';
  title: string;
  message: string;
  metricValue?: string;
  actionLabel?: string;
  taskId?: string;
}

export function detectCriticalAlerts(plants: Plant[], tasks: ReminderTask[] = []): CriticalAlert[] {
  const alerts: CriticalAlert[] = [];

  // 1. Only process active plants (exclude harvested or deleted)
  const activePlants = (plants || []).filter(
    (p) => p && !p.isHarvested && p.stage !== 'harvested'
  );
  const activePlantIds = new Set(activePlants.map((p) => p.id));

  activePlants.forEach((plant) => {
    // 1. Check Substrate Moisture (Critical low <= 30%)
    const moisture = plant.moistureBeforeWatering ?? plant.moistureHistory?.[0]?.moisture;
    if (moisture !== undefined && moisture <= 30) {
      alerts.push({
        id: `moisture-${plant.id}`,
        plantId: plant.id,
        plantName: plant.name,
        type: 'moisture',
        severity: moisture <= 25 ? 'critical' : 'warning',
        title: '💧 Низька вологість субстрату',
        message: `Вологість субстрату ${moisture}% (норма >30%). Рослина потребує поливу.`,
        metricValue: `${moisture}%`,
      });
    }

    // 2. Check pH deviations
    const currentPh = plant.phBeforeWatering || plant.currentPH;
    if (currentPh) {
      const isCocoOrHydro = plant.medium === 'Coco' || plant.medium === 'Hydroponics';
      const minPh = isCocoOrHydro ? 5.5 : 5.8;
      const maxPh = isCocoOrHydro ? 6.5 : 7.0;

      if (currentPh < minPh || currentPh > maxPh) {
        alerts.push({
          id: `ph-${plant.id}`,
          plantId: plant.id,
          plantName: plant.name,
          type: 'ph',
          severity: currentPh < (minPh - 0.3) || currentPh > (maxPh + 0.3) ? 'critical' : 'warning',
          title: '🧪 Відхилення pH',
          message: `pH рівень ${currentPh} виходить за межі норми (${minPh}-${maxPh}). Загроза блокування живлення.`,
          metricValue: `pH ${currentPh}`,
        });
      }
    }

    // 3. Check PPM excess
    const ppm = plant.ppmAfterWatering || plant.ppmBeforeWatering;
    if (ppm && ppm > 1300) {
      alerts.push({
        id: `ppm-${plant.id}`,
        plantId: plant.id,
        plantName: plant.name,
        type: 'ppm',
        severity: ppm > 1500 ? 'critical' : 'warning',
        title: '⚡ Завищений PPM (Засолення)',
        message: `Рівень PPM досяг ${ppm} PPM. Рекомендовано промити субстрат або зменшити дозування.`,
        metricValue: `${ppm} PPM`,
      });
    }

    // 4. Check Room Climate
    if (plant.currentTemp > 31 || plant.currentTemp < 18) {
      alerts.push({
        id: `temp-${plant.id}`,
        plantId: plant.id,
        plantName: plant.name,
        type: 'climate',
        severity: 'critical',
        title: '🌡️ Критична температура',
        message: `Температура в боксі ${plant.currentTemp}°C (норма 20-28°C).`,
        metricValue: `${plant.currentTemp}°C`,
      });
    }

    if (plant.currentHumidity < 35 || plant.currentHumidity > 75) {
      alerts.push({
        id: `humidity-${plant.id}`,
        plantId: plant.id,
        plantName: plant.name,
        type: 'climate',
        severity: plant.currentHumidity > 75 ? 'critical' : 'warning',
        title: '🌬️ Небезпечна вологість повітря',
        message: `Вологість повітря ${plant.currentHumidity}% (ризик плісняви або пересихання).`,
        metricValue: `${plant.currentHumidity}% RH`,
      });
    }
  });

  // 2. Check urgent tasks ONLY for active existing plants
  (tasks || []).forEach((task) => {
    if (!task.completed && task.urgent) {
      if (task.plantId && !activePlantIds.has(task.plantId)) {
        // Skip tasks for deleted or harvested plants
        return;
      }

      const associatedPlant = activePlants.find((p) => p.id === task.plantId);
      const targetPlantId = associatedPlant ? associatedPlant.id : (task.plantId || activePlants[0]?.id || '');
      alerts.push({
        id: `task-${task.id}`,
        plantId: targetPlantId,
        plantName: associatedPlant ? associatedPlant.name : (task.plantName || 'Кімната 1'),
        type: 'task',
        severity: 'warning',
        title: `⚠️ Термінове завдання: ${task.title}`,
        message: task.description,
        taskId: task.id,
      });
    }
  });

  return alerts;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  return await Notification.requestPermission();
}

export function sendLocalPushNotification(title: string, options?: NotificationOptions) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    } catch (e) {
      console.warn('Could not trigger Notification API:', e);
    }
  }
}
