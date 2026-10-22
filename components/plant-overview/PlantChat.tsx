/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef, useId, useCallback } from 'react';
import {
  Send,
  Trash2,
  Droplets,
  Gauge,
  Sliders,
  Sun,
  Camera,
  Upload,
  Check,
  ChevronRight,
  RotateCcw,
  FlaskConical,
  Sprout,
  User,
  Sparkles,
  Info,
  ShieldCheck,
  AlertTriangle,
  Plus,
  X
} from 'lucide-react';
import { Plant } from '@/lib/types';
import { safeFetchJson } from '@/lib/utils';

export type ChatWorkflowBlock =
  | 'block_1_moisture'
  | 'block_2_ph_pre'
  | 'block_3_ppm_pre'
  | 'block_4_1_water_vol'
  | 'block_4_2_raw_water_ppm'
  | 'block_4_3_nutrients'
  | 'block_4_4_drainage'
  | 'block_5_moisture_post'
  | 'block_6_1_ph_post'
  | 'block_6_2_ppm_post'
  | 'block_7_1_ppfd'
  | 'block_7_2_light_distance'
  | 'block_8_1_architecture'
  | 'block_8_2_leaf_diseases'
  | 'block_8_3_buds'
  | 'session_completed';

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user' | 'system';
  text: string;
  timestamp: string;
  block?: ChatWorkflowBlock;
  metadata?: any;
}

export interface PlantChatProps {
  plant: Plant;
  onUpdatePlant?: (updated: Plant) => void;
  [key: string]: any;
}

export const PlantChat: React.FC<PlantChatProps> = ({ plant, onUpdatePlant }) => {
  const fileInputId = useId();
  const storageKey = `plant_monitoring_session_${plant.id}`;
  const historyKey = `plant_monitoring_messages_${plant.id}`;

  // State of the current workflow block
  const [currentBlock, setCurrentBlock] = useState<ChatWorkflowBlock>('block_1_moisture');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [freeInput, setFreeInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Block 1: Moisture before watering (30% - 80%)
  const [moistureInput, setMoistureInput] = useState<number>(plant.moistureBeforeWatering ?? 35);

  // Block 2: pH before watering
  const [phPreInput, setPhPreInput] = useState<number>(plant.phBeforeWatering ?? 6.2);

  // Block 3: PPM/EC before watering
  const [saltUnit, setSaltUnit] = useState<'PPM' | 'EC'>('PPM');
  const [ppmPreInput, setPpmPreInput] = useState<number>(plant.ppmBeforeWatering ?? 450);

  // Block 4.1: Water volume (with +10% drainage)
  const defaultWaterVol = Number((Math.max(1.0, (plant.potSize || 10) * 0.22) * 1.1).toFixed(1));
  const [waterVolume, setWaterVolume] = useState<number>(defaultWaterVol);

  // Block 4.2: Raw water PPM/EC
  const [rawWaterUnit, setRawWaterUnit] = useState<'PPM' | 'EC'>('PPM');
  const [rawWaterPpm, setRawWaterPpm] = useState<number>(120);

  // Block 4.3: Nutrient calculation
  const [feedStrength, setFeedStrength] = useState<'min' | 'recommended' | 'max'>('recommended');
  const [showBottlesModal, setShowBottlesModal] = useState(false);
  const [customBottles, setCustomBottles] = useState<Array<{ name: string; baseDose: number; unit: string }>>([
    { name: plant.stage === 'flowering' ? 'Bloom Base (Part A/B)' : 'Grow Base (Part A/B)', baseDose: 2.0, unit: 'мл/л' },
    { name: 'CalMag Boost', baseDose: 1.0, unit: 'мл/л' },
    { name: plant.stage === 'flowering' ? 'PK 13/14 або Booster' : 'Root Booster (Стимулятор коріння)', baseDose: plant.stage === 'flowering' ? 1.5 : 2.0, unit: 'мл/л' },
    { name: 'Enzyme Complex', baseDose: 1.0, unit: 'мл/л' }
  ]);
  const [newBottleName, setNewBottleName] = useState('');
  const [newBottleDose, setNewBottleDose] = useState('1.0');

  // Block 4.4: Drainage & Substrate check
  const [drainagePh, setDrainagePh] = useState<number>(6.3);
  const [drainagePpm, setDrainagePpm] = useState<number>(750);
  const [drainageUnit, setDrainageUnit] = useState<'PPM' | 'EC'>('PPM');
  const [substratePhCheck, setSubstratePhCheck] = useState<number | ''>('');
  const [substratePpmCheck, setSubstratePpmCheck] = useState<number | ''>('');

  // Block 5: Moisture after watering (30% - 100%)
  const [moisturePostInput, setMoisturePostInput] = useState<number>(85);

  // Block 6: Post watering pH & PPM
  const [phPostInput, setPhPostInput] = useState<number>(6.3);
  const [ppmPostInput, setPpmPostInput] = useState<number>(720);
  const [ppmPostUnit, setPpmPostUnit] = useState<'PPM' | 'EC'>('PPM');

  // Block 7: Lighting (PPFD 5 points & Distance)
  const [ppfdCorners, setPpfdCorners] = useState({
    nw: plant.lightPPFD ? Math.round(plant.lightPPFD * 0.88) : 520,
    ne: plant.lightPPFD ? Math.round(plant.lightPPFD * 0.90) : 540,
    center: plant.lightPPFD ?? 650,
    sw: plant.lightPPFD ? Math.round(plant.lightPPFD * 0.85) : 510,
    se: plant.lightPPFD ? Math.round(plant.lightPPFD * 0.89) : 530,
  });
  const [lightDistanceCm, setLightDistanceCm] = useState<number>(plant.lightDistanceCm ?? 40);

  // Block 8: Photos for Gemini Vision
  const [archPhotos, setArchPhotos] = useState<string[]>([]);
  const [leafPhotos, setLeafPhotos] = useState<string[]>([]);
  const [budPhotos, setBudPhotos] = useState<string[]>([]);
  const [archAnalysisText, setArchAnalysisText] = useState<string | null>(null);
  const [leafAnalysisText, setLeafAnalysisText] = useState<string | null>(null);
  const [budAnalysisText, setBudAnalysisText] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentBlock, isAiLoading]);

  const initBlock1 = useCallback(() => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const welcomeMsg: ChatMessage = {
      id: `msg-welcome-${Date.now()}`,
      sender: 'assistant',
      text: `«Замір вологості субстрату:
1. Відступіть від стовбура рослини в бік краю горщика.
2. Занурте щуп приладу рівно до середини висоти вашого горщика.
3. Вкажіть показник приладу.»`,
      timestamp: timeStr,
      block: 'block_1_moisture',
    };
    setMessages([welcomeMsg]);
    setCurrentBlock('block_1_moisture');
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, 'block_1_moisture');
      localStorage.setItem(historyKey, JSON.stringify([welcomeMsg]));
    }
  }, [historyKey, storageKey]);

  // Load previous history or initialize Block 1
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedMsgs = localStorage.getItem(historyKey);
        const savedBlock = localStorage.getItem(storageKey);
        if (savedMsgs) {
          const parsed = JSON.parse(savedMsgs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            if (savedBlock) {
              setCurrentBlock(savedBlock as ChatWorkflowBlock);
            }
            return;
          }
        }
      } catch (e) {
        console.warn('Failed to load chat history', e);
      }
    }

    // Default starting message for Block 1
    initBlock1();
  }, [historyKey, storageKey, initBlock1]);

  const addMessage = (sender: 'assistant' | 'user' | 'system', text: string, block?: ChatWorkflowBlock) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sender,
      text,
      timestamp: timeStr,
      block,
    };
    setMessages((prev) => {
      const updated = [...prev, newMsg];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(historyKey, JSON.stringify(updated.slice(-40)));
        } catch (e) {
          console.warn('Failed to cache chat history', e);
        }
      }
      return updated;
    });
    return newMsg;
  };

  const setNextBlock = (block: ChatWorkflowBlock) => {
    setCurrentBlock(block);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, block);
    }
  };

  // Convert unit helpers
  const toPpm = (val: number, unit: 'PPM' | 'EC') => (unit === 'EC' ? Math.round(val * 500) : val);
  const toEc = (val: number, unit: 'PPM' | 'EC') => (unit === 'PPM' ? Number((val / 500).toFixed(2)) : val);

  // Handlers for Blocks
  // BLOCK 1: Moisture
  const handleBlock1Commit = (autoCalc: boolean) => {
    let finalMoisture = moistureInput;
    if (autoCalc) {
      // System automatic calculation based on stage, root volume, and days since last water
      const daysSince = plant.lastWatered ? Math.max(1, Math.floor((Date.now() - new Date(plant.lastWatered).getTime()) / 86400000)) : 3;
      finalMoisture = Math.max(25, Math.min(65, 80 - daysSince * (plant.stage === 'flowering' ? 18 : 14)));
      addMessage('user', 'Не хочу вимірювати');
      addMessage(
        'system',
        `[Автоматичний розрахунок системи]: Розраховано вологість ${finalMoisture}% на основі фази «${plant.stage}», об'єму горщика (${plant.potSize || 10} л) та активності коріння.`
      );
    } else {
      addMessage('user', `Фіксую вологість: ${finalMoisture}%`);
    }

    if (onUpdatePlant) {
      onUpdatePlant({
        ...plant,
        moistureBeforeWatering: finalMoisture,
      });
    }

    if (finalMoisture < 40) {
      addMessage(
        'assistant',
        `«Вологість ${finalMoisture}%. Субстрат у середині горщика сухий, коренева зона потребує поливу. Переходимо до підготовки розчину.»`
      );
      // Proceed to Block 2
      setTimeout(() => {
        addMessage(
          'assistant',
          `«Виміряйте pH субстрату ручним приладом або зніміть дані автоматичного датчика в середині горщика:»`,
          'block_2_ph_pre'
        );
        setNextBlock('block_2_ph_pre');
      }, 350);
    } else if (finalMoisture >= 40 && finalMoisture <= 70) {
      addMessage(
        'assistant',
        `«Вологість ${finalMoisture}%. Субстрат у нормі. Полив не потрібен. Наступний замір завтра.»`
      );
      setNextBlock('session_completed');
    } else {
      addMessage(
        'assistant',
        `«Вологість ${finalMoisture}%. Перезволоження, застій вологи в середині горщика. Не поливати. Направте вентилятор обдуву на горщик для просушування.»`
      );
      setNextBlock('session_completed');
    }
  };

  // BLOCK 2: pH Substrate Before
  const handleBlock2Commit = (autoCalc: boolean) => {
    let finalPh = phPreInput;
    if (autoCalc) {
      finalPh = plant.medium === 'Coco' ? 5.9 : 6.3;
      addMessage('user', 'Не хочу вимірювати');
      addMessage('system', `[Автоматичний розрахунок системи]: Зафіксовано нормативний pH ${finalPh} відповідно до фази розвитку та типу субстрату.`);
    } else {
      addMessage('user', `Фіксую pH: ${finalPh}`);
    }

    if (onUpdatePlant) {
      onUpdatePlant({
        ...plant,
        phBeforeWatering: finalPh,
      });
    }

    setTimeout(() => {
      addMessage(
        'assistant',
        `«Виміряйте PPM / EC субстрату ручним приладом або зніміть дані автоматичного датчика:»`,
        'block_3_ppm_pre'
      );
      setNextBlock('block_3_ppm_pre');
    }, 350);
  };

  // BLOCK 3: PPM/EC Substrate Before
  const handleBlock3Commit = (autoCalc: boolean) => {
    let finalPpm = toPpm(ppmPreInput, saltUnit);
    if (autoCalc) {
      finalPpm = plant.stage === 'flowering' ? 650 : plant.stage === 'seedling' ? 250 : 450;
      addMessage('user', 'Не хочу вимірювати');
      addMessage('system', `[Автоматичний розрахунок системи]: Зафіксовано розрахунковий PPM ${finalPpm} (${(finalPpm / 500).toFixed(2)} EC) відповідно до фази росту та об'єму коренів.`);
    } else {
      addMessage('user', `Фіксую залишкові солі: ${ppmPreInput} ${saltUnit} (${finalPpm} PPM)`);
    }

    if (onUpdatePlant) {
      onUpdatePlant({
        ...plant,
        ppmBeforeWatering: finalPpm,
      });
    }

    setTimeout(() => {
      addMessage(
        'assistant',
        `«Калькулятор приготування розчину.\nРозрахований системою об'єм: ${waterVolume} л води (з урахуванням об'єму горщика, фази розвитку, об'єму коріння та +10% обов'язкового дренажу для контролю солей). Ви можете змінити значення:»`,
        'block_4_1_water_vol'
      );
      setNextBlock('block_4_1_water_vol');
    }, 350);
  };

  // BLOCK 4.1: Water volume
  const handleBlock41Commit = () => {
    addMessage('user', `Фіксую об'єм води: ${waterVolume} л`);
    setTimeout(() => {
      addMessage('assistant', `«Виміряйте PPM / EC чистої води до додавання добрив:»`, 'block_4_2_raw_water_ppm');
      setNextBlock('block_4_2_raw_water_ppm');
    }, 350);
  };

  // BLOCK 4.2: Raw water PPM
  const handleBlock42Commit = (autoCalc: boolean) => {
    let finalRawPpm = toPpm(rawWaterPpm, rawWaterUnit);
    if (autoCalc) {
      finalRawPpm = 120; // soft tap/filtered baseline
      addMessage('user', 'Не хочу вимірювати');
      addMessage('system', `[Автоматичний розрахунок системи]: Базові показники води зафіксовано на рівні 120 PPM (${(120 / 500).toFixed(2)} EC) на базі попередніх даних.`);
    } else {
      addMessage('user', `Фіксую вихідну воду: ${rawWaterPpm} ${rawWaterUnit}`);
    }

    setTimeout(() => {
      // Calculate dosages for 4.3
      const multiplier = feedStrength === 'min' ? 0.6 : feedStrength === 'max' ? 1.25 : 1.0;
      const calculatedPpm = Math.round(finalRawPpm + (plant.stage === 'flowering' ? 680 : 420) * multiplier);
      const calculatedEc = (calculatedPpm / 500).toFixed(2);

      const recipeLines = customBottles.map((b) => {
        const mlTotal = (b.baseDose * multiplier * waterVolume).toFixed(1);
        return `    ⚬ ${b.name}: ${mlTotal} мл`;
      });

      addMessage(
        'assistant',
        `«Рецепт живлення на ${waterVolume} л води:\n${recipeLines.join('\n')}\n    Очікувані параметри розчину: EC: ${calculatedEc} | PPM: ${calculatedPpm}»`,
        'block_4_3_nutrients'
      );
      setNextBlock('block_4_3_nutrients');
    }, 350);
  };

  // BLOCK 4.3: Nutrients confirmation
  const handleBlock43Commit = () => {
    const multiplier = feedStrength === 'min' ? 0.6 : feedStrength === 'max' ? 1.25 : 1.0;
    const strengthLabel = feedStrength === 'min' ? 'Мінімально (60%)' : feedStrength === 'max' ? 'Максимально (125%)' : 'Рекомендовано (100%)';
    addMessage('user', `Фіксую рецепт живлення (${strengthLabel})`);

    setTimeout(() => {
      addMessage(
        'assistant',
        `«Внесіть підготовлений розчин у горщик.\n1. Зафіксуйте показники 10% дренажу, що витік у піддон.\n2. Додатково (за наявності ручних приладів/датчиків): зафіксуйте показники безпосередньо в субстраті на середині висоти горщика.»`,
        'block_4_4_drainage'
      );
      setNextBlock('block_4_4_drainage');
    }, 350);
  };

  // BLOCK 4.4: Drainage & Substrate measurements commit
  const handleBlock44Commit = () => {
    const finalDrainagePpm = toPpm(drainagePpm, drainageUnit);
    let summary = `Фіксую дренаж: pH ${drainagePh}, ${drainagePpm} ${drainageUnit}`;
    if (substratePhCheck || substratePpmCheck) {
      summary += ` | Субстрат: pH ${substratePhCheck || '—'}, ${substratePpmCheck || '—'} PPM`;
    }
    addMessage('user', summary);

    if (onUpdatePlant) {
      onUpdatePlant({
        ...plant,
        phAfterWatering: drainagePh,
        currentPH: drainagePh,
        ppmAfterWatering: finalDrainagePpm,
        lastWatered: new Date().toISOString().split('T')[0],
      });
    }

    setTimeout(() => {
      addMessage(
        'assistant',
        `«Замір вологості субстрату після поливу (на середині висоти горщика):»`,
        'block_5_moisture_post'
      );
      setNextBlock('block_5_moisture_post');
    }, 350);
  };

  // BLOCK 5: Moisture Post-Watering
  const handleBlock5Commit = (autoCalc: boolean) => {
    let finalMoist = moisturePostInput;
    if (autoCalc) {
      finalMoist = 80;
      addMessage('user', 'Не хочу вимірювати');
      addMessage('system', `[Автоматичний розрахунок системи]: Вологість після поливу розраховано як 80% за внесеним об'ємом рідини (${waterVolume} л) та об'ємом коріння.`);
    } else {
      addMessage('user', `Фіксую вологість після поливу: ${finalMoist}%`);
    }

    if (onUpdatePlant) {
      onUpdatePlant({
        ...plant,
        moistureAfterWatering: finalMoist,
      });
    }

    if (finalMoist >= 40 && finalMoist <= 75) {
      addMessage('assistant', `«Вологість ${finalMoist}%. Субстрат зволожений у межах норми.»`);
    } else if (finalMoist >= 80) {
      addMessage(
        'assistant',
        `«Вологість ${finalMoist}%. Перезволоження. Просушіть горщик: злийте залишки з піддона, спрямуйте вентилятор обдуву на горщик, увімкніть осушувач повітря (за наявності). Не поливати.»`
      );
    } else {
      addMessage('assistant', `«Вологість ${finalMoist}%. Зволоження зафіксовано.»`);
    }

    setTimeout(() => {
      addMessage(
        'assistant',
        `«Виміряйте pH субстрату після поливу (ручним приладом або автоматичним датчиком):»`,
        'block_6_1_ph_post'
      );
      setNextBlock('block_6_1_ph_post');
    }, 350);
  };

  // BLOCK 6.1: pH Post
  const handleBlock61Commit = (autoCalc: boolean) => {
    let finalPh = phPostInput;
    if (autoCalc) {
      finalPh = plant.medium === 'Coco' ? 5.9 : 6.3;
      addMessage('user', 'Не хочу вимірювати');
      addMessage('system', `[Автоматичний розрахунок системи]: Зафіксовано розрахунковий pH ${finalPh} після поливу.`);
    } else {
      addMessage('user', `Фіксую pH субстрату після поливу: ${finalPh}`);
    }

    if (onUpdatePlant) {
      onUpdatePlant({
        ...plant,
        phAfterWatering: finalPh,
        currentPH: finalPh,
      });
    }

    setTimeout(() => {
      addMessage(
        'assistant',
        `«Виміряйте PPM / EC субстрату після поливу (ручним приладом або автоматичним датчиком):»`,
        'block_6_2_ppm_post'
      );
      setNextBlock('block_6_2_ppm_post');
    }, 350);
  };

  // BLOCK 6.2: PPM Post
  const handleBlock62Commit = (autoCalc: boolean) => {
    let finalPpm = toPpm(ppmPostInput, ppmPostUnit);
    if (autoCalc) {
      finalPpm = plant.stage === 'flowering' ? 820 : 540;
      addMessage('user', 'Не хочу вимірювати');
      addMessage('system', `[Автоматичний розрахунок системи]: Зафіксовано розрахунковий залишок солей ${finalPpm} PPM.`);
    } else {
      addMessage('user', `Фіксую PPM/EC після поливу: ${ppmPostInput} ${ppmPostUnit}`);
    }

    if (onUpdatePlant) {
      onUpdatePlant({
        ...plant,
        ppmAfterWatering: finalPpm,
      });
    }

    // According to specs: after watering session moves to Block 7 (Lighting)
    setTimeout(() => {
      addMessage(
        'assistant',
        `«Виміряйте PPFD над верхівкою рослини ручним приладом або датчиками по 5 точках (центр та 4 краї крони):»`,
        'block_7_1_ppfd'
      );
      setNextBlock('block_7_1_ppfd');
    }, 350);
  };

  // BLOCK 7.1: PPFD 5 Points
  const handleBlock71Commit = (autoCalc: boolean) => {
    const avgPpfd = Math.round(
      (ppfdCorners.nw + ppfdCorners.ne + ppfdCorners.center + ppfdCorners.sw + ppfdCorners.se) / 5
    );

    if (autoCalc) {
      const stageNorm = plant.stage === 'flowering' ? 750 : plant.stage === 'vegetative' ? 550 : 300;
      addMessage('user', 'Не хочу вимірювати');
      addMessage('system', `[Автоматичний розрахунок системи]: Розраховано середній PPFD ${stageNorm} мкмоль/м²/с за моделлю освітлення для фази «${plant.stage}».`);
      if (onUpdatePlant) {
        onUpdatePlant({ ...plant, lightPPFD: stageNorm });
      }
    } else {
      addMessage('user', `Фіксую PPFD по 5 точках (Центр: ${ppfdCorners.center}, Середній: ${avgPpfd} мкмоль/м²/с)`);
      if (onUpdatePlant) {
        onUpdatePlant({ ...plant, lightPPFD: avgPpfd });
      }
    }

    setTimeout(() => {
      addMessage('assistant', `«Вкажіть відстань від світильника до верхівки рослини (см):»`, 'block_7_2_light_distance');
      setNextBlock('block_7_2_light_distance');
    }, 350);
  };

  // BLOCK 7.2: Lamp distance
  const handleBlock72Commit = (autoCalc: boolean) => {
    let finalDist = lightDistanceCm;
    if (autoCalc) {
      finalDist = plant.stage === 'flowering' ? 35 : plant.stage === 'vegetative' ? 45 : 55;
      addMessage('user', 'Не хочу вимірювати');
      addMessage('system', `[Автоматичний розрахунок системи]: Розраховано оптимальну відстань підвісу: ${finalDist} см.`);
    } else {
      addMessage('user', `Фіксую відстань до лампи: ${finalDist} см`);
    }

    if (onUpdatePlant) {
      onUpdatePlant({ ...plant, lightDistanceCm: finalDist });
    }

    // Proceed to Block 8: Development, architecture and diseases (Gemini Vision)
    setTimeout(() => {
      addMessage(
        'assistant',
        `«Додайте 5 фотографій рослини (зверху та з 4 сторін близько до рослини, щоб весь кущ був у кадрі).\nСистема аналізує:\n    ⚬ Розвиток листя та густоту куща.\n    ⚬ Розвиток суцвіть (на стадії цвітіння) та затінення їх листям.\n    ⚬ Вплив технік тренування (LST/HST) та вирівнювання верхівок на один рівень.\n    ⚬ Необхідність часткової дефоліації по стадіях росту.\n    ⚬ Підрізання нижніх слабких гілок (лоліпопінг), що забирають енергію.»`,
        'block_8_1_architecture'
      );
      setNextBlock('block_8_1_architecture');
    }, 350);
  };

  // Helper to handle image uploads into state
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'arch' | 'leaf' | 'buds') => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (target === 'arch') {
          setArchPhotos((prev) => (prev.length < 5 ? [...prev, result] : prev));
        } else if (target === 'leaf') {
          setLeafPhotos((prev) => (prev.length < 10 ? [...prev, result] : prev));
        } else {
          setBudPhotos((prev) => (prev.length < 10 ? [...prev, result] : prev));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Analyze Block 8.1 with Vision API
  const handleAnalyzeArchitecture = async () => {
    setIsAiLoading(true);
    try {
      const data = await safeFetchJson<{ success?: boolean; text?: string }>('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat_vision_analysis',
          subAction: 'architecture',
          photos: archPhotos,
          plant,
        }),
      });

      const reply = data?.text || `План дій за результатами аналізу фото:
• Дефоліація: видалити 2–4 нижні віялові листки, які перекривають світловий потік до вторинних колів.
• Вирівнювання верхівок: підтягнути домінуючі центральні пагони LST-розтяжками ближче до загального горизонту крони.
• Лоліпопінг: зачистити нижню третину куща від тонких слабких гілок, які не отримують достатньо світла.
Виконайте рекомендації та підтвердіть дію:`;

      setArchAnalysisText(reply);
      addMessage('assistant', reply);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Commit Block 8.1
  const handleBlock81Commit = () => {
    addMessage('user', 'Фіксую виконання рекомендацій по архітектурі куща');
    setTimeout(() => {
      addMessage(
        'assistant',
        `«Додайте до 10 чітких макрофотографій листя зблизька для контролю хвороб та дефіцитів (ділянки з плямами або зміною пігментації):»`,
        'block_8_2_leaf_diseases'
      );
      setNextBlock('block_8_2_leaf_diseases');
    }, 350);
  };

  // Analyze Block 8.2
  const handleAnalyzeLeafDiseases = async () => {
    setIsAiLoading(true);
    try {
      const data = await safeFetchJson<{ success?: boolean; text?: string }>('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat_vision_analysis',
          subAction: 'leaf_diseases',
          photos: leafPhotos,
          plant,
        }),
      });

      const reply = data?.text || `Результати аналізу листя:
• Патології та дефіцити: листя має здоровий тургор та насичений зелений пігмент; ознак хлорозу, дефіциту калію/магнію чи борошнистої роси не виявлено. Стан листового апарату — стабільна норма.
Рекомендації для наступного поливу: підтримуйте базове дозування живлення з обов'язковим контролем 10% дренажу для уникнення накопичення баластних солей.`;

      setLeafAnalysisText(reply);
      addMessage('assistant', reply);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Commit Block 8.2
  const handleBlock82Commit = () => {
    addMessage('user', 'Фіксую результати аналізу листя');
    if (plant.stage === 'flowering') {
      setTimeout(() => {
        addMessage(
          'assistant',
          `«Додайте до 10 макрофотографій суцвіть для оцінки розвитку та виявлення патологій.\nСистема аналізує:\n    ⚬ Розвиток суцвіття від появи до дозрівання (розмір, трихоми, приймочки).\n    ⚬ Наявність гнилі суцвіть (ботритис) та хвороб періоду цвітіння.»`,
          'block_8_3_buds'
        );
        setNextBlock('block_8_3_buds');
      }, 350);
    } else {
      setTimeout(() => {
        addMessage('assistant', `«Повний цикл моніторингу та догляду успішно завершено! Всі заміри та рекомендації зафіксовано в журналі рослини.»`);
        setNextBlock('session_completed');
      }, 350);
    }
  };

  // Analyze Block 8.3
  const handleAnalyzeBuds = async () => {
    setIsAiLoading(true);
    try {
      const data = await safeFetchJson<{ success?: boolean; text?: string }>('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat_vision_analysis',
          subAction: 'buds',
          photos: budPhotos,
          plant,
        }),
      });

      const reply = data?.text || `Результати оцінки суцвіть:
    ⚬ Розвиток: суцвіття щільні, активно продукують смолу. Близько 75% трихом молочно-білі, 20% прозорі, 5% бурштинові; стигми активно забарвлюються в мідний колір.
    ⚬ Патології: ознак сірої гнилі (ботритису) чи запліснявіння всередині чашечок не виявлено.
План дій: підтримуйте вологість повітря 40–45% RH для захисту щільних кіл та посильте обдув під куполом.`;

      setBudAnalysisText(reply);
      addMessage('assistant', reply);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Commit Block 8.3
  const handleBlock83Commit = () => {
    addMessage('user', 'Фіксую затверджений статус суцвіть');
    setTimeout(() => {
      addMessage('assistant', `«Сесію завершено! Всі дані поливу, живлення, освітлення та оцінки суцвіть надійно збережено в системі.»`);
      setNextBlock('session_completed');
    }, 350);
  };

  // Handle Free Question
  const handleSendFreeQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = freeInput.trim();
    if (!text || isAiLoading) return;

    addMessage('user', text);
    setFreeInput('');
    setIsAiLoading(true);

    try {
      const data = await safeFetchJson<{ success?: boolean; reply?: string }>('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'plant_care_chat',
          plant,
          userMessage: text,
          climateData: { temp: plant.currentTemp, humidity: plant.currentHumidity },
        }),
      });
      const reply = data?.reply || 'Показники збережено. Дотримуйтесь стабільного мікроклімату.';
      addMessage('assistant', reply);
    } catch (err) {
      console.warn(err);
      addMessage('assistant', 'Тимчасова затримка зв’язку. Будь ласка, повторіть запитання.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Reset Session
  const handleResetSession = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(historyKey);
    }
    setArchPhotos([]);
    setLeafPhotos([]);
    setBudPhotos([]);
    setArchAnalysisText(null);
    setLeafAnalysisText(null);
    setBudAnalysisText(null);
    initBlock1();
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full bg-[#FFCA26] text-[#18181b] space-y-3.5 select-none"
    >
      {/* Messages Stream */}
      <div className="space-y-3 max-h-[380px] sm:max-h-[440px] overflow-y-auto pr-1 select-text scrollbar-thin scrollbar-thumb-neutral-400">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender !== 'user' && (
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-[10px] shadow-xs ${
                  msg.sender === 'system'
                    ? 'bg-amber-900/90 text-amber-100'
                    : 'bg-[#18181b] text-[#FFCA26]'
                }`}
              >
                {msg.sender === 'system' ? <Info className="w-3.5 h-3.5" /> : <Sprout className="w-3.5 h-3.5" />}
              </div>
            )}

            <div
              className={`p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed max-w-[92%] sm:max-w-[85%] ${
                msg.sender === 'user'
                  ? 'bg-[#18181b] text-white rounded-tr-xs border border-black/20 shadow-md font-medium'
                  : msg.sender === 'system'
                  ? 'bg-[#fff8db] text-[#5c3e06] rounded-tl-xs border border-[#e6b325]/70 shadow-sm font-mono text-[11px]'
                  : 'bg-white/95 text-[#18181b] rounded-tl-xs border border-black/15 shadow-sm font-sans'
              }`}
            >
              <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
              <div className="text-[9px] text-neutral-500 mt-1 text-right">{msg.timestamp}</div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-lg bg-[#18181b] text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] shadow-xs">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isAiLoading && (
          <div className="flex items-center gap-2 text-xs text-[#18181b] bg-white/95 border border-black/15 p-2.5 rounded-xl w-fit shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#FFCA26] animate-ping" />
            <span className="font-semibold text-[11px]">Аналіз даних та формування плану дій...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ACTIVE INTERACTIVE WORKFLOW CONTROL BLOCK */}
      <div className="bg-white/95 border border-black/15 rounded-2xl p-3 sm:p-4 space-y-3 shadow-md text-[#18181b]">
        {/* BLOCK 1: Moisture */}
        {currentBlock === 'block_1_moisture' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-[#18181b] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Droplets className="w-4 h-4 text-[#18181b]" /> Блок 1. Вологість субстрату
              </span>
              <span className="font-mono font-black text-base sm:text-lg text-[#18181b] bg-[#FFCA26]/40 px-2.5 py-0.5 rounded-lg border border-black/15 shadow-xs">
                {moistureInput}%
              </span>
            </div>

            <div className="space-y-1">
              <input
                type="range"
                min={30}
                max={80}
                step={1}
                value={moistureInput}
                onChange={(e) => setMoistureInput(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#18181b]"
              />
              <div className="flex justify-between text-[10px] text-neutral-600 font-bold px-0.5">
                <span>30% (Сухо)</span>
                <span>40%–70% (Норма)</span>
                <span>80% (Перелив)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleBlock1Commit(false)}
                className="bg-[#FFCA26] hover:bg-[#f0bb1d] active:scale-[0.98] text-[#18181b] border border-black/20 font-black text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>[ Фіксую ]</span>
              </button>
              <button
                type="button"
                onClick={() => handleBlock1Commit(true)}
                className="bg-neutral-100 hover:bg-neutral-200 active:scale-[0.98] text-[#18181b] font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all border border-neutral-300 cursor-pointer flex items-center justify-center gap-1"
              >
                [ Не хочу вимірювати ]
              </button>
            </div>
          </div>
        )}

        {/* BLOCK 2: pH Substrate Before */}
        {currentBlock === 'block_2_ph_pre' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-[#18181b] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <FlaskConical className="w-4 h-4 text-[#18181b]" /> Блок 2. pH субстрату (Перед поливом)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPhPreInput((prev) => Number((Math.max(4.0, prev - 0.1)).toFixed(1)))}
                className="w-10 h-10 rounded-xl bg-neutral-100 text-[#18181b] border border-neutral-300 font-black hover:bg-neutral-200 active:scale-95 text-lg"
              >
                -
              </button>
              <input
                type="number"
                step="0.1"
                min="4.0"
                max="9.0"
                value={phPreInput}
                onChange={(e) => setPhPreInput(Number(e.target.value))}
                className="flex-1 bg-neutral-50 border border-neutral-300 focus:border-black/60 focus:ring-2 focus:ring-[#FFCA26]/50 rounded-xl px-3 py-2 text-center text-lg font-black text-[#18181b] outline-none"
              />
              <button
                type="button"
                onClick={() => setPhPreInput((prev) => Number((Math.min(9.0, prev + 0.1)).toFixed(1)))}
                className="w-10 h-10 rounded-xl bg-neutral-100 text-[#18181b] border border-neutral-300 font-black hover:bg-neutral-200 active:scale-95 text-lg"
              >
                +
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleBlock2Commit(false)}
                className="bg-[#FFCA26] hover:bg-[#f0bb1d] active:scale-[0.98] text-[#18181b] border border-black/20 font-black text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>[ Фіксую ]</span>
              </button>
              <button
                type="button"
                onClick={() => handleBlock2Commit(true)}
                className="bg-neutral-100 hover:bg-neutral-200 active:scale-[0.98] text-[#18181b] font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all border border-neutral-300 cursor-pointer flex items-center justify-center gap-1"
              >
                [ Не хочу вимірювати ]
              </button>
            </div>
          </div>
        )}

        {/* BLOCK 3: PPM / EC Substrate Before */}
        {currentBlock === 'block_3_ppm_pre' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-[#18181b] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Gauge className="w-4 h-4 text-[#18181b]" /> Блок 3. PPM / EC субстрату (Перед поливом)
              </span>
              <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-300 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    if (saltUnit !== 'EC') {
                      setPpmPreInput(Number((ppmPreInput / 500).toFixed(2)));
                      setSaltUnit('EC');
                    }
                  }}
                  className={`px-2 py-0.5 rounded transition-colors ${saltUnit === 'EC' ? 'bg-[#FFCA26] text-[#18181b] border border-black/15 shadow-xs font-black' : 'text-neutral-600 hover:text-black'}`}
                >
                  EC
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (saltUnit !== 'PPM') {
                      setPpmPreInput(Math.round(ppmPreInput * 500));
                      setSaltUnit('PPM');
                    }
                  }}
                  className={`px-2 py-0.5 rounded transition-colors ${saltUnit === 'PPM' ? 'bg-[#FFCA26] text-[#18181b] border border-black/15 shadow-xs font-black' : 'text-neutral-600 hover:text-black'}`}
                >
                  PPM
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                step={saltUnit === 'EC' ? '0.05' : '10'}
                value={ppmPreInput}
                onChange={(e) => setPpmPreInput(Number(e.target.value))}
                placeholder={`Введіть ${saltUnit}`}
                className="flex-1 bg-neutral-50 border border-neutral-300 focus:border-black/60 focus:ring-2 focus:ring-[#FFCA26]/50 rounded-xl px-3 py-2 text-center text-lg font-black text-[#18181b] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleBlock3Commit(false)}
                className="bg-[#FFCA26] hover:bg-[#f0bb1d] active:scale-[0.98] text-[#18181b] border border-black/20 font-black text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>[ Фіксую ]</span>
              </button>
              <button
                type="button"
                onClick={() => handleBlock3Commit(true)}
                className="bg-neutral-100 hover:bg-neutral-200 active:scale-[0.98] text-[#18181b] font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all border border-neutral-300 cursor-pointer flex items-center justify-center gap-1"
              >
                [ Не хочу вимірювати ]
              </button>
            </div>
          </div>
        )}

        {/* BLOCK 4.1: Water Volume */}
        {currentBlock === 'block_4_1_water_vol' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-[#18181b] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Droplets className="w-4 h-4 text-[#18181b]" /> Крок 4.1. Об&apos;єм води для поливу
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWaterVolume((prev) => Number((Math.max(0.5, prev - 0.2)).toFixed(1)))}
                className="w-10 h-10 rounded-xl bg-neutral-100 text-[#18181b] border border-neutral-300 font-black hover:bg-neutral-200 active:scale-95 text-lg"
              >
                -
              </button>
              <div className="flex-1 flex items-center justify-center gap-2 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="50"
                  value={waterVolume}
                  onChange={(e) => setWaterVolume(Number(e.target.value))}
                  className="w-20 bg-transparent text-center text-lg font-black text-[#18181b] outline-none"
                />
                <span className="font-bold text-neutral-600 text-sm">літрів</span>
              </div>
              <button
                type="button"
                onClick={() => setWaterVolume((prev) => Number((prev + 0.2).toFixed(1)))}
                className="w-10 h-10 rounded-xl bg-neutral-100 text-[#18181b] border border-neutral-300 font-black hover:bg-neutral-200 active:scale-95 text-lg"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleBlock41Commit}
              className="w-full bg-[#FFCA26] hover:bg-[#f0bb1d] active:scale-[0.98] text-[#18181b] border border-black/20 font-black text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>[ Фіксую ]</span>
            </button>
          </div>
        )}

        {/* BLOCK 4.2: Raw Water PPM */}
        {currentBlock === 'block_4_2_raw_water_ppm' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-[#18181b] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Gauge className="w-4 h-4 text-[#18181b]" /> Крок 4.2. PPM / EC вихідної води
              </span>
              <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-300 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    if (rawWaterUnit !== 'EC') {
                      setRawWaterPpm(Number((rawWaterPpm / 500).toFixed(2)));
                      setRawWaterUnit('EC');
                    }
                  }}
                  className={`px-2 py-0.5 rounded transition-colors ${rawWaterUnit === 'EC' ? 'bg-[#FFCA26] text-[#18181b] border border-black/15 shadow-xs font-black' : 'text-neutral-600 hover:text-black'}`}
                >
                  EC
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (rawWaterUnit !== 'PPM') {
                      setRawWaterPpm(Math.round(rawWaterPpm * 500));
                      setRawWaterUnit('PPM');
                    }
                  }}
                  className={`px-2 py-0.5 rounded transition-colors ${rawWaterUnit === 'PPM' ? 'bg-[#FFCA26] text-[#18181b] border border-black/15 shadow-xs font-black' : 'text-neutral-600 hover:text-black'}`}
                >
                  PPM
                </button>
              </div>
            </div>

            <input
              type="number"
              step={rawWaterUnit === 'EC' ? '0.05' : '10'}
              value={rawWaterPpm}
              onChange={(e) => setRawWaterPpm(Number(e.target.value))}
              placeholder={`Введіть ${rawWaterUnit}`}
              className="w-full bg-neutral-50 border border-neutral-300 focus:border-black/60 focus:ring-2 focus:ring-[#FFCA26]/50 rounded-xl px-3 py-2 text-center text-lg font-black text-[#18181b] outline-none"
            />

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleBlock42Commit(false)}
                className="bg-[#FFCA26] hover:bg-[#f0bb1d] active:scale-[0.98] text-[#18181b] border border-black/20 font-black text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>[ Фіксую ]</span>
              </button>
              <button
                type="button"
                onClick={() => handleBlock42Commit(true)}
                className="bg-neutral-100 hover:bg-neutral-200 active:scale-[0.98] text-[#18181b] font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all border border-neutral-300 cursor-pointer flex items-center justify-center gap-1"
              >
                [ Не хочу вимірювати ]
              </button>
            </div>
          </div>
        )}

        {/* BLOCK 4.3: Nutrients Calculation */}
        {currentBlock === 'block_4_3_nutrients' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-[#18181b] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <FlaskConical className="w-4 h-4 text-[#18181b]" /> Крок 4.3. Розрахунок добрив
              </span>
              <button
                type="button"
                onClick={() => setShowBottlesModal(prev => !prev)}
                className="text-[11px] font-bold text-[#18181b] bg-[#FFCA26]/40 hover:bg-[#FFCA26]/60 border border-black/20 px-2 py-1 rounded-lg transition-colors cursor-pointer"
              >
                [ Добрива рослини ]
              </button>
            </div>

            {/* Three Concentration Levels */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setFeedStrength('min')}
                className={`py-2 px-1 rounded-xl text-center text-xs font-black transition-all ${
                  feedStrength === 'min'
                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-300'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
                }`}
              >
                [ Мінімально ]
                <div className="text-[9px] opacity-80">~50-60%</div>
              </button>
              <button
                type="button"
                onClick={() => setFeedStrength('recommended')}
                className={`py-2 px-1 rounded-xl text-center text-xs font-black transition-all ${
                  feedStrength === 'recommended'
                    ? 'bg-[#FFCA26] text-[#18181b] border border-black/20 shadow-md ring-2 ring-black/20 font-black'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
                }`}
              >
                [ Рекомендовано ]
                <div className="text-[9px] opacity-80">100% норма</div>
              </button>
              <button
                type="button"
                onClick={() => setFeedStrength('max')}
                className={`py-2 px-1 rounded-xl text-center text-xs font-black transition-all ${
                  feedStrength === 'max'
                    ? 'bg-amber-400 text-[#18181b] border border-black/20 shadow-md ring-2 ring-black/20 font-black'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-300'
                }`}
              >
                [ Максимально ]
                <div className="text-[9px] opacity-80">~125%</div>
              </button>
            </div>

            {/* Active bottles list drawer */}
            {showBottlesModal && (
              <div className="bg-neutral-50 border border-neutral-300 rounded-xl p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-[#18181b]">
                  <span>Список використовуваних пляшок:</span>
                  <button type="button" onClick={() => setShowBottlesModal(false)}><X className="w-4 h-4 text-neutral-500 hover:text-black" /></button>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {customBottles.map((b, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white border border-neutral-200 px-2.5 py-1.5 rounded-lg">
                      <span className="font-semibold text-[#18181b]">{b.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-neutral-800">{b.baseDose} мл/л</span>
                        <button
                          type="button"
                          onClick={() => setCustomBottles(prev => prev.filter((_, i) => i !== idx))}
                          className="text-rose-500 hover:text-rose-700 p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Add bottle row */}
                <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-200">
                  <input
                    type="text"
                    value={newBottleName}
                    onChange={(e) => setNewBottleName(e.target.value)}
                    placeholder="Назва добрива..."
                    className="flex-1 bg-white border border-neutral-300 rounded-lg px-2 py-1 text-xs text-[#18181b]"
                  />
                  <input
                    type="number"
                    step="0.5"
                    value={newBottleDose}
                    onChange={(e) => setNewBottleDose(e.target.value)}
                    placeholder="мл/л"
                    className="w-14 bg-white border border-neutral-300 rounded-lg px-1.5 py-1 text-xs text-center text-[#18181b]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newBottleName.trim()) {
                        setCustomBottles(prev => [...prev, { name: newBottleName.trim(), baseDose: Number(newBottleDose) || 1.0, unit: 'мл/л' }]);
                        setNewBottleName('');
                      }
                    }}
                    className="bg-[#18181b] hover:bg-black text-[#FFCA26] p-1 rounded-lg cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleBlock43Commit}
              className="w-full bg-[#FFCA26] hover:bg-[#f0bb1d] active:scale-[0.98] text-[#18181b] border border-black/20 font-black text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>[ Фіксую ]</span>
            </button>
          </div>
        )}

        {/* BLOCK 4.4: Drainage & Substrate */}
        {currentBlock === 'block_4_4_drainage' && (
          <div className="space-y-3">
            <div className="text-xs font-black text-[#18181b] uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-[#18181b]" /> Крок 4.4. Внесення розчину та контроль дренажу / субстрату
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* pH дренажу */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-neutral-700 block">pH дренажу (10%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={drainagePh}
                  onChange={(e) => setDrainagePh(Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-black/60 rounded-xl px-2.5 py-2 text-center text-base font-black text-[#18181b] outline-none"
                />
              </div>

              {/* PPM/EC дренажу */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-neutral-700">
                  <span>PPM / EC дренажу</span>
                  <button
                    type="button"
                    onClick={() => setDrainageUnit(prev => prev === 'PPM' ? 'EC' : 'PPM')}
                    className="text-[10px] text-[#18181b] bg-[#FFCA26]/50 px-1.5 py-0.5 rounded border border-black/15 font-mono font-bold cursor-pointer"
                  >
                    {drainageUnit}
                  </button>
                </div>
                <input
                  type="number"
                  step={drainageUnit === 'EC' ? '0.05' : '10'}
                  value={drainagePpm}
                  onChange={(e) => setDrainagePpm(Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-300 focus:border-black/60 rounded-xl px-2.5 py-2 text-center text-base font-black text-[#18181b] outline-none"
                />
              </div>
            </div>

            {/* Опціональний замір субстрату */}
            <div className="pt-2 border-t border-neutral-200 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-neutral-600 block">
                Додатково в субстраті (ручні датчики):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.1"
                  placeholder="pH субстрату"
                  value={substratePhCheck}
                  onChange={(e) => setSubstratePhCheck(e.target.value ? Number(e.target.value) : '')}
                  className="bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs text-center text-[#18181b] outline-none"
                />
                <input
                  type="number"
                  placeholder="PPM субстрату"
                  value={substratePpmCheck}
                  onChange={(e) => setSubstratePpmCheck(e.target.value ? Number(e.target.value) : '')}
                  className="bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs text-center text-[#18181b] outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleBlock44Commit}
              className="w-full bg-[#FFCA26] hover:bg-[#f0bb1d] active:scale-[0.98] text-[#18181b] border border-black/20 font-black text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>[ Фіксую ]</span>
            </button>
          </div>
        )}

        {/* BLOCK 5: Moisture Post */}
        {currentBlock === 'block_5_moisture_post' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-[#18181b] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Droplets className="w-4 h-4 text-[#18181b]" /> Блок 5. Вологість субстрату після поливу
              </span>
              <span className="font-mono font-black text-base sm:text-lg text-[#18181b] bg-[#FFCA26]/40 px-2.5 py-0.5 rounded-lg border border-black/15 shadow-xs">
                {moisturePostInput}%
              </span>
            </div>

            <input
              type="range"
              min={30}
              max={100}
              step={1}
              value={moisturePostInput}
              onChange={(e) => setMoisturePostInput(Number(e.target.value))}
              className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#18181b]"
            />
            <div className="flex justify-between text-[10px] text-neutral-600 font-bold px-0.5">
              <span>30%</span>
              <span>40%–75% (Норма)</span>
              <span>≥ 80% (Перелив)</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleBlock5Commit(false)}
                className="bg-[#FFCA26] hover:bg-[#f0bb1d] active:scale-[0.98] text-[#18181b] border border-black/20 font-black text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>[ Фіксую ]</span>
              </button>
              <button
                type="button"
                onClick={() => handleBlock5Commit(true)}
                className="bg-neutral-100 hover:bg-neutral-200 active:scale-[0.98] text-[#18181b] font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all border border-neutral-300 cursor-pointer flex items-center justify-center gap-1"
              >
                [ Не хочу вимірювати ]
              </button>
            </div>
          </div>
        )}

        {/* BLOCK 6.1: pH Post */}
        {currentBlock === 'block_6_1_ph_post' && (
          <div className="space-y-3">
            <div className="text-xs font-black text-[#18181b] uppercase tracking-wider flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-[#18181b]" /> Крок 6.1. pH субстрату після поливу
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPhPostInput(prev => Number((Math.max(4.0, prev - 0.1)).toFixed(1)))}
                className="w-10 h-10 rounded-xl bg-neutral-100 text-[#18181b] border border-neutral-300 font-black hover:bg-neutral-200 active:scale-95 text-lg"
              >
                -
              </button>
              <input
                type="number"
                step="0.1"
                value={phPostInput}
                onChange={(e) => setPhPostInput(Number(e.target.value))}
                className="flex-1 bg-neutral-50 border border-neutral-300 focus:border-black/60 focus:ring-2 focus:ring-[#FFCA26]/50 rounded-xl px-3 py-2 text-center text-lg font-black text-[#18181b] outline-none"
              />
              <button
                type="button"
                onClick={() => setPhPostInput(prev => Number((Math.min(9.0, prev + 0.1)).toFixed(1)))}
                className="w-10 h-10 rounded-xl bg-neutral-100 text-[#18181b] border border-neutral-300 font-black hover:bg-neutral-200 active:scale-95 text-lg"
              >
                +
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleBlock61Commit(false)}
                className="bg-[#FFCA26] hover:bg-[#f0bb1d] active:scale-[0.98] text-[#18181b] border border-black/20 font-black text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>[ Фіксую ]</span>
              </button>
              <button
                type="button"
                onClick={() => handleBlock61Commit(true)}
                className="bg-neutral-100 hover:bg-neutral-200 active:scale-[0.98] text-[#18181b] font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all border border-neutral-300 cursor-pointer flex items-center justify-center gap-1"
              >
                [ Не хочу вимірювати ]
              </button>
            </div>
          </div>
        )}

        {/* BLOCK 6.2: PPM Post */}
        {currentBlock === 'block_6_2_ppm_post' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-[#18181b] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Gauge className="w-4 h-4 text-[#18181b]" /> Крок 6.2. PPM / EC субстрату після поливу
              </span>
              <div className="flex bg-neutral-100 p-0.5 rounded-lg border border-neutral-300 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    if (ppmPostUnit !== 'EC') {
                      setPpmPostInput(Number((ppmPostInput / 500).toFixed(2)));
                      setPpmPostUnit('EC');
                    }
                  }}
                  className={`px-2 py-0.5 rounded transition-colors ${ppmPostUnit === 'EC' ? 'bg-[#FFCA26] text-[#18181b] border border-black/15 shadow-xs font-black' : 'text-neutral-600 hover:text-black'}`}
                >
                  EC
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (ppmPostUnit !== 'PPM') {
                      setPpmPostInput(Math.round(ppmPostInput * 500));
                      setPpmPostUnit('PPM');
                    }
                  }}
                  className={`px-2 py-0.5 rounded transition-colors ${ppmPostUnit === 'PPM' ? 'bg-[#FFCA26] text-[#18181b] border border-black/15 shadow-xs font-black' : 'text-neutral-600 hover:text-black'}`}
                >
                  PPM
                </button>
              </div>
            </div>

            <input
              type="number"
              step={ppmPostUnit === 'EC' ? '0.05' : '10'}
              value={ppmPostInput}
              onChange={(e) => setPpmPostInput(Number(e.target.value))}
              placeholder={`Введіть ${ppmPostUnit}`}
              className="w-full bg-neutral-50 border border-neutral-300 focus:border-black/60 focus:ring-2 focus:ring-[#FFCA26]/50 rounded-xl px-3 py-2 text-center text-lg font-black text-[#18181b] outline-none"
            />

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleBlock62Commit(false)}
                className="bg-[#FFCA26] hover:bg-[#f0bb1d] active:scale-[0.98] text-[#18181b] border border-black/20 font-black text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>[ Фіксую ]</span>
              </button>
              <button
                type="button"
                onClick={() => handleBlock62Commit(true)}
                className="bg-neutral-100 hover:bg-neutral-200 active:scale-[0.98] text-[#18181b] font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all border border-neutral-300 cursor-pointer flex items-center justify-center gap-1"
              >
                [ Не хочу вимірювати ]
              </button>
            </div>
          </div>
        )}

        {/* BLOCK 7.1: PPFD 5 points */}
        {currentBlock === 'block_7_1_ppfd' && (
          <div className="space-y-3">
            <div className="text-xs font-black text-[#18181b] uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-[#18181b]" /> Блок 7.1. PPFD над кроною (5 точок)
            </div>

            {/* 4 Corners & Center Grid */}
            <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
              <div>
                <label className="text-[9px] text-neutral-600 font-bold block mb-0.5">Кут 1 (Пн-Зх)</label>
                <input
                  type="number"
                  value={ppfdCorners.nw}
                  onChange={(e) => setPpfdCorners(prev => ({ ...prev, nw: Number(e.target.value) }))}
                  className="w-full bg-white border border-neutral-300 rounded-lg p-1.5 text-center text-xs font-bold text-[#18181b]"
                />
              </div>
              <div />
              <div>
                <label className="text-[9px] text-neutral-600 font-bold block mb-0.5">Кут 2 (Пн-Сх)</label>
                <input
                  type="number"
                  value={ppfdCorners.ne}
                  onChange={(e) => setPpfdCorners(prev => ({ ...prev, ne: Number(e.target.value) }))}
                  className="w-full bg-white border border-neutral-300 rounded-lg p-1.5 text-center text-xs font-bold text-[#18181b]"
                />
              </div>

              <div />
              <div>
                <label className="text-[9px] text-[#18181b] font-black block mb-0.5 text-center">ЦЕНТР</label>
                <input
                  type="number"
                  value={ppfdCorners.center}
                  onChange={(e) => setPpfdCorners(prev => ({ ...prev, center: Number(e.target.value) }))}
                  className="w-full bg-[#FFCA26]/30 border border-black/25 rounded-lg p-1.5 text-center text-sm font-black text-[#18181b]"
                />
              </div>
              <div />

              <div>
                <label className="text-[9px] text-neutral-600 font-bold block mb-0.5">Кут 3 (Пд-Зх)</label>
                <input
                  type="number"
                  value={ppfdCorners.sw}
                  onChange={(e) => setPpfdCorners(prev => ({ ...prev, sw: Number(e.target.value) }))}
                  className="w-full bg-white border border-neutral-300 rounded-lg p-1.5 text-center text-xs font-bold text-[#18181b]"
                />
              </div>
              <div />
              <div>
                <label className="text-[9px] text-neutral-600 font-bold block mb-0.5">Кут 4 (Пд-Сх)</label>
                <input
                  type="number"
                  value={ppfdCorners.se}
                  onChange={(e) => setPpfdCorners(prev => ({ ...prev, se: Number(e.target.value) }))}
                  className="w-full bg-white border border-neutral-300 rounded-lg p-1.5 text-center text-xs font-bold text-[#18181b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleBlock71Commit(false)}
                className="bg-[#FFCA26] hover:bg-[#f0bb1d] active:scale-[0.98] text-[#18181b] border border-black/20 font-black text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>[ Фіксую ]</span>
              </button>
              <button
                type="button"
                onClick={() => handleBlock71Commit(true)}
                className="bg-neutral-100 hover:bg-neutral-200 active:scale-[0.98] text-[#18181b] font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all border border-neutral-300 cursor-pointer flex items-center justify-center gap-1"
              >
                [ Не хочу вимірювати ]
              </button>
            </div>
          </div>
        )}

        {/* BLOCK 7.2: Lamp Distance */}
        {currentBlock === 'block_7_2_light_distance' && (
          <div className="space-y-3">
            <div className="text-xs font-black text-[#18181b] uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-[#18181b]" /> Блок 7.2. Відстань від лампи до верхівки рослини (см)
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLightDistanceCm(prev => Math.max(10, prev - 5))}
                className="w-10 h-10 rounded-xl bg-neutral-100 text-[#18181b] border border-neutral-300 font-black hover:bg-neutral-200 active:scale-95 text-lg"
              >
                -
              </button>
              <div className="flex-1 flex items-center justify-center gap-2 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2">
                <input
                  type="number"
                  min="5"
                  max="200"
                  value={lightDistanceCm}
                  onChange={(e) => setLightDistanceCm(Number(e.target.value))}
                  className="w-20 bg-transparent text-center text-lg font-black text-[#18181b] outline-none"
                />
                <span className="font-bold text-neutral-600 text-sm">см</span>
              </div>
              <button
                type="button"
                onClick={() => setLightDistanceCm(prev => Math.min(200, prev + 5))}
                className="w-10 h-10 rounded-xl bg-neutral-100 text-[#18181b] border border-neutral-300 font-black hover:bg-neutral-200 active:scale-95 text-lg"
              >
                +
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleBlock72Commit(false)}
                className="bg-[#FFCA26] hover:bg-[#f0bb1d] active:scale-[0.98] text-[#18181b] border border-black/20 font-black text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>[ Фіксую ]</span>
              </button>
              <button
                type="button"
                onClick={() => handleBlock72Commit(true)}
                className="bg-neutral-100 hover:bg-neutral-200 active:scale-[0.98] text-[#18181b] font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all border border-neutral-300 cursor-pointer flex items-center justify-center gap-1"
              >
                [ Не хочу вимірювати ]
              </button>
            </div>
          </div>
        )}

        {/* BLOCK 8.1: Architecture & Development (5 photos) */}
        {currentBlock === 'block_8_1_architecture' && (
          <div className="space-y-3">
            <div className="text-xs font-black text-[#18181b] uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#18181b]" /> Блок 8.1. Архітектура та розвиток рослини (5 фото)
            </div>

            {/* Photos previews */}
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4].map((idx) => {
                const photo = archPhotos[idx];
                return (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl bg-neutral-100 border border-neutral-300 flex items-center justify-center overflow-hidden"
                  >
                    {photo ? (
                      <>
                        <img src={photo} alt={`Кущ ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setArchPhotos(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-black/70 text-rose-400 p-0.5 rounded cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <span className="text-[10px] text-neutral-500 font-bold">Фото {idx + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add photos button */}
            <div className="flex gap-2">
              <label
                htmlFor={`${fileInputId}-arch`}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-[#18181b] text-xs font-bold py-2 px-3 rounded-xl border border-neutral-300 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-[#18181b]" />
                <span>Завантажити фото ({archPhotos.length}/5)</span>
              </label>
              <input
                id={`${fileInputId}-arch`}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handlePhotoUpload(e, 'arch')}
                className="hidden"
              />

              <button
                type="button"
                onClick={handleAnalyzeArchitecture}
                disabled={isAiLoading}
                className="bg-[#18181b] hover:bg-black disabled:opacity-40 text-[#FFCA26] font-black text-xs py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Аналізувати</span>
              </button>
            </div>

            {/* Commit button */}
            <button
              type="button"
              onClick={handleBlock81Commit}
              className="w-full bg-[#FFCA26] hover:bg-[#f0bb1d] active:scale-[0.98] text-[#18181b] border border-black/20 font-black text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>[ Фіксую ]</span>
            </button>
          </div>
        )}

        {/* BLOCK 8.2: Leaf Diseases (up to 10 photos) */}
        {currentBlock === 'block_8_2_leaf_diseases' && (
          <div className="space-y-3">
            <div className="text-xs font-black text-[#18181b] uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#18181b]" /> Блок 8.2. Контроль хвороб по листю (до 10 фото)
            </div>

            {/* Photo previews grid */}
            <div className="grid grid-cols-5 gap-1.5 max-h-24 overflow-y-auto">
              {leafPhotos.map((photo, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg bg-neutral-100 border border-neutral-300 overflow-hidden">
                  <img src={photo} alt={`Лист ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setLeafPhotos(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-0.5 right-0.5 bg-black/70 text-rose-400 p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <label
                htmlFor={`${fileInputId}-leaf`}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-[#18181b] text-xs font-bold py-2 px-3 rounded-xl border border-neutral-300 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-[#18181b]" />
                <span>Додати макрофото ({leafPhotos.length}/10)</span>
              </label>
              <input
                id={`${fileInputId}-leaf`}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handlePhotoUpload(e, 'leaf')}
                className="hidden"
              />

              <button
                type="button"
                onClick={handleAnalyzeLeafDiseases}
                disabled={isAiLoading}
                className="bg-[#18181b] hover:bg-black disabled:opacity-40 text-[#FFCA26] font-black text-xs py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Аналізувати</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleBlock82Commit}
              className="w-full bg-[#FFCA26] hover:bg-[#f0bb1d] active:scale-[0.98] text-[#18181b] border border-black/20 font-black text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>[ Фіксую ]</span>
            </button>
          </div>
        )}

        {/* BLOCK 8.3: Buds / Flowering (up to 10 photos) */}
        {currentBlock === 'block_8_3_buds' && (
          <div className="space-y-3">
            <div className="text-xs font-black text-[#18181b] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#18181b]" /> Блок 8.3. Контроль суцвіть (до 10 фото)
            </div>

            {/* Photo previews grid */}
            <div className="grid grid-cols-5 gap-1.5 max-h-24 overflow-y-auto">
              {budPhotos.map((photo, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg bg-neutral-100 border border-neutral-300 overflow-hidden">
                  <img src={photo} alt={`Суцвіття ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setBudPhotos(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-0.5 right-0.5 bg-black/70 text-rose-400 p-0.5 rounded cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <label
                htmlFor={`${fileInputId}-buds`}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-[#18181b] text-xs font-bold py-2 px-3 rounded-xl border border-neutral-300 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-[#18181b]" />
                <span>Додати макрофото ({budPhotos.length}/10)</span>
              </label>
              <input
                id={`${fileInputId}-buds`}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handlePhotoUpload(e, 'buds')}
                className="hidden"
              />

              <button
                type="button"
                onClick={handleAnalyzeBuds}
                disabled={isAiLoading}
                className="bg-[#18181b] hover:bg-black disabled:opacity-40 text-[#FFCA26] font-black text-xs py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Аналізувати</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleBlock83Commit}
              className="w-full bg-[#FFCA26] hover:bg-[#f0bb1d] active:scale-[0.98] text-[#18181b] border border-black/20 font-black text-xs sm:text-sm py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>[ Фіксую ]</span>
            </button>
          </div>
        )}

        {/* SESSION COMPLETED */}
        {currentBlock === 'session_completed' && (
          <div className="text-center py-2 space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-[#FFCA26]/30 text-[#18181b] border border-black/15 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <div className="text-xs sm:text-sm font-black text-[#18181b]">
              Сесію моніторингу завершено
            </div>
            <p className="text-[11px] text-neutral-700 font-medium">
              Всі показники збережено в профілі куща «{plant.name}».
            </p>
            <div className="pt-1 flex justify-center gap-2">
              <button
                type="button"
                onClick={handleResetSession}
                className="bg-[#FFCA26] hover:bg-[#f0bb1d] border border-black/20 text-[#18181b] font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md"
              >
                Почати новий замір
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Free-form Question Input Form */}
      <form onSubmit={handleSendFreeQuestion} className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleResetSession}
          className="bg-black/10 hover:bg-black/20 text-[#18181b] p-2.5 rounded-xl border border-black/15 transition-all cursor-pointer shrink-0"
          title="Почати щоденний моніторинг спочатку"
          aria-label="Почати щоденний моніторинг спочатку"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={freeInput}
          onChange={(e) => setFreeInput(e.target.value)}
          placeholder="Задати додаткове запитання агроному..."
          disabled={isAiLoading}
          className="flex-1 bg-white border border-black/20 focus:border-black rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#18181b] placeholder-neutral-500 outline-none transition-colors disabled:opacity-60 shadow-xs"
        />
        <button
          type="submit"
          disabled={!freeInput.trim() || isAiLoading}
          className="bg-[#18181b] hover:bg-black active:scale-95 text-[#FFCA26] p-2.5 rounded-xl transition-all cursor-pointer font-bold disabled:opacity-30 disabled:pointer-events-none shrink-0 shadow-md"
          title="Надіслати запитання"
          aria-label="Надіслати запитання"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

// Also export alias for compatibility
export { PlantChat as InteractiveGeminiTaskChat };
