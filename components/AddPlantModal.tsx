'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plant, SubstrateRecipe, NutrientProduct } from '@/lib/types';
import { MEDICAL_STRAINS, StrainInfo, GLOBAL_SEEDBANK_BREEDERS, getStrainInfo, getStrainsForBreeder } from '@/lib/growData';
import { Plus, X, Sprout, Search, Check, Sparkles, Building2, Layers, Sliders, ChevronRight, CheckCircle2, FlaskConical, Droplets, Info, ShieldCheck, ChevronDown, ChevronUp, ShoppingBag, Trash2, AlertTriangle, HelpCircle } from 'lucide-react';
import { LightSchedulePicker } from '@/components/LightSchedulePicker';
import { InitialStageRoller, calculatePlantStage } from '@/components/InitialStageRoller';
import { 
  SUBSTRATE_MANUFACTURERS, 
  PRESET_SUBSTRATE_RECIPES, 
  WORLD_GROWER_RECIPES,
  WorldGrowerRecipe,
  getDefaultRecipeForMedium, 
  getRecommendedGrowerRecipes 
} from '@/lib/substrateData';
import {
  NUTRIENT_MANUFACTURERS,
  NUTRIENT_PRODUCTS_DATABASE,
  PRESET_NUTRIENT_SCHEDULES,
  NutrientManufacturer,
  getProductsByManufacturer,
  getSchedulesByManufacturer,
  generateAIFeedingStrategies,
  getRecommendedSmartKit,
  getTieredRecommendedKit,
  KitTier,
  calculateFullCycleFertilizerNeeds,
  formatProductDisplayName,
  getProductImageUrl
} from '@/lib/nutrientData';

export type PlantStageKey = 'root' | 'veg' | 'bloom' | 'flush';

export interface StageConfig {
  key: PlantStageKey;
  title: string;
  shortTitle: string;
  emoji: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  description: string;
}

export const STAGE_CONFIGS: StageConfig[] = [
  {
    key: 'root',
    title: 'Коріння & Сходи',
    shortTitle: 'Коріння',
    emoji: '🌱',
    badgeBg: 'bg-emerald-950/90',
    badgeText: 'text-emerald-300',
    borderColor: 'border-emerald-500/50',
    description: '1-2 тиждень: Укорінення, мікориза, корисні мікроби, ризобактерії'
  },
  {
    key: 'veg',
    title: 'Вегетація',
    shortTitle: 'Вегетація',
    emoji: '🌿',
    badgeBg: 'bg-green-950/90',
    badgeText: 'text-green-300',
    borderColor: 'border-green-500/50',
    description: '3-5 тижні: Базовий азот (N), ростова формула, нарощування зелені'
  },
  {
    key: 'bloom',
    title: 'Цвітіння & Бустери',
    shortTitle: 'Цвітіння',
    emoji: '🌸',
    badgeBg: 'bg-pink-950/90',
    badgeText: 'text-pink-300',
    borderColor: 'border-pink-500/50',
    description: '6-11 тижні: Фосфор (P), калій (K), стимулятори цвітіння, терпени'
  },
  {
    key: 'flush',
    title: 'Промивка & Фініш',
    shortTitle: 'Промивка',
    emoji: '🧼',
    badgeBg: 'bg-cyan-950/90',
    badgeText: 'text-cyan-300',
    borderColor: 'border-cyan-500/50',
    description: 'Останні 1-2 тижні: Ензими, виведення солей, дозрівання суцвіть'
  }
];

export function getProductStageKey(prod: NutrientProduct): PlantStageKey {
  const cat = (prod.category || '').toLowerCase();
  const name = (prod.name || '').toLowerCase();
  const desc = (prod.description || '').toLowerCase();

  if (
    cat.includes('root') ||
    cat.includes('microb') ||
    cat.includes('silicon') ||
    name.includes('root') ||
    name.includes('tarantula') ||
    name.includes('piranha') ||
    name.includes('voodoo') ||
    name.includes('rhizo') ||
    name.includes('myco') ||
    name.includes('b-52') ||
    desc.includes('корін') ||
    desc.includes('укорін')
  ) {
    return 'root';
  }

  if (
    cat.includes('flush') ||
    cat.includes('enzyme') ||
    name.includes('flush') ||
    name.includes('flawless') ||
    name.includes('final') ||
    name.includes('ripen') ||
    name.includes('zym') ||
    name.includes('kleen') ||
    desc.includes('промив') ||
    desc.includes('ензим')
  ) {
    return 'flush';
  }

  if (
    name.includes('grow') ||
    name.includes('veg') ||
    name.includes('tnt') ||
    name.includes('terra vega') ||
    (cat.includes('base') && !name.includes('bloom') && !name.includes('flo') && !name.includes('part 2')) ||
    desc.includes('вегетаці')
  ) {
    return 'veg';
  }

  return 'bloom';
}

interface AddPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlant: (plant: Plant) => void;
  initialStrain?: StrainInfo | null;
}

export const AddPlantModal: React.FC<AddPlantModalProps> = ({
  isOpen,
  onClose,
  onAddPlant,
  initialStrain
}) => {
  // Об'єднання повного реєстру брідерів та сортів
  const uniqueBreeders = useMemo(() => {
    const set = new Set<string>(GLOBAL_SEEDBANK_BREEDERS);
    MEDICAL_STRAINS.forEach((s) => {
      if (s.breeder) set.add(s.breeder);
    });
    return Array.from(set);
  }, []);

  const [selectedBreeder, setSelectedBreeder] = useState<string>(
    initialStrain?.breeder || 'Royal Queen Seeds'
  );
  const [customBreederName, setCustomBreederName] = useState<string>('');

  const effectiveBreeder = useMemo(() => {
    if (selectedBreeder.includes('Інший')) {
      return customBreederName.trim() || 'Офіційний Брідер';
    }
    return selectedBreeder;
  }, [selectedBreeder, customBreederName]);

  const [strainQuery, setStrainQuery] = useState<string>(
    initialStrain ? initialStrain.name : 'Northern Lights Automatic'
  );
  const [selectedStrain, setSelectedStrain] = useState<StrainInfo | null>(
    initialStrain || MEDICAL_STRAINS[0]
  );

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  const [medium, setMedium] = useState<'Soil' | 'Coco' | 'Hydroponics'>('Soil');
  const [substrateChoiceType, setSubstrateChoiceType] = useState<'commercial' | 'recipe'>('commercial');
  const [selectedSubstrateManufacturer, setSelectedSubstrateManufacturer] = useState<string>('BioBizz');
  const [selectedCommercialSubstrateId, setSelectedCommercialSubstrateId] = useState<string>('biobizz-allmix');
  const [activeSubstrateRecipe, setActiveSubstrateRecipe] = useState<SubstrateRecipe>(() => 
    JSON.parse(JSON.stringify(WORLD_GROWER_RECIPES[0]))
  );

  const availableSubstrates = useMemo(() => {
    const filtered = PRESET_SUBSTRATE_RECIPES.filter(
      r => r.manufacturer === selectedSubstrateManufacturer
    );
    if (filtered.length > 0) return filtered;
    return PRESET_SUBSTRATE_RECIPES;
  }, [selectedSubstrateManufacturer]);

  const handleSubstrateManufacturerChange = (mId: string) => {
    setSelectedSubstrateManufacturer(mId);
    setSubstrateChoiceType('commercial');
    const presetsForM = PRESET_SUBSTRATE_RECIPES.filter(r => r.manufacturer === mId);
    if (presetsForM.length > 0) {
      setSelectedCommercialSubstrateId(presetsForM[0].id);
      setMedium(presetsForM[0].mediumType);
    }
  };

  const handleSubstrateRecipeChange = (recipeId: string) => {
    setSelectedCommercialSubstrateId(recipeId);
    setSubstrateChoiceType('commercial');
    const chosen = PRESET_SUBSTRATE_RECIPES.find(r => r.id === recipeId);
    if (chosen) {
      setMedium(chosen.mediumType);
    }
  };

  const recommendedWorldRecipes = useMemo(() => {
    return getRecommendedGrowerRecipes(selectedStrain?.name, effectiveBreeder);
  }, [selectedStrain?.name, effectiveBreeder]);

  const handleWorldRecipeChange = (recipeId: string) => {
    const found = WORLD_GROWER_RECIPES.find(r => r.id === recipeId);
    if (found) {
      const cloned = JSON.parse(JSON.stringify(found));
      setActiveSubstrateRecipe(cloned);
      setMedium(cloned.mediumType);
      setSubstrateChoiceType('recipe');
    }
  };

  const [plantAgeDays, setPlantAgeDays] = useState<number>(7);
  const [potSize, setPotSize] = useState<number>(3);
  const [potType, setPotType] = useState<'plastic' | 'fabric' | 'airpot'>('fabric');
  const [lightSchedule, setLightSchedule] = useState<'18/6' | '12/12' | '20/4' | '24/0'>('18/6');

  // Nutrients & Feeding States
  const [selectedNutrientManufacturer, setSelectedNutrientManufacturer] = useState<string>('advanced-nutrients');
  const [selectedNutrientLineId, setSelectedNutrientLineId] = useState<string>('an-ph-perfect-photo');
  const [showNutrientProductsCatalog, setShowNutrientProductsCatalog] = useState<boolean>(false);
  const [showFeedingScheduleDetails, setShowFeedingScheduleDetails] = useState<boolean>(true);

  // Dynamic Manufacturers and Products Database
  const [customManufacturersList, setCustomManufacturersList] = useState<NutrientManufacturer[]>(NUTRIENT_MANUFACTURERS);
  const [customProductsDatabase, setCustomProductsDatabase] = useState<NutrientProduct[]>(NUTRIENT_PRODUCTS_DATABASE);
  const [isManufacturerSelectorOpen, setIsManufacturerSelectorOpen] = useState<boolean>(true);
  const [isAiKitSelectorOpen, setIsAiKitSelectorOpen] = useState<boolean>(true);
  const [manufacturerSearchQuery, setManufacturerSearchQuery] = useState<string>(''); // Empty search query by default

  // Selected Products map, Kit Tier & Selected AI Strategy ID
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedKitTier, setSelectedKitTier] = useState<KitTier>('amateur');
  const [selectedAIStrategyId, setSelectedAIStrategyId] = useState<string>('ai-balanced');

  // Nutrient Selector Tabs & Filters
  const [nutrientSelectorTab, setNutrientSelectorTab] = useState<'catalog' | 'selected'>('catalog');
  const [catalogStageFilter, setCatalogStageFilter] = useState<'all' | PlantStageKey>('all');

  // Active nutrient manufacturer object
  const activeNutrientManufacturer = useMemo(() => {
    return customManufacturersList.find(m => m.id === selectedNutrientManufacturer) || customManufacturersList[0] || NUTRIENT_MANUFACTURERS[0];
  }, [customManufacturersList, selectedNutrientManufacturer]);

  // Filtered manufacturers by search query (starts empty by default)
  const filteredManufacturers = useMemo(() => {
    const q = manufacturerSearchQuery.trim().toLowerCase();
    if (!q) return customManufacturersList;
    return customManufacturersList.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.country.toLowerCase().includes(q) ||
      m.specialty.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q)
    );
  }, [customManufacturersList, manufacturerSearchQuery]);

  // Available schedules for selected manufacturer
  const availableSchedulesForMfr = useMemo(() => {
    return getSchedulesByManufacturer(selectedNutrientManufacturer);
  }, [selectedNutrientManufacturer]);

  // Products for selected manufacturer
  const activeManufacturerProducts = useMemo(() => {
    const fromCustom = customProductsDatabase.filter(p => p.manufacturerId === selectedNutrientManufacturer);
    if (fromCustom.length > 0) return fromCustom;
    return getProductsByManufacturer(selectedNutrientManufacturer);
  }, [customProductsDatabase, selectedNutrientManufacturer]);

  // Map of all available products (standard DB + custom DB)
  const allProductsMap = useMemo(() => {
    const map = new Map<string, NutrientProduct>();
    NUTRIENT_PRODUCTS_DATABASE.forEach(p => map.set(p.id, p));
    customProductsDatabase.forEach(p => map.set(p.id, p));
    return map;
  }, [customProductsDatabase]);

  // Map of all manufacturers for multi-brand badges
  const manufacturersMap = useMemo(() => {
    const map = new Map<string, NutrientManufacturer>();
    customManufacturersList.forEach(m => map.set(m.id, m));
    NUTRIENT_MANUFACTURERS.forEach(m => {
      if (!map.has(m.id)) map.set(m.id, m);
    });
    return map;
  }, [customManufacturersList]);

  // Currently selected products list across all manufacturers
  const selectedProductsList = useMemo(() => {
    return selectedProductIds
      .map(id => allProductsMap.get(id))
      .filter((p): p is NutrientProduct => p !== undefined);
  }, [selectedProductIds, allProductsMap]);

  // Active manufacturer products grouped by growth stage
  const activeProductsByStage = useMemo(() => {
    const grouped: Record<PlantStageKey, NutrientProduct[]> = {
      root: [],
      veg: [],
      bloom: [],
      flush: []
    };
    activeManufacturerProducts.forEach(prod => {
      const stage = getProductStageKey(prod);
      grouped[stage].push(prod);
    });
    return grouped;
  }, [activeManufacturerProducts]);

  // Selected products grouped by growth stage
  const selectedProductsByStage = useMemo(() => {
    const grouped: Record<PlantStageKey, NutrientProduct[]> = {
      root: [],
      veg: [],
      bloom: [],
      flush: []
    };
    selectedProductsList.forEach(prod => {
      const stage = getProductStageKey(prod);
      grouped[stage].push(prod);
    });
    return grouped;
  }, [selectedProductsList]);

  // Cycle completeness analysis & advisor hints for selected products
  const selectedProductsCycleAdvice = useMemo(() => {
    const rootCount = selectedProductsByStage.root.length;
    const vegCount = selectedProductsByStage.veg.length;
    const bloomCount = selectedProductsByStage.bloom.length;
    const flushCount = selectedProductsByStage.flush.length;

    const checks = [
      {
        key: 'root' as PlantStageKey,
        title: 'Коріння & Сходи',
        emoji: '🌱',
        isCovered: rootCount > 0,
        count: rootCount,
        okMsg: `Покрито (${rootCount} шт.)`,
        warnMsg: '⚠️ Відсутній стимулятор коріння — рекомендовано для укорінення (Root / Microbes)'
      },
      {
        key: 'veg' as PlantStageKey,
        title: 'База Вегетації',
        emoji: '🌿',
        isCovered: vegCount > 0,
        count: vegCount,
        okMsg: `Покрито (${vegCount} шт.)`,
        warnMsg: '⚠️ Відсутня база для вегетації (Grow / NPK) — потрібен азот для нарощування зелені'
      },
      {
        key: 'bloom' as PlantStageKey,
        title: 'Цвітіння & Бустери',
        emoji: '🌸',
        isCovered: bloomCount > 0,
        count: bloomCount,
        okMsg: `Покрито (${bloomCount} шт.)`,
        warnMsg: '⚠️ Відсутні добрива для цвітіння (Bloom / PK) — потрібен фосфор і калій'
      },
      {
        key: 'flush' as PlantStageKey,
        title: 'Промивка & Ензими',
        emoji: '🧼',
        isCovered: flushCount > 0,
        count: flushCount,
        okMsg: `Покрито (${flushCount} шт.)`,
        warnMsg: '💡 Порада: Промивка (Flush) та Ензими вимивають солі й покращують смак'
      }
    ];

    const mainCovered = rootCount > 0 && vegCount > 0 && bloomCount > 0;

    return {
      checks,
      mainCovered,
      totalCount: selectedProductsList.length
    };
  }, [selectedProductsByStage, selectedProductsList]);

  // Normalization helper for deduplication
  const normalizeName = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

  const handleSelectManufacturer = (mfrId: string) => {
    setSelectedNutrientManufacturer(mfrId);
  };

  // Synchronize products and schedule when selected manufacturer, strain, or substrate medium changes
  const [prevMfr, setPrevMfr] = useState(selectedNutrientManufacturer);
  const [prevStrain, setPrevStrain] = useState(selectedStrain);
  const [prevMedium, setPrevMedium] = useState(medium);

  if (prevMfr !== selectedNutrientManufacturer || prevStrain !== selectedStrain || prevMedium !== medium) {
    setPrevMfr(selectedNutrientManufacturer);
    setPrevStrain(selectedStrain);
    setPrevMedium(medium);
    const isAuto = selectedStrain?.isAuto ?? true;
    
    // Note: selectedProductIds is NOT reset so selections across multiple manufacturers persist!
    
    const matchedSchedules = getSchedulesByManufacturer(selectedNutrientManufacturer);
    if (matchedSchedules.length > 0) {
      const autoMatched = matchedSchedules.find(s => s.forAutoflower === isAuto) || matchedSchedules[0];
      setSelectedNutrientLineId(autoMatched.id);
    } else {
      setSelectedNutrientLineId(`custom-${selectedNutrientManufacturer}`);
    }
  }

  const handleSelectKitTier = (tier: KitTier) => {
    setSelectedKitTier(tier);
    const isAuto = selectedStrain?.isAuto ?? true;
    const kit = getTieredRecommendedKit(selectedNutrientManufacturer, tier, medium, isAuto);
    const kitIds = kit.map(p => p.id);
    setSelectedProductIds(prev => {
      const currentMfrProductIds = new Set(activeManufacturerProducts.map(p => p.id));
      const nonCurrentMfrIds = prev.filter(id => !currentMfrProductIds.has(id));
      return Array.from(new Set([...nonCurrentMfrIds, ...kitIds]));
    });
  };

  const selectSmartKit = () => {
    const isAuto = selectedStrain?.isAuto ?? true;
    const smartKit = getTieredRecommendedKit(selectedNutrientManufacturer, selectedKitTier, medium, isAuto);
    const kitIds = smartKit.map(p => p.id);
    setSelectedProductIds(prev => {
      const currentMfrProductIds = new Set(activeManufacturerProducts.map(p => p.id));
      const nonCurrentMfrIds = prev.filter(id => !currentMfrProductIds.has(id));
      return Array.from(new Set([...nonCurrentMfrIds, ...kitIds]));
    });
  };

  const toggleProductSelection = (prodId: string) => {
    setSelectedProductIds(prev => 
      prev.includes(prodId) ? prev.filter(id => id !== prodId) : [...prev, prodId]
    );
  };

  const selectAllProducts = () => {
    setSelectedProductIds(prev => Array.from(new Set([...prev, ...activeManufacturerProducts.map(p => p.id)])));
  };

  const clearAllProducts = () => {
    setSelectedProductIds([]);
  };

  const activeSelectedProducts = useMemo(() => {
    return activeManufacturerProducts.filter(p => selectedProductIds.includes(p.id));
  }, [activeManufacturerProducts, selectedProductIds]);

  const currentSelectedSubstrate = useMemo(() => {
    if (substrateChoiceType === 'commercial') {
      return PRESET_SUBSTRATE_RECIPES.find(s => s.id === selectedCommercialSubstrateId) 
        || availableSubstrates[0]
        || getDefaultRecipeForMedium(medium, selectedSubstrateManufacturer);
    }
    return activeSubstrateRecipe;
  }, [substrateChoiceType, selectedCommercialSubstrateId, availableSubstrates, medium, selectedSubstrateManufacturer, activeSubstrateRecipe]);

  // AI Assistant 5 Feeding Strategies calculated for strain, substrate, pot size, plant age
  const aiFeedingStrategies = useMemo(() => {
    return generateAIFeedingStrategies({
      manufacturerId: selectedNutrientManufacturer,
      manufacturerName: activeNutrientManufacturer.name,
      selectedProducts: activeSelectedProducts,
      isAutoflower: selectedStrain?.isAuto ?? true,
      medium: medium || 'Soil',
      potSizeLiters: potSize || 10,
      plantAgeDays: plantAgeDays || 7,
      strainName: selectedStrain?.name,
      substrateRecipe: currentSelectedSubstrate
    });
  }, [selectedNutrientManufacturer, activeNutrientManufacturer.name, activeSelectedProducts, selectedStrain, medium, potSize, plantAgeDays, currentSelectedSubstrate]);

  const activeAIStrategy = useMemo(() => {
    return aiFeedingStrategies.find(s => s.id === selectedAIStrategyId) || aiFeedingStrategies[0];
  }, [aiFeedingStrategies, selectedAIStrategyId]);

  // Full grow cycle fertilizer requirements calculation (total mL and bottle sizes)
  const fullCycleRequirements = useMemo(() => {
    return calculateFullCycleFertilizerNeeds({
      selectedProducts: activeSelectedProducts,
      strategy: activeAIStrategy,
      potSizeLiters: potSize || 10,
      medium: medium || 'Soil',
      isAutoflower: selectedStrain?.isAuto ?? true
    });
  }, [activeSelectedProducts, activeAIStrategy, potSize, medium, selectedStrain]);

  // Active nutrient schedule object
  const activeNutrientSchedule = useMemo(() => {
    if (availableSchedulesForMfr.length > 0) {
      const matched = availableSchedulesForMfr.find(s => s.id === selectedNutrientLineId) || availableSchedulesForMfr[0];
      return matched;
    }
    // Fallback auto-generated schedule for manufacturers without explicit preset line
    const mfrProducts = getProductsByManufacturer(selectedNutrientManufacturer);
    const isAuto = selectedStrain?.isAuto ?? true;
    return {
      id: `custom-${selectedNutrientManufacturer}`,
      manufacturerId: activeNutrientManufacturer.id,
      manufacturerName: activeNutrientManufacturer.name,
      name: `${activeNutrientManufacturer.name} Комплекс (${isAuto ? 'Автоквіти' : 'Фотоперіоди'})`,
      description: `Базовий набір продуктів від ${activeNutrientManufacturer.name} з адаптованим дозуванням під ${isAuto ? 'автоквіти' : 'фотоперіоди'}.`,
      mediumType: 'Soil' as const,
      forAutoflower: isAuto,
      notes: 'Базова універсальна схема живлення',
      stageDoses: [
        { stageId: 'germination' as const, stageNameUk: 'Сходи (1 тиждень)', products: [] as { productId: string; productName: string; dosageMlPerL: number; notes?: string }[], targetPh: '6.2 - 6.4', targetPpm: '250 - 350 PPM' },
        { stageId: 'seedling' as const, stageNameUk: 'Розсада (2 тиждень)', products: mfrProducts.slice(0, 1).map(p => ({ productId: p.id, productName: p.name, dosageMlPerL: isAuto ? 1.0 : 1.5, notes: undefined as string | undefined })), targetPh: '6.2 - 6.5', targetPpm: '400 - 600 PPM' },
        { stageId: 'vegetative' as const, stageNameUk: 'Вегетація (3-5 тижні)', products: mfrProducts.filter(p => p.category === 'Base' || p.category === 'Organic').map(p => ({ productId: p.id, productName: p.name, dosageMlPerL: isAuto ? 2.0 : 3.0, notes: undefined as string | undefined })), targetPh: '6.3 - 6.6', targetPpm: '700 - 950 PPM' },
        { stageId: 'flowering' as const, stageNameUk: 'Цвітіння (6-10 тижні)', products: mfrProducts.filter(p => p.category === 'Base' || p.category === 'Boost').map(p => ({ productId: p.id, productName: p.name, dosageMlPerL: isAuto ? 2.5 : 3.5, notes: undefined as string | undefined })), targetPh: '6.3 - 6.5', targetPpm: '900 - 1200 PPM' },
        { stageId: 'harvest' as const, stageNameUk: 'Промивка (Фініш)', products: [] as { productId: string; productName: string; dosageMlPerL: number; notes?: string }[], targetPh: '6.0 - 6.4', targetPpm: '100 - 200 PPM' }
      ]
    };
  }, [selectedNutrientManufacturer, selectedNutrientLineId, availableSchedulesForMfr, activeNutrientManufacturer, selectedStrain]);

  const currentStageInfo = useMemo(() => {
    return calculatePlantStage(plantAgeDays, selectedStrain);
  }, [plantAgeDays, selectedStrain]);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live filtered strains based on breeder selection and typed strain query
  const filteredStrains = useMemo(() => {
    const q = strainQuery.trim().toLowerCase();
    const available = getStrainsForBreeder(selectedBreeder);

    const matches = available.filter((s) => {
      // Query match check (match strain name, type, thc/cbd or breeder name)
      return (
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.type.toLowerCase().includes(q) ||
        (s.breeder && s.breeder.toLowerCase().includes(q))
      );
    });

    // Якщо введено пошуковий запит, якого немає в базовому списку, додаємо його першим елементом
    if (q && !matches.some(s => s.name.toLowerCase() === q)) {
      const dynamicStrain = getStrainInfo(strainQuery.trim(), effectiveBreeder);
      return [dynamicStrain, ...matches];
    }

    return matches;
  }, [selectedBreeder, strainQuery, effectiveBreeder]);

  if (!isOpen) return null;

  const handleSelectStrain = (st: StrainInfo) => {
    setStrainQuery(st.name);
    setSelectedStrain(st);
    if (st.breeder) {
      setSelectedBreeder(st.breeder);
    }
    setIsSearchOpen(false);
  };

  const handleBreederSelect = (val: string) => {
    setSelectedBreeder(val);
    const available = getStrainsForBreeder(val);
    if (available.length > 0) {
      setSelectedStrain(available[0]);
      setStrainQuery(available[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalStrainName = strainQuery.trim() || 'Медичний Кущ';
    const finalBreeder = (effectiveBreeder || 'Royal Queen Seeds').trim();

    // Пошук або формування профілю сорту з генетичної бази
    const activeStrain =
      selectedStrain && selectedStrain.name.toLowerCase() === finalStrainName.toLowerCase()
        ? { ...selectedStrain, breeder: finalBreeder }
        : getStrainInfo(finalStrainName, finalBreeder);

    const stageCalc = calculatePlantStage(plantAgeDays, activeStrain);

    const germinationDateObj = new Date(Date.now() - plantAgeDays * 24 * 60 * 60 * 1000);
    const germinationDateStr = germinationDateObj.toISOString().split('T')[0];

    let finalSubstrateRecipe: SubstrateRecipe;
    let finalMedium = medium;

    if (substrateChoiceType === 'commercial') {
      const chosenCommercial = PRESET_SUBSTRATE_RECIPES.find(s => s.id === selectedCommercialSubstrateId) 
        || availableSubstrates[0]
        || getDefaultRecipeForMedium(medium, selectedSubstrateManufacturer);
      
      finalSubstrateRecipe = JSON.parse(JSON.stringify(chosenCommercial));
      finalMedium = chosenCommercial.mediumType || medium;
    } else {
      finalSubstrateRecipe = JSON.parse(JSON.stringify(activeSubstrateRecipe));
      finalMedium = activeSubstrateRecipe.mediumType || medium;
    }

    const newPlant: Plant = {
      id: `plant-${Date.now()}`,
      name: finalStrainName,
      strain: finalStrainName,
      breeder: finalBreeder,
      strainType: activeStrain.type || 'Hybrid',
      isAuto: activeStrain.isAuto ?? true,
      thcContent: activeStrain.thc || '18%',
      cbdContent: activeStrain.cbd || '1%',
      medicalBenefits: activeStrain.medicalUses || ['Стрес', 'Релакс'],
      stage: stageCalc.stage,
      stageDay: stageCalc.stageDay,
      totalStageDays: stageCalc.totalStageDays,
      germinationDate: germinationDateStr,
      currentTemp: 24,
      currentHumidity: 60,
      currentPH: 6.2,
      currentEC: 1.2,
      lightSchedule,
      lightDistanceCm: 45,
      lightPowerWatts: 150,
      medium: finalMedium,
      potSize: potSize,
      potType: potType,
      nutrientBrand: activeNutrientManufacturer.name,
      nutrientPlan: {
        brandId: activeNutrientManufacturer.id,
        brandName: activeNutrientManufacturer.name,
        lineId: activeAIStrategy.id,
        lineName: `${activeNutrientManufacturer.name} - ${activeAIStrategy.title}`,
        customProducts: activeSelectedProducts,
        stageDoses: activeAIStrategy.allStageDoses,
        notes: `${activeAIStrategy.aiRecommendationReason} | Об'єм води за 1 полив: ~${activeAIStrategy.waterPerWateringLiters}Л.`
      },
      substrateRecipe: {
        ...finalSubstrateRecipe,
        mediumType: finalMedium,
        confirmed: false // Not yet confirmed by user on plant card
      },
      healthScore: 100,
      notes: 'Нова рослина додана у гроубокс.',
      lastWatered: new Date().toISOString().split('T')[0],
      symptoms: []
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`substrate_confirmed_${newPlant.id}`);
      } catch (e) {}
    }

    onAddPlant(newPlant);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 overflow-y-auto">
      <div className="bg-[#121316] border-0 sm:border border-neutral-800 rounded-none sm:rounded-3xl p-3 sm:p-6 w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] overflow-y-auto shadow-2xl space-y-4 text-white">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Sprout className="w-5 h-5 text-[#d8f087]" />
            Додавання нової рослини у гроубокс
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-white cursor-pointer p-1.5 rounded-full hover:bg-neutral-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 1. ВИРОБНИК ТА НАЗВА СОРТУ */}
          <div className="space-y-3 bg-[#18191c] border border-neutral-800 rounded-2xl p-3.5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <label className="text-white font-black text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[#d8f087] shrink-0" />
                <span>1. Виробник та Назва Сорту</span>
              </label>
              <span className="text-[10px] text-[#d8f087] font-black bg-[#d8f087]/20 px-2.5 py-0.5 rounded-full border border-[#d8f087]/30">
                Генетика
              </span>
            </div>

            {/* Виробник сорту (насіння) */}
            <div className="space-y-1.5">
              <label className="block text-neutral-300 font-bold text-[11px]">
                Виробник сорту (насіння):
              </label>
              <select
                value={selectedBreeder}
                onChange={(e) => handleBreederSelect(e.target.value)}
                className="w-full bg-[#121316] border border-neutral-800 rounded-xl p-2.5 text-white text-xs font-bold focus:outline-none focus:border-[#d8f087] cursor-pointer"
              >
                {uniqueBreeders.map((b) => (
                  <option key={b} value={b} className="bg-[#18191c] text-white">
                    {b}
                  </option>
                ))}
              </select>

              {selectedBreeder.includes('Інший') && (
                <div className="mt-2 animate-fadeIn">
                  <input
                    type="text"
                    required
                    placeholder="Введіть назву брідера (виробника)..."
                    value={customBreederName}
                    onChange={(e) => setCustomBreederName(e.target.value)}
                    className="w-full bg-[#121316] border border-neutral-800 rounded-xl p-2.5 text-white text-xs font-bold focus:outline-none focus:border-[#d8f087]"
                  />
                </div>
              )}
            </div>

            {/* Назва сорту з автопошуком */}
            <div ref={searchContainerRef} className="relative">
              <div className="flex items-center justify-between mb-1">
                <label className="text-neutral-300 font-bold text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#fce182] fill-[#fce182]" />
                  <span>Назва сорту:</span>
                </label>
                <span className="text-[9.5px] text-[#d8f087] font-bold bg-[#d8f087]/20 px-2 py-0.2 rounded-full border border-[#d8f087]/30">
                  Автопідбір
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  required
                  value={strainQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onChange={(e) => {
                    setStrainQuery(e.target.value);
                    setIsSearchOpen(true);
                    const exact = MEDICAL_STRAINS.find(
                      (s) => s.name.toLowerCase() === e.target.value.trim().toLowerCase()
                    );
                    setSelectedStrain(exact || null);
                  }}
                  placeholder="Введіть назву сорту (напр. Northern Lights, Green Crack)..."
                  className="w-full bg-[#121316] border border-neutral-800 rounded-xl p-2.5 pr-9 text-white text-xs font-black focus:outline-none focus:border-[#d8f087]"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
              </div>

              {/* Live Autocomplete Suggestions List */}
              {isSearchOpen && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#18191c] border border-neutral-800 rounded-2xl shadow-xl z-30 max-h-56 overflow-y-auto divide-y divide-neutral-800 text-white">
                  <div className="p-2 bg-[#121316] text-[10px] font-black text-[#d8f087] uppercase tracking-wider flex items-center justify-between sticky top-0 z-10 border-b border-neutral-800">
                    <span>
                      {filteredStrains.length > 0
                        ? `Знайдено варіантів (${filteredStrains.length}):`
                        : 'Новий власний сорт'}
                    </span>
                    {selectedBreeder && (
                      <span className="text-neutral-300">Виробник: {selectedBreeder}</span>
                    )}
                  </div>

                  {filteredStrains.length > 0 ? (
                    filteredStrains.map((st) => {
                      const isSelected = selectedStrain?.name === st.name;
                      return (
                        <button
                          key={st.name}
                          type="button"
                          onClick={() => handleSelectStrain(st)}
                          className={`w-full text-left p-2.5 transition-colors flex items-center justify-between cursor-pointer ${
                            isSelected ? 'bg-neutral-800 font-bold text-white' : 'hover:bg-neutral-800/60 text-neutral-200'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-white text-xs">{st.name}</span>
                              <span className="text-[9px] font-black bg-[#fce182]/20 text-[#fce182] border border-[#fce182]/30 px-1.5 py-0.2 rounded-md">
                                {st.type}
                              </span>
                              {st.isAuto && (
                                <span className="text-[9px] font-bold bg-blue-900/60 text-blue-300 border border-blue-800 px-1.5 py-0.2 rounded-md">
                                  Auto
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-neutral-400 flex items-center gap-2">
                              <span>Виробник: {st.breeder || 'Н/Д'}</span>
                              <span>•</span>
                              <span className="text-[#d8f087] font-bold">THC: {st.thc}</span>
                              {st.cbd && !st.cbd.includes('< 0.1') && !st.cbd.includes('0.1%') && !st.cbd.includes('0.2%') && (
                                <>
                                  <span>•</span>
                                  <span className="text-indigo-400 font-bold">CBD: {st.cbd}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {isSelected && <Check className="w-4 h-4 text-[#d8f087] shrink-0" />}
                        </button>
                      );
                    })
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectStrain(getStrainInfo(strainQuery || 'Власний сорт', effectiveBreeder))}
                      className="w-full p-3 text-center space-y-1 hover:bg-neutral-800 cursor-pointer rounded-xl transition-colors text-left"
                    >
                      <p className="font-bold text-xs text-[#d8f087] flex items-center justify-between">
                        <span>+ Додати сорт &quot;{strainQuery || 'Власний'}&quot;</span>
                        <span className="text-[10px] bg-[#d8f087] text-[#18181b] px-2 py-0.5 rounded-md font-black">Обрати</span>
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        Сорт буде автоматично згенеровано з оптимальними параметрами для виробника {effectiveBreeder}.
                      </p>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Selected Strain Info Card Preview */}
            {selectedStrain && (
              <div className="p-2.5 bg-[#121316] border border-neutral-800 rounded-xl flex items-center justify-between text-[11px] text-white">
                <div>
                  <span className="text-[#d8f087] font-black">{selectedStrain.name}</span>
                  <div className="text-neutral-300 text-[10px] font-medium mt-0.5">
                    {selectedStrain.type} ({selectedStrain.isAuto ? 'Автоквіт' : 'Фотоперіод'}) • THC: {selectedStrain.thc}
                    {selectedStrain.cbd && !selectedStrain.cbd.includes('< 0.1') && !selectedStrain.cbd.includes('0.1%') && !selectedStrain.cbd.includes('0.2%') ? ` | CBD: ${selectedStrain.cbd}` : ''}
                  </div>
                </div>
                <span className="text-[9.5px] font-bold bg-[#d8f087]/20 text-[#d8f087] border border-[#d8f087]/30 px-2 py-0.5 rounded-lg shrink-0 ml-2">
                  {selectedStrain.breeder}
                </span>
              </div>
            )}
          </div>

          {/* 2. Початкова фаза (Emerald Window) */}
          <InitialStageRoller
            selectedDays={plantAgeDays}
            onChangeDays={setPlantAgeDays}
            strain={selectedStrain}
            breederName={effectiveBreeder}
          />

          {/* 3. Світловий режим (Amber Window) */}
          <LightSchedulePicker
            value={lightSchedule}
            onChange={(val) => setLightSchedule(val as any)}
            strain={selectedStrain}
            stageName={currentStageInfo.stageNameUk}
          />

          {/* Початковий об'єм та тип горщика */}
          <div className="bg-[#18191c] border border-neutral-800 rounded-2xl p-3.5 space-y-3">
            <div className="border-b border-neutral-800 pb-2">
              <label className="text-white font-black text-xs uppercase tracking-wide flex items-center gap-1.5">
                <span>🪴 Початковий об&apos;єм та тип горщика</span>
              </label>
            </div>

            {/* Типаж горщика */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-neutral-300 uppercase tracking-wider block">
                Типаж горщика:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPotType('fabric')}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                    potType === 'fabric'
                      ? 'bg-[#d8f087] text-[#18181b] border-[#d8f087]'
                      : 'bg-[#121316] text-neutral-300 hover:bg-neutral-800 border-neutral-800'
                  }`}
                >
                  <span>🪴 Тканина (SmartPot)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPotType('plastic')}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                    potType === 'plastic'
                      ? 'bg-[#d8f087] text-[#18181b] border-[#d8f087]'
                      : 'bg-[#121316] text-neutral-300 hover:bg-neutral-800 border-neutral-800'
                  }`}
                >
                  <span>🪣 Пластиковий</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPotType('airpot')}
                  className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                    potType === 'airpot'
                      ? 'bg-[#d8f087] text-[#18181b] border-[#d8f087]'
                      : 'bg-[#121316] text-neutral-300 hover:bg-neutral-800 border-neutral-800'
                  }`}
                >
                  <span>💨 Air-Pot</span>
                </button>
              </div>
            </div>

            {/* Об'єм повзунок */}
            <div className="space-y-2 pt-1 border-t border-neutral-800">
              <label className="text-[11px] font-extrabold text-neutral-300 uppercase tracking-wider block">
                Об&apos;єм горщика (від 100г до 100л):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0.1}
                  max={100}
                  step={potSize < 1 ? 0.1 : potSize < 5 ? 0.5 : 1}
                  value={potSize}
                  onChange={(e) => {
                    const rawVal = parseFloat(e.target.value);
                    if (rawVal < 1) {
                      setPotSize(Math.round(rawVal * 10) / 10);
                    } else if (rawVal < 5) {
                      setPotSize(Math.round(rawVal * 2) / 2);
                    } else {
                      setPotSize(Math.round(rawVal));
                    }
                  }}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#d8f087]"
                />
                <div className="shrink-0 bg-[#121316] border border-neutral-800 rounded-xl px-2.5 py-1 text-center min-w-[85px]">
                  <span className="text-xs font-black text-[#d8f087]">
                    {potSize < 1 ? `${Math.round(potSize * 1000)} г` : `${Number(potSize.toFixed(1))} л`}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* 4. Субстрат та Рецепт */}
          <div className="space-y-3 bg-[#18191c] border border-neutral-800 rounded-2xl p-3.5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <label className="text-white font-black text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#d8f087] shrink-0" />
                <span>4. Субстрат та Рецепт</span>
              </label>
            </div>

            {/* Блок 1: Готовий субстрат виробника */}
            <div className={`p-3 rounded-2xl transition-all duration-200 space-y-2.5 ${
              substrateChoiceType === 'commercial'
                ? 'bg-[#121316] border-2 border-[#d8f087]'
                : 'bg-[#121316]/60 border border-neutral-800 opacity-90 hover:opacity-100'
            }`}>
              <div className="pb-1.5 border-b border-neutral-800">
                <h4 className="text-xs font-black uppercase text-white tracking-wide flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                  Брендовий субстрат
                </h4>
                <p className="text-[10px] text-neutral-400 font-medium">
                  Вибір готової фабричної суміші від виробника
                </p>
              </div>

              {/* 1. Виробник субстрату */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Виробник субстрату:
                </label>
                <select
                  value={selectedSubstrateManufacturer}
                  onChange={(e) => handleSubstrateManufacturerChange(e.target.value)}
                  className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-2.5 text-white text-xs font-bold focus:outline-none focus:border-[#d8f087] cursor-pointer"
                >
                  {SUBSTRATE_MANUFACTURERS.map(m => (
                    <option key={m.id} value={m.id} className="bg-[#18191c] text-white">
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Субстрат */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Субстрат:
                </label>
                <select
                  value={selectedCommercialSubstrateId}
                  onChange={(e) => handleSubstrateRecipeChange(e.target.value)}
                  className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-2.5 text-white text-xs font-bold focus:outline-none focus:border-[#d8f087] cursor-pointer"
                >
                  {availableSubstrates.map(s => (
                    <option key={s.id} value={s.id} className="bg-[#18191c] text-white">
                      {s.name} ({s.mediumType === 'Soil' ? '🌱 Ґрунт' : '🥥 Кокос'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Повноширинна кнопка вибору унизу */}
              <button
                type="button"
                onClick={() => setSubstrateChoiceType('commercial')}
                className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all mt-1 ${
                  substrateChoiceType === 'commercial'
                    ? 'bg-[#d8f087] text-[#18181b]'
                    : 'bg-[#18191c] hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                }`}
              >
                {substrateChoiceType === 'commercial' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#18181b]" /> Вибрано
                  </>
                ) : (
                  'Вибрати'
                )}
              </button>
            </div>

            {/* Блок 2: Авторський рецепт гровера */}
            <div className={`p-3 rounded-2xl transition-all duration-200 space-y-3 ${
              substrateChoiceType === 'recipe'
                ? 'bg-[#121316] border-2 border-[#d8f087]'
                : 'bg-[#121316]/60 border border-neutral-800 opacity-90 hover:opacity-100'
            }`}>
              <div className="pb-1.5 border-b border-neutral-800">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#fce182] fill-[#fce182] shrink-0" />
                  <h4 className="text-xs font-black uppercase text-white tracking-wide">
                    Рецепти субстрату
                  </h4>
                </div>
                <p className="text-[10px] text-neutral-400 font-medium mt-0.5">
                  Перевірені авторські суміші світових гроверів під <span className="text-[#d8f087] font-bold">{selectedStrain?.name || 'обраний сорт'}</span>
                </p>
              </div>

              {/* Dropdown for World Grower Recipes */}
              <div>
                <label className="block text-[10px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Виберіть авторський рецепт:
                </label>
                <select
                  value={activeSubstrateRecipe.id}
                  onChange={(e) => handleWorldRecipeChange(e.target.value)}
                  className="w-full bg-[#18191c] border border-neutral-800 rounded-xl p-2.5 text-white text-xs font-black focus:outline-none focus:border-[#d8f087] cursor-pointer"
                >
                  {recommendedWorldRecipes.map(r => (
                    <option key={r.id} value={r.id} className="bg-[#18191c] text-white">
                      {r.name} — {r.author}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recipe Details Card */}
              <div className="bg-[#18191c] border border-neutral-800 rounded-2xl p-3.5 space-y-2.5 text-white">
                <div className="border-b border-neutral-800 pb-2 space-y-1.5">
                  <h5 className="text-xs font-black text-white leading-snug w-full">
                    {activeSubstrateRecipe.name}
                  </h5>

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="text-[10px] text-neutral-300 font-bold truncate">
                      👨‍🌾 {(activeSubstrateRecipe as WorldGrowerRecipe).author || activeSubstrateRecipe.manufacturer}
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-black bg-purple-900/60 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-md whitespace-nowrap">
                        pH {activeSubstrateRecipe.targetPhMin}–{activeSubstrateRecipe.targetPhMax}
                      </span>
                      <span className="text-[10px] font-black bg-[#fce182]/20 text-[#fce182] border border-[#fce182]/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                        PPM {activeSubstrateRecipe.targetPpmMin}–{activeSubstrateRecipe.targetPpmMax}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#121316] border border-neutral-800 rounded-xl p-2.5 text-white text-[11px] font-bold flex items-center gap-2">
                  <span className="shrink-0 text-base">🧪</span>
                  <div className="flex-1 leading-snug">
                    <span>{activeSubstrateRecipe.phTargetInfo || `Оптимальний pH субстрату: pH ${activeSubstrateRecipe.targetPhMin}–${activeSubstrateRecipe.targetPhMax}`}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-0.5">
                  <p className="text-[10px] font-black text-neutral-300 uppercase tracking-wider">
                    Детальний склад та поради до покупки:
                  </p>
                  {activeSubstrateRecipe.ingredients.map(ing => (
                    <div key={ing.id} className="bg-[#121316] border border-neutral-800 rounded-xl p-2 space-y-0.5">
                      <div className="flex items-center justify-between text-[11px] font-black text-white">
                        <span>{ing.name}</span>
                        <span className="bg-[#d8f087]/20 text-[#d8f087] border border-[#d8f087]/30 px-2 py-0.5 rounded-md text-[10px]">
                          {ing.percentage}%
                        </span>
                      </div>
                      {ing.buyGuide ? (
                        <p className="text-[10px] text-neutral-300 font-medium leading-relaxed bg-[#18191c] p-1.5 rounded-lg border border-neutral-800">
                          {ing.buyGuide}
                        </p>
                      ) : (
                        <p className="text-[10px] text-neutral-400 italic">
                          🛒 Базовий компонент субстратної суміші.
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {activeSubstrateRecipe.notes && (
                  <p className="text-[10px] text-neutral-400 italic border-t border-neutral-800 pt-2 mt-1 leading-relaxed">
                    💡 {activeSubstrateRecipe.notes}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSubstrateChoiceType('recipe')}
                className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all mt-1 ${
                  substrateChoiceType === 'recipe'
                    ? 'bg-[#d8f087] text-[#18181b]'
                    : 'bg-[#18191c] hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
                }`}
              >
                {substrateChoiceType === 'recipe' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#18181b]" /> Вибрано
                  </>
                ) : (
                  'Вибрати'
                )}
              </button>
            </div>
          </div>

          {/* 5. Добрива та Стимулятори (Єдине об'єднане вікно вибору добрив) */}
          <div className="bg-[#18191c] border border-neutral-800 rounded-2xl p-3.5 sm:p-4 space-y-3.5 text-white">
            {/* Заголовок блоку 5 */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
              <label className="text-[#d8f087] font-black text-xs uppercase tracking-wide flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-[#d8f087] shrink-0" />
                <span>5. Добрива та Стимулятори</span>
              </label>
            </div>

            {/* Частина A: ГОЛОВНА КНОПКА (ВИБІР) ТА РОЗГОРТАЄМЕ ВІКНО ПОШУКУ ВИРОБНИКІВ І ТОВАРІВ */}
            <div className="space-y-3">
              {/* ГОЛОВНА КНОПКА "ВИБІР" НА ВСЮ ДОВЖИНУ ВІКНА */}
              <button
                type="button"
                onClick={() => setIsManufacturerSelectorOpen(prev => !prev)}
                className="w-full bg-[#d8f087] hover:bg-[#cbe37a] text-[#18181b] font-black text-xs sm:text-sm py-3 px-4 rounded-2xl border border-[#d8f087] transition-all cursor-pointer flex items-center justify-between gap-2 uppercase tracking-wide group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base shrink-0">{activeNutrientManufacturer.logoSymbol}</span>
                  <span className="font-black truncate">
                    ВИБІР ({activeNutrientManufacturer.name})
                  </span>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#18181b] text-[#d8f087] shrink-0 border border-[#18181b] transition-colors">
                  {isManufacturerSelectorOpen ? (
                    <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                  )}
                </div>
              </button>

              {/* РОЗГОРОТНЕ ВІКНО СИСТЕМИ (ПОШУК ВИРОБНИКІВ + ІНТЕРНЕТ ПОШУК ТОВАРІВ) */}
              {isManufacturerSelectorOpen && (
                <div className="bg-[#121316] border border-neutral-800 rounded-2xl p-3 sm:p-4 space-y-3.5 text-white">
                  
                  {/* ТОП ТАБИ: "КАТАЛОГ ВИРОБНИКА" VS "ВИБРАНІ ТОВАРИ" */}
                  <div className="flex items-center gap-2 bg-[#18191c] p-1.5 rounded-2xl border border-neutral-800 mb-1">
                    <button
                      type="button"
                      onClick={() => setNutrientSelectorTab('catalog')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        nutrientSelectorTab === 'catalog'
                          ? 'bg-[#d8f087] text-[#18181b]'
                          : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>📦 Каталог виробника</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNutrientSelectorTab('selected')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        nutrientSelectorTab === 'selected'
                          ? 'bg-[#d8f087] text-[#18181b]'
                          : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>🛒 Вибрані продукти</span>
                      {selectedProductIds.length > 0 && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          nutrientSelectorTab === 'selected'
                            ? 'bg-[#18181b] text-[#d8f087]'
                            : 'bg-[#d8f087] text-[#18181b]'
                        }`}>
                          {selectedProductIds.length}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* ВКЛАДКА 1: КАТАЛОГ ВИРОБНИКА */}
                  {nutrientSelectorTab === 'catalog' ? (
                    <>
                      {/* 1. ПОШУКОВЕ ВІКНО ЗІ ВСІМА ВИРОБНИКАМИ ДОБРИВ */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-[#d8f087] flex items-center justify-between">
                          <span className="flex items-center gap-1.5 uppercase tracking-wide">
                            <Search className="w-3.5 h-3.5 text-[#d8f087]" />
                            <span>Пошук виробника добрив:</span>
                          </span>
                          <span className="text-[9.5px] text-neutral-400 font-normal">
                            (Введіть назву, напр. Advanced, BioBizz, Plagron...)
                          </span>
                        </label>

                        <div className="relative">
                          <input
                            type="text"
                            value={manufacturerSearchQuery}
                            onChange={(e) => setManufacturerSearchQuery(e.target.value)}
                            placeholder="Введіть назву виробника добрив..."
                            className="w-full bg-[#18191c] text-white placeholder-neutral-500 text-xs px-3.5 py-2.5 pl-9 pr-8 rounded-xl border border-neutral-800 focus:border-[#d8f087] focus:outline-none transition-all font-semibold"
                          />
                          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
                          {manufacturerSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setManufacturerSearchQuery('')}
                              className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white p-0.5 rounded-full"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Списки знайдених виробників */}
                      <div className="space-y-1 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                        {filteredManufacturers.length > 0 ? (
                          filteredManufacturers.slice(0, 15).map((m) => {
                            const isSelected = m.id === selectedNutrientManufacturer;
                            return (
                              <div
                                key={m.id}
                                onClick={() => handleSelectManufacturer(m.id)}
                                className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-[#d8f087] text-[#18181b] font-black border-[#d8f087]'
                                    : 'bg-[#18191c] hover:bg-neutral-800 text-white border-neutral-800'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-base shrink-0">{m.logoSymbol}</span>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-xs font-black truncate">{m.name}</span>
                                      <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold ${
                                        isSelected ? 'bg-[#18181b] text-[#d8f087]' : 'bg-[#121316] text-neutral-300'
                                      }`}>
                                        {m.specialty}
                                      </span>
                                    </div>
                                    <p className={`text-[9.5px] line-clamp-1 leading-tight ${
                                      isSelected ? 'text-[#18181b] font-semibold' : 'text-neutral-400'
                                    }`}>
                                      {m.country} • ⭐ {m.rating}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectManufacturer(m.id);
                                  }}
                                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer transition-all ${
                                    isSelected
                                      ? 'bg-[#18181b] text-[#d8f087] border border-[#18181b]'
                                      : 'bg-[#121316] hover:bg-neutral-800 text-[#d8f087] border border-neutral-800'
                                  }`}
                                >
                                  {isSelected ? '✓ Вибрано' : 'Обрати'}
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-3 bg-[#18191c] border border-neutral-800 rounded-xl text-center">
                            <p className="text-xs text-neutral-300 font-medium">
                              Виробника &quot;{manufacturerSearchQuery}&quot; не знайдено в базі.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* 2. ВІКНО З ПРОДУКТАМИ ВИРОБНИКА ПОДІЛЕНИМИ НА СТАДІЇ РІСТУ */}
                      <div className="border-t border-neutral-800 pt-3 space-y-2.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-[#d8f087] flex items-center gap-1.5 flex-wrap">
                            <span>📦 Продукти {activeNutrientManufacturer.name}:</span>
                            <span className="text-[9.5px] bg-[#18191c] text-[#d8f087] px-2 py-0.5 rounded-full border border-neutral-800">
                              {activeManufacturerProducts.length} товарів
                            </span>
                          </h4>
                        </div>

                        {/* ФІЛЬТР СТАДІЙ РІСТУ */}
                        <div className="flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar">
                          {STAGE_CONFIGS.map(stg => {
                            const count = activeProductsByStage[stg.key].length;
                            const isActive = catalogStageFilter === stg.key;
                            return (
                              <button
                                type="button"
                                key={stg.key}
                                onClick={() => setCatalogStageFilter(prev => prev === stg.key ? 'all' : stg.key)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                                  isActive
                                    ? 'bg-[#d8f087] text-[#18181b]'
                                    : 'bg-[#18191c] text-neutral-300 hover:text-white border border-neutral-800'
                                }`}
                              >
                                <span>{stg.emoji}</span>
                                <span>{stg.shortTitle}</span>
                                <span className={`text-[9px] px-1 py-0.1 rounded-full ${
                                  isActive ? 'bg-[#18181b] text-[#d8f087]' : 'bg-[#121316] text-neutral-400'
                                }`}>
                                  {count}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* СПИСОК ПРОДУКТІВ ПОДІЛЕНИЙ ПО СТАДІЯХ */}
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                          {STAGE_CONFIGS.map(stg => {
                            const productsInStage = activeProductsByStage[stg.key];
                            if (catalogStageFilter !== 'all' && catalogStageFilter !== stg.key) {
                              return null;
                            }
                            if (productsInStage.length === 0 && catalogStageFilter !== 'all') {
                              return (
                                <div key={stg.key} className="p-3 bg-[#18191c] border border-neutral-800 rounded-xl text-center text-xs text-neutral-400">
                                  У даного бренду немає продуктів для категорії {stg.title}.
                                </div>
                              );
                            }
                            if (productsInStage.length === 0) return null;

                            return (
                              <div key={stg.key} className="space-y-1.5">
                                {/* Заголовок стадії */}
                                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[#18191c] border border-neutral-800">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-sm">{stg.emoji}</span>
                                    <span className="text-xs font-black text-[#d8f087] uppercase tracking-wide">
                                      {stg.title}
                                    </span>
                                  </div>
                                  <span className="text-[9.5px] font-bold text-neutral-300 bg-[#121316] px-2 py-0.5 rounded-full border border-neutral-800">
                                    {productsInStage.length} товар(ів)
                                  </span>
                                </div>

                                {/* Продукти стадії */}
                                {productsInStage.map(prod => {
                                  const isSelected = selectedProductIds.includes(prod.id);
                                  return (
                                    <div
                                      key={prod.id}
                                      className={`p-2.5 rounded-xl border transition-all space-y-1.5 ${
                                        isSelected
                                          ? 'bg-[#18191c] border-[#d8f087]'
                                          : 'bg-[#18191c]/80 border-neutral-800 hover:border-neutral-700'
                                      }`}
                                    >
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-start gap-2 min-w-0">
                                          <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleProductSelection(prod.id)}
                                            className="mt-1 w-4 h-4 rounded text-[#d8f087] focus:ring-[#d8f087] border-neutral-700 bg-[#121316] cursor-pointer shrink-0"
                                          />
                                          <div className="min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                              <span className="font-extrabold text-xs text-[#d8f087] leading-tight">
                                                {prod.name}
                                              </span>
                                              <span className="text-[8.5px] bg-[#121316] text-neutral-300 px-1.5 py-0.2 rounded font-bold border border-neutral-800">
                                                {prod.category}
                                              </span>
                                              {prod.npkRatio && (
                                                <span className="text-[8.5px] text-[#d8f087] font-mono font-bold bg-[#121316] px-1.5 py-0.2 rounded">
                                                  NPK {prod.npkRatio}
                                                </span>
                                              )}
                                            </div>

                                            <p className="text-[10.5px] text-neutral-300 mt-1 leading-snug">
                                              📖 <span className="font-bold text-[#fce182]">Опис:</span> {prod.description}
                                            </p>

                                            {prod.composition && (
                                              <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug">
                                                🧪 <span className="font-bold text-cyan-400">Складова:</span> {prod.composition}
                                              </p>
                                            )}

                                            {prod.bestPractices && (
                                              <div className="mt-1.5 p-2 bg-[#121316] border border-neutral-800 rounded-lg">
                                                <p className="text-[10px] text-emerald-400 leading-relaxed font-medium">
                                                  🌿 <span className="font-bold text-emerald-300">Кращі практики для канабісу:</span> {prod.bestPractices}
                                                </p>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => toggleProductSelection(prod.id)}
                                          className={`shrink-0 text-[10px] font-black px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                            isSelected
                                              ? 'bg-[#d8f087] text-[#18181b] border-[#d8f087]'
                                              : 'bg-[#121316] text-neutral-300 border-neutral-800 hover:text-white'
                                          }`}
                                        >
                                          {isSelected ? '✓ У комплекті' : '+ Додати'}
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    /* ВКЛАДКА 2: ВИБРАНІ ТОВАРИ З ПІДКАЗКАМИ ДЛЯ ПОВНОГО ЦИКЛУ */
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                        <h4 className="text-xs sm:text-sm font-black text-[#d8f087] flex items-center gap-1.5">
                          <ShoppingBag className="w-4 h-4 text-[#d8f087]" />
                          <span>🛒 Сформований мультибрендовий комплект ({selectedProductIds.length} товарів)</span>
                        </h4>
                        {selectedProductIds.length > 0 && (
                          <button
                            type="button"
                            onClick={clearAllProducts}
                            className="text-[9.5px] font-bold text-rose-300 hover:text-rose-200 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 px-2 py-0.5 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Очистити все
                          </button>
                        )}
                      </div>

                      {/* ПАНЕЛЬ ПІДКАЗОК ДЛЯ ПОВНОГО ЦИКЛУ */}
                      <div className="bg-purple-900/80 border-2 border-amber-400/60 rounded-2xl p-3 space-y-2.5 shadow-md">
                        <div className="flex items-center justify-between flex-wrap gap-1.5">
                          <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>Підказки та аналіз для циклу росту:</span>
                          </span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                            selectedProductsCycleAdvice.mainCovered
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                              : 'bg-amber-950 text-amber-300 border-amber-500/50'
                          }`}>
                            {selectedProductsCycleAdvice.mainCovered
                              ? '🎉 Повний цикл закритий!'
                              : '💡 Є рекомендації щодо доповнення'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedProductsCycleAdvice.checks.map(check => (
                            <div
                              key={check.key}
                              className={`p-2 rounded-xl border text-[10.5px] leading-snug flex items-start gap-2 transition-all ${
                                check.isCovered
                                  ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                                  : 'bg-amber-950/50 border-amber-500/50 text-amber-200'
                              }`}
                            >
                              <span className="text-base shrink-0 mt-0.5">{check.emoji}</span>
                              <div className="min-w-0 flex-1">
                                <div className="font-extrabold flex items-center justify-between gap-1">
                                  <span>{check.title}</span>
                                  <span className={`text-[9.5px] font-black px-1.5 py-0.2 rounded ${
                                    check.isCovered ? 'bg-emerald-900 text-emerald-200' : 'bg-amber-900 text-amber-200'
                                  }`}>
                                    {check.isCovered ? `✓ ${check.okMsg}` : 'не обрано'}
                                  </span>
                                </div>
                                <p className="text-[9.5px] opacity-90 mt-1 leading-tight">
                                  {check.isCovered ? `Обрано продуктів: ${check.count} шт.` : check.warnMsg}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* СПИСОК ВИБРАНИХ ПРОДУКТІВ ПОДІЛЕНИХ ПО СТАДІЯХ РІСТУ */}
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                        {selectedProductIds.length === 0 ? (
                          <div className="p-6 bg-[#18191c] border border-neutral-800 rounded-2xl text-center space-y-2">
                            <ShoppingBag className="w-8 h-8 text-[#d8f087] mx-auto opacity-80" />
                            <p className="text-xs text-neutral-300 font-medium">
                              Ви поки не вибрали жодного продукту.
                            </p>
                            <p className="text-[10px] text-neutral-400 max-w-md mx-auto">
                              Оберіть товари в каталозі виробника або скористайтеся автоматичним підбором комплектів.
                            </p>
                          </div>
                        ) : (
                          STAGE_CONFIGS.map(stageCard => {
                            const productsInStage = selectedProductsByStage[stageCard.key];
                            if (!productsInStage || productsInStage.length === 0) return null;

                            return (
                              <div key={stageCard.key} className="space-y-1.5">
                                <div className="text-[10px] font-black text-[#d8f087] uppercase tracking-wider flex items-center justify-between border-b border-neutral-800 pb-1">
                                  <span className="flex items-center gap-1">
                                    <span>{stageCard.emoji}</span>
                                    <span>{stageCard.title}</span>
                                  </span>
                                  <span className="text-[9px] text-neutral-400 font-bold">
                                    {productsInStage.length} шт.
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {productsInStage.map(prod => {
                                    const mfr = manufacturersMap.get(prod.manufacturerId);

                                    return (
                                      <div
                                        key={prod.id}
                                        className="bg-[#18191c] border border-neutral-800 hover:border-neutral-700 rounded-xl p-2.5 flex items-center justify-between gap-2 transition-all"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          {prod.imageUrl && (
                                            <img
                                              src={prod.imageUrl}
                                              alt={prod.name}
                                              className="w-8 h-8 object-cover rounded-lg border border-neutral-700 shrink-0"
                                            />
                                          )}
                                          <div className="min-w-0">
                                            {mfr && (
                                              <span className="text-[8.5px] font-bold text-neutral-400 uppercase leading-none block truncate">
                                                {mfr.name}
                                              </span>
                                            )}
                                            <span className="font-bold text-white text-[11px] leading-tight block truncate">
                                              {prod.name}
                                            </span>
                                            <div className="flex items-center gap-1 mt-0.5">
                                              <span className="text-[8.5px] bg-[#141518] text-neutral-300 border border-neutral-800 px-1.5 py-0.5 rounded font-extrabold">
                                                {prod.category}
                                              </span>
                                              {prod.npkRatio && (
                                                <span className="text-[8.5px] text-[#d8f087] font-mono font-bold">
                                                  NPK {prod.npkRatio}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => toggleProductSelection(prod.id)}
                                          className="shrink-0 text-[10px] font-black px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg transition-all cursor-pointer"
                                        >
                                          Видалити
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Розділювач всередині єдиного вікна */}
              <div className="border-t border-neutral-800 my-1" />

              {/* Частина B: ГОТОВА КОРЗИНА ТА РОЗРАХУНОК ВИТРАТ НА ВЕСЬ ЦИКЛ */}
              <div className="space-y-3">
                {/* Інтерактивна Головна Кнопка підбору готової корзини "підбір" */}
                <button
                  type="button"
                  onClick={() => setIsAiKitSelectorOpen(prev => !prev)}
                  className="w-full bg-[#d8f087] hover:bg-[#cbe37a] text-[#18181b] font-black text-xs sm:text-sm py-3 px-4 rounded-2xl border border-[#d8f087] transition-all cursor-pointer flex items-center justify-between gap-2 uppercase tracking-wide group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Sparkles className="w-4.5 h-4.5 text-[#18181b] shrink-0" />
                    <span className="font-black truncate">
                      підбір ({activeNutrientManufacturer.name})
                    </span>
                  </div>
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#18181b] text-[#d8f087] shrink-0 border border-[#18181b] transition-colors">
                    {isAiKitSelectorOpen ? (
                      <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </div>
                </button>

                {/* РОЗГОРОТНЕ ВІКНО ГОТОВОЇ КОРЗИНИ AI */}
                {isAiKitSelectorOpen && (
                  <div className="bg-[#121316] border border-neutral-800 rounded-2xl p-3 sm:p-4 space-y-3.5 text-white">
                    {/* Вибір виробника добрив для підбору */}
                    <div className="space-y-2 bg-[#18191c] p-3 rounded-2xl border border-neutral-800">
                      <div className="flex items-center justify-between text-[11px] font-black text-[#d8f087]">
                        <span className="flex items-center gap-1.5 uppercase tracking-wide">
                          <Building2 className="w-4 h-4 text-[#d8f087]" />
                          <span>Вибір виробника добрив:</span>
                        </span>
                        <span className="text-[10px] text-[#fce182] font-bold bg-[#121316] border border-neutral-800 px-2 py-0.5 rounded-full">
                          ⭐ {activeNutrientManufacturer.rating} / 10
                        </span>
                      </div>

                      <div className="relative">
                        <input
                          type="text"
                          value={manufacturerSearchQuery}
                          onChange={(e) => setManufacturerSearchQuery(e.target.value)}
                          placeholder="Введіть назву виробника (напр. Advanced, BioBizz, Plagron)..."
                          className="w-full bg-[#121316] text-white placeholder-neutral-500 text-xs px-3.5 py-2.5 pl-9 pr-8 rounded-xl border border-neutral-800 focus:border-[#d8f087] focus:outline-none transition-all font-semibold"
                        />
                        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
                        {manufacturerSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setManufacturerSearchQuery('')}
                            className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-white p-0.5 rounded-full"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-1 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
                        {filteredManufacturers.length > 0 ? (
                          filteredManufacturers.slice(0, 15).map((m) => {
                            const isSelected = m.id === selectedNutrientManufacturer;
                            return (
                              <div
                                key={m.id}
                                onClick={() => {
                                  handleSelectManufacturer(m.id);
                                  const isAuto = selectedStrain?.isAuto ?? true;
                                  const smartKit = getTieredRecommendedKit(m.id, selectedKitTier, medium, isAuto);
                                  const kitIds = smartKit.map(p => p.id);
                                  setSelectedProductIds(prev => {
                                    const mfrProductIds = new Set(NUTRIENT_PRODUCTS_DATABASE.filter(p => p.manufacturerId === m.id).map(p => p.id));
                                    const preservedIds = prev.filter(id => !mfrProductIds.has(id));
                                    return Array.from(new Set([...preservedIds, ...kitIds]));
                                  });
                                }}
                                className={`p-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                                  isSelected
                                    ? 'bg-[#d8f087] text-[#18181b] font-black border-[#d8f087]'
                                    : 'bg-[#121316] hover:bg-neutral-800 text-white border-neutral-800'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-base shrink-0">{m.logoSymbol}</span>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-xs font-black truncate">{m.name}</span>
                                      <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold ${
                                        isSelected ? 'bg-[#18181b] text-[#d8f087]' : 'bg-[#18191c] text-neutral-300'
                                      }`}>
                                        {m.specialty}
                                      </span>
                                    </div>
                                    <p className={`text-[9.5px] line-clamp-1 leading-tight ${
                                      isSelected ? 'text-[#18181b] font-semibold' : 'text-neutral-400'
                                    }`}>
                                      {m.country} • ⭐ {m.rating}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectManufacturer(m.id);
                                    const isAuto = selectedStrain?.isAuto ?? true;
                                    const smartKit = getTieredRecommendedKit(m.id, selectedKitTier, medium, isAuto);
                                    const kitIds = smartKit.map(p => p.id);
                                    setSelectedProductIds(prev => {
                                      const mfrProductIds = new Set(NUTRIENT_PRODUCTS_DATABASE.filter(p => p.manufacturerId === m.id).map(p => p.id));
                                      const preservedIds = prev.filter(id => !mfrProductIds.has(id));
                                      return Array.from(new Set([...preservedIds, ...kitIds]));
                                    });
                                  }}
                                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer transition-all ${
                                    isSelected
                                      ? 'bg-[#18181b] text-[#d8f087] border border-[#18181b]'
                                      : 'bg-[#18191c] hover:bg-neutral-800 text-[#d8f087] border border-neutral-800'
                                  }`}
                                >
                                  {isSelected ? '✓ Вибрано' : 'Обрати'}
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-3 bg-[#121316] border border-neutral-800 rounded-xl text-center">
                            <p className="text-xs text-neutral-300 font-medium">
                              Виробника &quot;{manufacturerSearchQuery}&quot; не знайдено в базі.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Селектор рівня комплектації готової корзини (3 Рівні) */}
                    <div className="space-y-1.5 pt-0.5">
                      <div className="flex items-center justify-between text-[11px] font-bold text-neutral-300">
                        <span>📦 Рівень комплектації готової корзини:</span>
                        <span className="text-[10px] text-[#fce182] font-extrabold bg-[#18191c] border border-neutral-800 px-2 py-0.5 rounded-full">
                          {selectedKitTier === 'starter'
                            ? '🌱 Базовий старт'
                            : selectedKitTier === 'amateur'
                            ? '⭐ Оптимальний баланс'
                            : '👑 PRO / Максимальний спектр'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {/* 1. Початковий рівень */}
                        <button
                          type="button"
                          onClick={() => handleSelectKitTier('starter')}
                          className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                            selectedKitTier === 'starter'
                              ? 'bg-[#d8f087] text-[#18181b] font-black border-[#d8f087] shadow-sm'
                              : 'bg-[#18191c] hover:bg-[#22242a] text-neutral-200 border-neutral-800 font-bold'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black">🌱 Початковий</span>
                            <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-extrabold ${
                              selectedKitTier === 'starter' ? 'bg-[#18181b] text-[#d8f087]' : 'bg-[#141518] text-[#d8f087] border border-neutral-800'
                            }`}>
                              Базовий
                            </span>
                          </div>
                          <p className="text-[9.5px] opacity-90 mt-1 leading-tight">
                            Основні добрива, бактерії, базові стимулятори
                          </p>
                        </button>

                        {/* 2. Любитель рівень */}
                        <button
                          type="button"
                          onClick={() => handleSelectKitTier('amateur')}
                          className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                            selectedKitTier === 'amateur'
                              ? 'bg-[#d8f087] text-[#18181b] font-black border-[#d8f087] shadow-sm'
                              : 'bg-[#18191c] hover:bg-[#22242a] text-neutral-200 border-neutral-800 font-bold'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black">⭐ Любитель</span>
                            <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-extrabold ${
                              selectedKitTier === 'amateur' ? 'bg-[#18181b] text-[#d8f087]' : 'bg-[#141518] text-[#d8f087] border border-neutral-800'
                            }`}>
                              Оптимальний
                            </span>
                          </div>
                          <p className="text-[9.5px] opacity-90 mt-1 leading-tight">
                            Основні добрива, бактерії, їжа для бактерій, стимулятори
                          </p>
                        </button>

                        {/* 3. PRO рівень */}
                        <button
                          type="button"
                          onClick={() => handleSelectKitTier('pro')}
                          className={`p-2.5 rounded-xl text-left border cursor-pointer transition-all ${
                            selectedKitTier === 'pro'
                              ? 'bg-[#d8f087] text-[#18181b] font-black border-[#d8f087] shadow-sm'
                              : 'bg-[#18191c] hover:bg-[#22242a] text-neutral-200 border-neutral-800 font-bold'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black">👑 PRO / Максимум</span>
                            <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-extrabold ${
                              selectedKitTier === 'pro' ? 'bg-[#18181b] text-[#d8f087]' : 'bg-[#141518] text-[#d8f087] border border-neutral-800'
                            }`}>
                              Найдорожчий
                            </span>
                          </div>
                          <p className="text-[9.5px] opacity-90 mt-1 leading-tight">
                            Максимальний спектр: мікроби, їжа, вітаміни, ензими
                          </p>
                        </button>
                      </div>
                    </div>

                    {/* Таблиця/Список необхідних добрив та флаконів */}
                    {fullCycleRequirements.requirements.length > 0 ? (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[10px] font-black text-[#d8f087]">
                          <span>📦 Рекомендований список та упаковки добрив ({fullCycleRequirements.requirements.length} шт.):</span>
                          <span className="text-[9px] text-neutral-400">На весь цикл вирощування</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {fullCycleRequirements.requirements.map((req, rIdx) => {
                            const { brand, shortName } = formatProductDisplayName(req.product.name);
                            return (
                              <div
                                key={rIdx}
                                className="bg-[#18191c] border border-neutral-800 hover:border-neutral-700 rounded-xl p-2.5 flex items-center justify-between gap-2 transition-all"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {req.product.imageUrl && (
                                    <img
                                      src={req.product.imageUrl}
                                      alt={req.product.name}
                                      className="w-8 h-8 object-cover rounded-lg border border-neutral-700 shrink-0"
                                    />
                                  )}
                                  <div className="min-w-0">
                                    {brand && (
                                      <span className="text-[8.5px] font-bold text-neutral-400 uppercase leading-none block truncate">
                                        {brand}
                                      </span>
                                    )}
                                    <span className="font-black text-white text-[11px] leading-tight block break-words line-clamp-2">
                                      {shortName}
                                    </span>
                                    <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                      <span className="text-[8.5px] bg-[#141518] text-neutral-300 border border-neutral-800 px-1.5 py-0.5 rounded font-extrabold">
                                        {req.product.category}
                                      </span>
                                      {req.product.npkRatio && (
                                        <span className="text-[8.5px] text-[#d8f087] font-mono font-bold">
                                          NPK {req.product.npkRatio}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="text-[#d8f087] font-black text-xs block">
                                    {req.totalMlNeeded} мл
                                  </span>
                                  <span className="text-[9px] bg-[#141518] text-[#d8f087] border border-neutral-800 px-1.5 py-0.5 rounded font-black block mt-0.5">
                                    📦 {req.recommendedBottle}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#18191c] p-3 rounded-xl border border-neutral-800 text-center space-y-2">
                        <p className="text-[11px] text-neutral-300 font-medium">
                          Не обрано жодного добрива. Натисніть кнопку нижче, щоб сформувати Smart-Комплект!
                        </p>
                        <button
                          type="button"
                          onClick={selectSmartKit}
                          className="px-3.5 py-1.5 bg-[#d8f087] hover:bg-[#cbe37a] text-[#18181b] font-black text-xs rounded-xl transition-all cursor-pointer shadow-sm"
                        >
                          ✨ Сформувати Smart-Комплект AI
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#18191c] text-neutral-300 rounded-2xl font-bold cursor-pointer hover:bg-neutral-800 border border-neutral-800"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#d8f087] hover:bg-[#cbe37a] text-[#18181b] font-black rounded-2xl cursor-pointer"
            >
              Створити рослину (+15 XP)
            </button>
          </div>
        </form>
      </div>

      {/* MODAL: Каталог продуктів виробника з вибором та фотографіями */}
      {showNutrientProductsCatalog && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 z-50 overflow-y-auto animate-fadeIn">
          <div className="bg-[#121316] rounded-none sm:rounded-3xl w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] flex flex-col shadow-2xl border-0 sm:border border-neutral-800 overflow-hidden text-white">
            {/* Modal Header */}
            <div className="p-4 bg-[#18191c] text-white flex items-center justify-between border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{activeNutrientManufacturer.logoSymbol}</span>
                <div>
                  <h3 className="font-extrabold text-base leading-tight text-white">
                    Продукти виробника: {activeNutrientManufacturer.name}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    ⭐ {activeNutrientManufacturer.rating}/10 • {activeManufacturerProducts.length} продуктів • Вибрано: {selectedProductIds.length}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNutrientProductsCatalog(false)}
                className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Toolbar */}
            <div className="px-4 py-2 bg-[#18191c] border-b border-neutral-800 flex items-center justify-between text-xs flex-wrap gap-2 text-white">
              <span className="font-extrabold text-[#d8f087]">
                Оберіть продукти, які є у вашому наявності:
              </span>
              <div className="flex gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={selectSmartKit}
                  className="px-2.5 py-1 bg-[#fce182] hover:bg-[#ebd273] text-[#18181b] text-[10.5px] font-black rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>✨ Smart Комплект AI</span>
                </button>
                <button
                  type="button"
                  onClick={selectAllProducts}
                  className="px-2.5 py-1 bg-[#d8f087] hover:bg-[#cbe37a] text-[#18181b] text-[10.5px] font-black rounded-lg transition-colors cursor-pointer"
                >
                  Вибрати всі ({activeManufacturerProducts.length})
                </button>
                <button
                  type="button"
                  onClick={clearAllProducts}
                  className="px-2.5 py-1 bg-[#121316] hover:bg-neutral-800 text-neutral-300 text-[10.5px] font-bold rounded-lg border border-neutral-800 transition-colors cursor-pointer"
                >
                  Очистити
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-3.5 flex-1 bg-[#121316]">
              <div className="bg-[#18191c] border border-neutral-800 rounded-2xl p-3 text-xs text-neutral-300 font-medium">
                🧠 <span className="font-bold text-[#d8f087]">AI Аналітичний модуль:</span> Вибрані вами продукти формують персональний набір для розрахунку 5 AI варіантів живлення на всіх етапах (від сходів до промивки).
              </div>

              {activeManufacturerProducts.length > 0 ? (
                <div className="space-y-2">
                  {activeManufacturerProducts.map((prod) => {
                    const isChecked = selectedProductIds.includes(prod.id);
                    const { brand, shortName } = formatProductDisplayName(prod.name);

                    return (
                      <div
                        key={prod.id}
                        className={`bg-[#18191c] border rounded-xl p-2.5 space-y-1.5 transition-all ${
                          isChecked
                            ? 'border-[#d8f087]'
                            : 'border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            {brand && (
                              <span className="text-[9px] font-extrabold text-[#d8f087] uppercase tracking-wider block">
                                {brand}
                              </span>
                            )}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-extrabold text-xs text-white leading-tight">
                                {shortName}
                              </h4>
                              {prod.npkRatio && (
                                <span className="text-[9px] font-black bg-[#121316] text-[#d8f087] px-1.5 py-0.5 rounded-md border border-neutral-800">
                                  NPK {prod.npkRatio}
                                </span>
                              )}
                              <span className="text-[9px] font-bold bg-[#121316] text-neutral-300 px-1.5 py-0.5 rounded-md border border-neutral-800">
                                {prod.category}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleProductSelection(prod.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                              isChecked
                                ? 'bg-[#d8f087] text-[#18181b]'
                                : 'bg-[#121316] text-neutral-300 border border-neutral-800 hover:bg-neutral-800'
                            }`}
                          >
                            <Check className={`w-3 h-3 ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                            <span>{isChecked ? 'Вибрано' : '+ Додати'}</span>
                          </button>
                        </div>

                        <p className="text-[11px] text-neutral-300 leading-snug">
                          {prod.description}
                        </p>

                        {(prod.composition || prod.applicationRate || prod.bestPractices) && (
                          <div className="bg-[#121316] rounded-lg p-2 border border-neutral-800 text-[10px] text-neutral-300 space-y-1">
                            {prod.composition && (
                              <p className="leading-tight">
                                <span className="font-bold text-cyan-400">🧪 Склад:</span> {prod.composition}
                              </p>
                            )}
                            {prod.applicationRate && (
                              <p className="leading-tight text-emerald-400 font-semibold">
                                <span className="font-bold">💧 Дозування:</span> {prod.applicationRate}
                              </p>
                            )}
                            {prod.bestPractices && (
                              <p className="leading-snug text-emerald-300 font-medium bg-[#18191c] p-1.5 rounded-md border border-neutral-800">
                                <span className="font-bold text-[#d8f087]">🌿 Кращі практики для канабісу:</span> {prod.bestPractices}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-[#18191c] border border-neutral-800 rounded-2xl p-5 text-center space-y-2">
                  <FlaskConical className="w-8 h-8 text-[#d8f087] mx-auto" />
                  <p className="text-xs font-black text-white">
                    База продуктів бренду {activeNutrientManufacturer.name} заповнена в універсальному стандарті.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#18191c] border-t border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-300 pl-2">
                Всього вибрано {selectedProductIds.length} з {activeManufacturerProducts.length} продуктів
              </span>
              <button
                type="button"
                onClick={() => setShowNutrientProductsCatalog(false)}
                className="px-5 py-2 bg-[#d8f087] hover:bg-[#cbe37a] text-[#18181b] text-xs font-black rounded-xl cursor-pointer"
              >
                Зберегти та закрити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

