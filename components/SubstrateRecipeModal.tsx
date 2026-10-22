'use client';

import React, { useState, useEffect } from 'react';
import { SubstrateRecipe, SubstrateIngredient } from '@/lib/types';
import { getDefaultRecipeForMedium, PRESET_SUBSTRATE_RECIPES, SUBSTRATE_MANUFACTURERS } from '@/lib/substrateData';
import { Layers, CheckCircle2, Sliders, X, FlaskConical, Zap, ChevronDown, ChevronUp, RefreshCw, Edit3, Plus, Trash2, Sparkles, AlertCircle } from 'lucide-react';

interface SubstrateRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe?: SubstrateRecipe;
  mediumType: 'Soil' | 'Coco' | 'Hydroponics';
  onConfirmSubstrate: (updatedRecipe: SubstrateRecipe) => void;
  isConfirmationMode?: boolean;
}

export const SubstrateRecipeModal: React.FC<SubstrateRecipeModalProps> = ({
  isOpen,
  onClose,
  recipe,
  mediumType,
  onConfirmSubstrate,
  isConfirmationMode = false
}) => {
  // Current recipe state (pre-filled with initial recipe from plant creation)
  const [currentRecipe, setCurrentRecipe] = useState<SubstrateRecipe>(() => {
    if (recipe) return JSON.parse(JSON.stringify(recipe));
    return getDefaultRecipeForMedium(mediumType, 'DIY');
  });

  const [prevRecipe, setPrevRecipe] = useState<SubstrateRecipe | undefined>(recipe);
  const [prevIsOpen, setPrevIsOpen] = useState<boolean>(isOpen);

  // Modal mode: 'edit' (edit numbers/ingredients) or 'change' (select another substrate preset)
  const [activeTab, setActiveTab] = useState<'edit' | 'change'>('edit');
  
  // Filters for preset selection mode
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('All');
  const [selectedMediumFilter, setSelectedMediumFilter] = useState<string>(mediumType);

  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(true);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  // Sync state when modal opens or recipe prop updates
  if (isOpen !== prevIsOpen || recipe !== prevRecipe) {
    setPrevIsOpen(isOpen);
    setPrevRecipe(recipe);
    if (isOpen) {
      setCurrentRecipe(recipe ? JSON.parse(JSON.stringify(recipe)) : getDefaultRecipeForMedium(mediumType));
      setSelectedMediumFilter(mediumType);
    }
  }

  if (!isOpen) return null;

  // Calculate total percentage of ingredients
  const totalPercentage = currentRecipe.ingredients.reduce((acc, ing) => acc + (Number(ing.percentage) || 0), 0);

  // Field change handlers for metrics editing
  const handleMetricChange = (field: keyof SubstrateRecipe, value: any) => {
    setCurrentRecipe(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIngredientChange = (index: number, field: keyof SubstrateIngredient, value: any) => {
    const updated = [...currentRecipe.ingredients];
    updated[index] = {
      ...updated[index],
      [field]: field === 'percentage' ? Math.max(0, Number(value) || 0) : value
    };
    setCurrentRecipe(prev => ({
      ...prev,
      ingredients: updated
    }));
  };

  const handleAddIngredient = () => {
    const newIng: SubstrateIngredient = {
      id: 'ing-' + Date.now(),
      name: 'Новий складник',
      percentage: 10,
      buyGuide: ''
    };
    setCurrentRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIng]
    }));
  };

  const handleRemoveIngredient = (index: number) => {
    setCurrentRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleSelectPreset = (preset: SubstrateRecipe) => {
    const cloned = JSON.parse(JSON.stringify(preset));
    cloned.confirmed = isConfirmationMode ? true : (cloned.confirmed ?? false);
    setCurrentRecipe(cloned);
    setActiveTab('edit');
    setNoticeMessage(`Вибрано рецепт "${preset.name}". Ви можете скоригувати його показники ниже.`);
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  const handleSave = () => {
    const finalRecipe: SubstrateRecipe = {
      ...currentRecipe,
      mediumType: currentRecipe.mediumType || mediumType,
      confirmed: isConfirmationMode ? true : true
    };
    onConfirmSubstrate(finalRecipe);
    onClose();
  };

  // Filter preset recipes for selection mode
  const filteredPresets = PRESET_SUBSTRATE_RECIPES.filter(p => {
    const matchesMedium = selectedMediumFilter === 'All' || p.mediumType === selectedMediumFilter;
    const matchesManufacturer = selectedManufacturer === 'All' || p.manufacturer === selectedManufacturer;
    return matchesMedium && matchesManufacturer;
  });

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 overflow-y-auto animate-fadeIn">
      <div className="bg-[#121316] rounded-none sm:rounded-3xl w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] flex flex-col shadow-2xl border-0 sm:border border-neutral-800 text-white overflow-hidden">
        
        {/* Header (Fixed at top) */}
        <div className="border-b border-neutral-800 p-3 sm:p-5 shrink-0 bg-[#18191c] space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#d8f087] text-[#18181b] flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  {currentRecipe.name}
                </h3>
                <p className="text-xs text-neutral-400 font-medium">
                  Налаштування складників, pH, PPM та рекомендацій субстрату
                </p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5 bg-[#121316] p-1.5 rounded-2xl border border-neutral-800">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-[#d8f087] text-[#18181b] shadow-2xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Редагувати показники</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('change')}
              className={`flex-1 py-2 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'change'
                  ? 'bg-[#d8f087] text-[#18181b] shadow-2xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Вибрати інший субстрат</span>
            </button>
          </div>
        </div>

        {/* Dynamic Notice Banner */}
        {noticeMessage && (
          <div className="bg-[#d8f087]/20 border-b border-[#d8f087]/30 px-4 py-2 text-xs font-bold text-[#d8f087] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d8f087] shrink-0" />
            <span>{noticeMessage}</span>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">

          {/* TAB 1: EDIT METRICS & INGREDIENTS */}
          {activeTab === 'edit' && (
            <div className="space-y-4">

              {/* Substrate Name Input */}
              <div>
                <label className="block text-xs font-black text-neutral-300 mb-1">
                  Назва субстрату / Рецепту:
                </label>
                <input
                  type="text"
                  value={currentRecipe.name}
                  onChange={(e) => handleMetricChange('name', e.target.value)}
                  className="w-full text-xs font-bold bg-[#18191c] border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#d8f087]"
                  placeholder="Наприклад: BioBizz All-Mix + Перліт 30%"
                />
              </div>


              {/* Ingredients List (Editable) */}
              <div className="bg-[#18191c] border border-neutral-800 rounded-2xl p-4 space-y-3">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                >
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#d8f087]" />
                    <span className="text-sm font-black text-[#d8f087]">
                      Складники Субстрату ({totalPercentage}%)
                    </span>
                    {totalPercentage !== 100 && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#fa6e59]/20 text-[#fa6e59] border border-[#fa6e59]/40">
                        Сума != 100%
                      </span>
                    )}
                  </div>
                  <button type="button" className="text-[#d8f087]">
                    {isDetailsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {isDetailsExpanded && (
                  <div className="space-y-2.5 pt-1">
                    {currentRecipe.ingredients.map((ing, idx) => (
                      <div key={ing.id || idx} className="bg-[#121316] border border-neutral-800 rounded-xl p-3 space-y-2 shadow-2xs overflow-hidden">
                        <div className="flex items-center gap-2 w-full min-w-0">
                          <input
                            type="text"
                            value={ing.name}
                            onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                            className="flex-1 min-w-0 w-full text-xs font-bold text-white bg-[#18191c] border border-neutral-800 rounded-lg px-2.5 py-1 truncate focus:outline-none focus:border-[#d8f087]"
                            placeholder="Назва складника"
                          />
                          <div className="flex items-center gap-1 shrink-0">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={ing.percentage}
                              onChange={(e) => handleIngredientChange(idx, 'percentage', e.target.value)}
                              className="w-12 text-center font-black text-xs bg-[#d8f087] text-[#18181b] border border-[#d8f087] rounded-lg py-1 focus:outline-none"
                            />
                            <span className="text-xs font-bold text-neutral-400">%</span>
                          </div>
                          {currentRecipe.ingredients.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveIngredient(idx)}
                              className="shrink-0 p-1 text-neutral-400 hover:text-rose-500 rounded-lg hover:bg-neutral-800"
                              title="Видалити складник"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={ing.buyGuide || ''}
                          onChange={(e) => handleIngredientChange(idx, 'buyGuide', e.target.value)}
                          className="w-full text-[11px] font-medium text-neutral-300 bg-[#18191c] border border-neutral-800 rounded-lg px-2 py-1 focus:outline-none focus:border-[#d8f087]"
                          placeholder="Порада покупця / Фракція (необов'язково)"
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="w-full py-2 bg-[#121316] border border-dashed border-neutral-700 hover:bg-neutral-800 text-[#d8f087] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#d8f087]" />
                      <span>Додати новий складник</span>
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: CHOOSE ANOTHER SUBSTRATE PRESET */}
          {activeTab === 'change' && (
            <div className="space-y-4">
              <div className="bg-[#fce182]/10 border border-[#fce182]/20 p-3 rounded-2xl text-xs text-[#fce182] font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#fce182] shrink-0 mt-0.5" />
                <span>
                  Якщо ви змінили субстрат або пересадили рослину, виберіть готовий рецепт або комерційну суміш нижче.
                </span>
              </div>

              {/* Filters for Presets */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-black text-neutral-400 uppercase mb-1">
                    Тип субстрату:
                  </label>
                  <select
                    value={selectedMediumFilter}
                    onChange={(e) => setSelectedMediumFilter(e.target.value)}
                    className="w-full text-xs font-bold bg-[#18191c] border border-neutral-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none"
                  >
                    <option value="All">Усі типи</option>
                    <option value="Soil">Ґрунт (Soil)</option>
                    <option value="Coco">Кокос (Coco)</option>
                    <option value="Hydroponics">Гідропоніка (Hydroponics)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-neutral-400 uppercase mb-1">
                    Виробник:
                  </label>
                  <select
                    value={selectedManufacturer}
                    onChange={(e) => setSelectedManufacturer(e.target.value)}
                    className="w-full text-xs font-bold bg-[#18191c] border border-neutral-800 rounded-xl px-2.5 py-1.5 text-white focus:outline-none"
                  >
                    <option value="All">Усі виробники</option>
                    {SUBSTRATE_MANUFACTURERS.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                    <option value="DIY">Авторські / DIY</option>
                  </select>
                </div>
              </div>

              {/* Presets List */}
              <div className="space-y-3 pt-1">
                {filteredPresets.map((preset) => (
                  <div
                    key={preset.id}
                    className="bg-[#18191c] border border-neutral-800 hover:border-[#d8f087]/50 rounded-2xl p-4 shadow-2xs space-y-2.5 transition-all text-white"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-2 py-0.5 rounded-md bg-[#d8f087]/20 text-[#d8f087] border border-[#d8f087]/30">
                            {preset.mediumType === 'Soil' ? 'Ґрунт' : preset.mediumType === 'Coco' ? 'Кокос' : 'Гідропоніка'}
                          </span>
                          <span className="text-xs font-bold text-neutral-400">
                            {preset.manufacturer}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-white mt-1">
                          {preset.name}
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className="px-3 py-1.5 bg-[#d8f087] hover:bg-[#c4e06d] text-[#18181b] font-black text-xs rounded-xl shrink-0 cursor-pointer transition-colors"
                      >
                        Застосувати
                      </button>
                    </div>

                    {/* Metrics preview badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="bg-purple-950/50 text-purple-300 border border-purple-800/60 px-2.5 py-0.5 rounded-lg font-bold">
                        pH {preset.targetPhMin === preset.targetPhMax ? preset.targetPhMin : `${preset.targetPhMin} – ${preset.targetPhMax}`}
                      </span>
                      <span className="bg-[#fce182]/10 text-[#fce182] border border-[#fce182]/20 px-2.5 py-0.5 rounded-lg font-bold">
                        PPM {preset.targetPpmMin === preset.targetPpmMax ? preset.targetPpmMin : `${preset.targetPpmMin} – ${preset.targetPpmMax}`}
                      </span>
                      {preset.nutrientBufferWeeks !== undefined && (
                        <span className="bg-[#121316] text-neutral-300 border border-neutral-800 px-2 py-0.5 rounded-lg font-semibold">
                          Запас: {preset.nutrientBufferWeeks} тиж.
                        </span>
                      )}
                    </div>

                    {preset.notes && (
                      <p className="text-[11px] text-neutral-400 italic bg-[#121316] p-2 rounded-xl border border-neutral-800 leading-tight">
                        💡 {preset.notes}
                      </p>
                    )}
                  </div>
                ))}

                {filteredPresets.length === 0 && (
                  <div className="text-center py-6 text-neutral-400 text-xs font-medium">
                    За вибраними фільтрами субстратів не знайдено.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-neutral-800 shrink-0 bg-[#18191c] flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-[#121316] border border-neutral-800 hover:bg-neutral-800 text-neutral-300 font-bold rounded-2xl text-xs cursor-pointer shadow-2xs transition-colors"
          >
            Скасувати
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#d8f087] hover:bg-[#c4e06d] text-[#18181b] font-black rounded-2xl text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Підтвердити та зберегти субстрат
          </button>
        </div>

      </div>
    </div>
  );
};
