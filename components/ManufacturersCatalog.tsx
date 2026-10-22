'use client';

import React, { useState, useMemo } from 'react';
import {
  MANUFACTURERS_CATALOG,
  ManufacturerBrand
} from '@/lib/manufacturersData';
import {
  Search,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  X,
  List,
  LayoutGrid,
  TrendingUp
} from 'lucide-react';

interface ManufacturersCatalogProps {
  onSelectProductForTask?: (productName: string, dosage: string) => void;
}

export const ManufacturersCatalog: React.FC<ManufacturersCatalogProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Organic' | 'Mineral' | 'Bio-Mineral' | 'Specialized'>('All');
  const [selectedBrand, setSelectedBrand] = useState<ManufacturerBrand | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Filtered brands
  const filteredBrands = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return MANUFACTURERS_CATALOG.filter((brand) => {
      const matchesSearch =
        !q ||
        brand.name.toLowerCase().includes(q) ||
        brand.country.toLowerCase().includes(q) ||
        brand.shortBioUk.toLowerCase().includes(q) ||
        brand.products.some((p) => p.name.toLowerCase().includes(q) || p.bestUsedForUk.toLowerCase().includes(q));

      const matchesCategory = selectedCategory === 'All' || brand.categoryType === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-4 animate-fade-in text-white">
      {/* Search & View Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#18191c] p-3 sm:p-4 rounded-2xl border border-neutral-800">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Швидкий пошук за назвою виробника чи препарату..."
            className="w-full bg-[#121316] border border-neutral-700/80 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-white placeholder-neutral-500 focus:outline-none focus:border-[#d8f087] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories & View Switcher */}
        <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
          {/* Category Chips */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {(['All', 'Organic', 'Mineral', 'Bio-Mineral', 'Specialized'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-black transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#d8f087] text-[#18181b]'
                    : 'bg-[#22242a] text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {cat === 'All' && 'Всі'}
                {cat === 'Organic' && '🌱 Органіка'}
                {cat === 'Mineral' && '⚡ Мінеральні'}
                {cat === 'Bio-Mineral' && '🌿 Біо-мінеральні'}
                {cat === 'Specialized' && '🔬 Спец'}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#121316] border border-neutral-800 p-0.5 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-[#d8f087] text-neutral-900 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="Список (як на GrowDiaries)"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">Список</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                viewMode === 'grid' ? 'bg-[#d8f087] text-neutral-900 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="Сітка карток"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">Картки</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count Info */}
      <div className="flex items-center justify-between text-xs text-neutral-400 px-1 font-medium">
        <span>Знайдено виробників: <strong className="text-white">{filteredBrands.length}</strong></span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-[#d8f087] hover:underline cursor-pointer"
          >
            Показати всіх ({MANUFACTURERS_CATALOG.length})
          </button>
        )}
      </div>

      {/* VIEW 1: CLEAN LIST VIEW (GrowDiaries Style) */}
      {viewMode === 'list' && (
        <div className="bg-[#18191d] border border-neutral-800/90 rounded-3xl overflow-hidden shadow-xl divide-y divide-neutral-800/60">
          {filteredBrands.map((brand, idx) => (
            <div
              key={brand.id}
              onClick={() => setSelectedBrand(brand)}
              className="p-4 sm:p-5 hover:bg-[#202228] transition-all duration-150 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              {/* Left: Rank, Flag, Name, Category */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-7 text-center font-mono font-black text-neutral-500 group-hover:text-[#d8f087] text-xs shrink-0">
                  #{idx + 1}
                </div>
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700/80 flex items-center justify-center text-xl shadow-inner shrink-0">
                  {brand.countryFlag}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-white text-sm sm:text-base group-hover:text-[#d8f087] transition-colors truncate">
                      {brand.name}
                    </h3>
                    {brand.partnerPlan.isOfficialPartner && (
                      <span title="Офіційний перевірений бренд">
                        <ShieldCheck className="w-4 h-4 text-[#d8f087] shrink-0" />
                      </span>
                    )}
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300">
                      {brand.categoryType}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 truncate max-w-xl font-medium mt-0.5">
                    {brand.shortBioUk}
                  </p>
                </div>
              </div>

              {/* Right: Stats & Action */}
              <div className="flex items-center justify-between sm:justify-end gap-4 pl-10 sm:pl-0 shrink-0 text-xs">
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-400 font-black justify-end">
                      <span>★</span>
                      <span>{brand.growDiariesRating}/10</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 font-medium">
                      {brand.growReportsCount.toLocaleString()}+ гровів
                    </div>
                  </div>

                  <div className="text-right border-l border-neutral-800 pl-3">
                    <div className="text-white font-black text-xs">
                      {brand.products.length} {brand.growDiariesProductsCount ? `(${brand.growDiariesProductsCount})` : ''}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-medium">товарів</div>
                  </div>
                </div>

                <button
                  className="px-3 py-1.5 rounded-xl bg-[#22242a] group-hover:bg-[#d8f087] group-hover:text-neutral-950 font-black text-neutral-300 text-xs transition-all flex items-center gap-1 shrink-0"
                >
                  <span>Лінійка</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              onClick={() => setSelectedBrand(brand)}
              className="bg-[#18191d] hover:bg-[#202227] border border-neutral-800/80 hover:border-neutral-700 rounded-3xl p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700/80 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {brand.countryFlag}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-white text-base group-hover:text-[#d8f087] transition-colors">
                          {brand.name}
                        </h3>
                        {brand.partnerPlan.isOfficialPartner && (
                          <ShieldCheck className="w-4 h-4 text-[#d8f087]" />
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 font-medium">
                        {brand.country} • засн. {brand.foundedYear}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300">
                    {brand.categoryType}
                  </span>
                </div>

                {/* Badge Tag */}
                <div className="bg-[#121316] p-2 rounded-xl border border-neutral-800/80 text-[11px] font-bold text-[#fad277] flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0 text-[#d8f087]" />
                  <span className="truncate">{brand.badgeTag}</span>
                </div>

                {/* Bio */}
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {brand.shortBioUk}
                </p>

                {/* Products tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {brand.products.slice(0, 4).map((p) => (
                    <span key={p.id} className="text-[9px] bg-[#121316] border border-neutral-800 text-neutral-300 px-2 py-0.5 rounded-md font-medium">
                      {p.name.split('(')[0]}
                    </span>
                  ))}
                  {brand.products.length > 4 && (
                    <span className="text-[9px] bg-neutral-800/60 text-neutral-400 px-1.5 py-0.5 rounded-md">
                      +{brand.products.length - 4} товарів
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-amber-400 font-black">
                    <span>★</span>
                    <span>{brand.growDiariesRating}/10</span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    {brand.growReportsCount.toLocaleString()}+ звітів
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[#d8f087] font-black text-xs group-hover:translate-x-1 transition-transform">
                  <span>{brand.products.length} товарів</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BRAND DETAILS MODAL - Contains all products and educational info */}
      {selectedBrand && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col justify-start sm:justify-center items-stretch p-0 sm:p-2 overflow-y-auto">
          <div className="bg-[#121316] border-0 sm:border border-neutral-800 rounded-none sm:rounded-3xl w-screen sm:w-full max-w-none p-3 sm:p-8 space-y-6 text-white min-h-screen sm:min-h-[96vh] overflow-y-auto shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-neutral-800 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#18191d] border border-neutral-700 flex items-center justify-center text-3xl shadow-inner shrink-0">
                  {selectedBrand.countryFlag}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl sm:text-2xl font-black text-white">{selectedBrand.name}</h3>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#d8f087]/20 text-[#d8f087] border border-[#d8f087]/40">
                      {selectedBrand.categoryType}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-amber-300 border border-neutral-700">
                      ★ {selectedBrand.growDiariesRating}/10 ({selectedBrand.growReportsCount.toLocaleString()}+ звітів на GrowDiaries)
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-medium">
                    {selectedBrand.country} • Штаб-квартира: {selectedBrand.headquarters} • засн. {selectedBrand.foundedYear}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedBrand(null)}
                className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded-xl transition-all cursor-pointer"
                title="Закрити"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description & Advantages */}
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {selectedBrand.fullDescriptionUk}
              </p>

              <div className="bg-[#18191d] p-4 rounded-2xl border border-neutral-800 space-y-2">
                <h5 className="text-xs font-black text-[#fad277] uppercase tracking-wider">Ключові особливості та філософія:</h5>
                <ul className="space-y-1.5 text-xs text-neutral-300">
                  {selectedBrand.keyAdvantagesUk.map((adv, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d8f087] shrink-0 mt-0.5" />
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Products List of this Brand */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white">
                  Фірмова лінійка продукції ({selectedBrand.products.length}):
                </h4>
                <span className="text-xs text-neutral-400 font-medium">Оригінальні формули</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedBrand.products.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-[#18191d] border border-neutral-800 rounded-2xl p-4 space-y-2 flex flex-col justify-between hover:border-neutral-700 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-black text-[#fad277]">{prod.categoryLabelUk}</span>
                        {prod.npk && (
                          <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-2 py-0.5 rounded-full">
                            NPK {prod.npk}
                          </span>
                        )}
                      </div>
                      <h5 className="text-xs font-black text-white pt-1">{prod.name}</h5>
                      <p className="text-[11px] text-neutral-400 leading-relaxed pt-1">{prod.descriptionUk}</p>
                    </div>

                    <div className="pt-2 border-t border-neutral-800 space-y-1.5 text-[11px]">
                      <div className="bg-[#121316] p-2 rounded-xl flex items-center justify-between text-[11px]">
                        <span className="text-neutral-500">Рекомендована норма:</span>
                        <span className="font-black text-[#d8f087]">{prod.dosageGuide}</span>
                      </div>
                      <div className="text-[10px] text-neutral-300">
                        🎯 <strong className="text-white">Призначення:</strong> {prod.bestUsedForUk}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Website & Community Promo */}
            {selectedBrand.partnerPlan.websiteUrl && (
              <div className="bg-gradient-to-r from-[#18191d] to-[#202227] border border-neutral-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#d8f087]" />
                    <span>Офіційний сайт виробника {selectedBrand.name}</span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Переглянути офіційні таблиці та детальні сертифікати якості
                  </div>
                </div>

                <a
                  href={selectedBrand.partnerPlan.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-[#d8f087] hover:bg-[#c8e672] text-[#18181b] rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>Відвідати сайт</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedBrand(null)}
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs py-3 rounded-2xl cursor-pointer transition-colors"
              >
                Закрити вікно
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

