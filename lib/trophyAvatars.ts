import React from 'react';
import { HarvestTrophy } from './types';

export interface TrophyAvatarPreset {
  id: string;
  nameUk: string;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  descriptionUk: string;
  svgDataUrl: string;
  accentColor: string;
  badgeBg: string;
}

// Cannabis Culture Unique Trophy Avatars (Embedded high-quality SVGs)
export const TROPHY_AVATAR_PRESETS: TrophyAvatarPreset[] = [
  {
    id: 'diamond-trichome',
    nameUk: 'Діамантовий Трихом',
    level: 'Diamond',
    descriptionUk: 'Вищий ступінь майстерності: сухий врожай 100g+ з найвищим вмістом кристал-трихом.',
    accentColor: '#a855f7',
    badgeBg: 'from-purple-900/40 via-fuchsia-900/30 to-indigo-950/60',
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#3b0764"/>
            <stop offset="70%" stop-color="#1e1b4b"/>
            <stop offset="100%" stop-color="#090514"/>
          </radialGradient>
          <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#e9d5ff"/>
            <stop offset="50%" stop-color="#c084fc"/>
            <stop offset="100%" stop-color="#7e22ce"/>
          </linearGradient>
          <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="100%" stop-color="#eab308"/>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <!-- Background Shield -->
        <rect width="200" height="200" rx="40" fill="url(#bgGrad)"/>
        <circle cx="100" cy="100" r="85" fill="none" stroke="#c084fc" stroke-width="2" opacity="0.4" stroke-dasharray="6,4"/>
        
        <!-- Outer Halo -->
        <circle cx="100" cy="90" r="55" fill="#a855f7" opacity="0.15" filter="url(#glow)"/>
        
        <!-- Pedestal -->
        <path d="M60 160 L140 160 L130 145 L70 145 Z" fill="#1e1b4b" stroke="#c084fc" stroke-width="2"/>
        <rect x="75" y="135" width="50" height="10" rx="3" fill="url(#goldGlow)"/>
        
        <!-- Trichome Stem (Glassy stalk) -->
        <path d="M93 135 C93 110, 95 95, 96 82 L104 82 C105 95, 107 110, 107 135 Z" fill="url(#crystalGrad)" opacity="0.9" filter="url(#glow)"/>
        
        <!-- Trichome Diamond Head (Resin Gland) -->
        <polygon points="100,25 128,52 100,88 72,52" fill="url(#crystalGrad)" stroke="#ffffff" stroke-width="2.5" filter="url(#glow)"/>
        <polygon points="100,25 114,52 100,88 86,52" fill="#ffffff" opacity="0.3"/>
        <line x1="72" y1="52" x2="128" y2="52" stroke="#ffffff" stroke-width="1.5" opacity="0.8"/>
        
        <!-- Sparkling Stars -->
        <path d="M100 15 L102 22 L109 24 L102 26 L100 33 L98 26 L91 24 L98 22 Z" fill="#ffffff" filter="url(#glow)"/>
        <path d="M65 45 L66 50 L71 51 L66 52 L65 57 L64 52 L59 51 L64 50 Z" fill="#e9d5ff" filter="url(#glow)"/>
        <path d="M135 45 L136 50 L141 51 L136 52 L135 57 L134 52 L129 51 L134 50 Z" fill="#e9d5ff" filter="url(#glow)"/>
        
        <!-- Cannabis Leaves Accent -->
        <path d="M100 135 C80 130 65 115 50 125 C65 138 85 138 100 135 Z" fill="#22c55e" opacity="0.8"/>
        <path d="M100 135 C120 130 135 115 150 125 C135 138 115 138 100 135 Z" fill="#22c55e" opacity="0.8"/>
        
        <!-- Diamond Text Badge -->
        <rect x="50" y="166" width="100" height="20" rx="10" fill="#a855f7" stroke="#ffffff" stroke-width="1"/>
        <text x="100" y="180" font-family="sans-serif" font-weight="900" font-size="10" fill="#ffffff" text-anchor="middle" letter-spacing="1">DIAMOND YIELD</text>
      </svg>
    `)}`
  },
  {
    id: 'gold-bud-master',
    nameUk: 'Золота Шишка Майстра',
    level: 'Gold',
    descriptionUk: 'Золотий кубок за сухий врожай 70g+ з ідеальним ароматичним та терпеновим профілем.',
    accentColor: '#eab308',
    badgeBg: 'from-amber-950/60 via-amber-900/40 to-yellow-950/50',
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          <radialGradient id="goldBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#78350f"/>
            <stop offset="70%" stop-color="#451a03"/>
            <stop offset="100%" stop-color="#0f0502"/>
          </radialGradient>
          <linearGradient id="goldMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="35%" stop-color="#eab308"/>
            <stop offset="70%" stop-color="#ca8a04"/>
            <stop offset="100%" stop-color="#854d0e"/>
          </linearGradient>
          <radialGradient id="budGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#facc15" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#ca8a04" stop-opacity="0"/>
          </radialGradient>
        </defs>
        
        <!-- Base Shield -->
        <rect width="200" height="200" rx="40" fill="url(#goldBg)"/>
        <circle cx="100" cy="100" r="82" fill="none" stroke="#facc15" stroke-width="2.5" opacity="0.6"/>
        
        <!-- Glow Behind Bud -->
        <circle cx="100" cy="85" r="50" fill="url(#budGlow)"/>
        
        <!-- Golden Cannabis Cup Base -->
        <path d="M55 162 L145 162 L135 146 L65 146 Z" fill="url(#goldMetal)"/>
        <rect x="85" y="115" width="30" height="32" rx="4" fill="url(#goldMetal)"/>
        <path d="M60 115 L140 115 C135 140 115 145 100 145 C85 145 65 140 60 115 Z" fill="url(#goldMetal)"/>
        
        <!-- Cup Handles -->
        <path d="M58 85 C40 85 40 115 62 110" fill="none" stroke="url(#goldMetal)" stroke-width="6" stroke-linecap="round"/>
        <path d="M142 85 C160 85 160 115 138 110" fill="none" stroke="url(#goldMetal)" stroke-width="6" stroke-linecap="round"/>
        
        <!-- Golden Bud Cola Assembly -->
        <g transform="translate(100,75)">
          <!-- Main Central Bud -->
          <path d="M0 -45 C18 -25 22 0 15 25 C0 35 -15 35 -20 25 C-22 0 -18 -25 0 -45 Z" fill="url(#goldMetal)"/>
          <path d="M-15 -15 C-28 -5 -25 15 -12 25 C-5 25 5 20 0 0 Z" fill="#ca8a04"/>
          <path d="M15 -15 C28 -5 25 15 12 25 C5 25 -5 20 0 0 Z" fill="#fef08a"/>
          
          <!-- Resin Pistils (Orange/Gold threads) -->
          <path d="M-5 -25 C-12 -35 -18 -20 -10 -10" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M8 -30 C15 -40 20 -22 12 -12" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M0 -35 C0 -48 8 -40 2 -25" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>
          
          <!-- Golden Trichome Dots -->
          <circle cx="-6" cy="-10" r="2" fill="#ffffff"/>
          <circle cx="8" cy="-5" r="2.5" fill="#ffffff"/>
          <circle cx="2" cy="10" r="2" fill="#ffffff"/>
        </g>
        
        <!-- Emerald Leaf Wreath -->
        <path d="M45 100 C35 70 60 50 80 55 C65 65 60 85 70 100 Z" fill="#15803d"/>
        <path d="M155 100 C165 70 140 50 120 55 C135 65 140 85 130 100 Z" fill="#15803d"/>
        
        <!-- Bottom Gold Title Banner -->
        <rect x="40" y="166" width="120" height="20" rx="10" fill="#facc15" stroke="#78350f" stroke-width="1.5"/>
        <text x="100" y="180" font-family="sans-serif" font-weight="900" font-size="10" fill="#451a03" text-anchor="middle" letter-spacing="1">GOLDEN HARVEST</text>
      </svg>
    `)}`
  },
  {
    id: 'silver-leaf-cup',
    nameUk: 'Срібний Лист Гровера',
    level: 'Silver',
    descriptionUk: 'Нагорода за збалансований врожай медичного канабісу та високу активність ведення журналу.',
    accentColor: '#94a3b8',
    badgeBg: 'from-slate-900/60 via-slate-800/40 to-zinc-950/60',
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          <radialGradient id="silverBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#334155"/>
            <stop offset="70%" stop-color="#1e293b"/>
            <stop offset="100%" stop-color="#0f172a"/>
          </radialGradient>
          <linearGradient id="silverMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f8fafc"/>
            <stop offset="40%" stop-color="#cbd5e1"/>
            <stop offset="70%" stop-color="#94a3b8"/>
            <stop offset="100%" stop-color="#475569"/>
          </linearGradient>
        </defs>
        
        <!-- Base Shield -->
        <rect width="200" height="200" rx="40" fill="url(#silverBg)"/>
        <circle cx="100" cy="100" r="82" fill="none" stroke="#e2e8f0" stroke-width="2" opacity="0.5"/>
        
        <!-- Pedestal Base -->
        <path d="M60 160 L140 160 L130 145 L70 145 Z" fill="url(#silverMetal)"/>
        <rect x="88" y="118" width="24" height="28" fill="url(#silverMetal)"/>
        
        <!-- Silver Cannabis Leaf Trophy -->
        <g transform="translate(100,80)">
          <!-- Central Leaf Blade -->
          <path d="M0 -55 C8 -35 12 -15 0 20 C-12 -15 -8 -35 0 -55 Z" fill="url(#silverMetal)"/>
          <!-- Side Leaf Blades -->
          <path d="M0 -15 C20 -35 35 -20 25 10 C10 0 0 -5 0 -15 Z" fill="#cbd5e1"/>
          <path d="M0 -15 C-20 -35 -35 -20 -25 10 C-10 0 0 -5 0 -15 Z" fill="#94a3b8"/>
          <path d="M0 5 C30 -10 40 15 20 25 C10 20 0 10 0 5 Z" fill="#94a3b8"/>
          <path d="M0 5 C-30 -10 -40 15 -20 25 C-10 20 0 10 0 5 Z" fill="#64748b"/>
          
          <!-- Central Vein -->
          <line x1="0" y1="-50" x2="0" y2="35" stroke="#ffffff" stroke-width="2"/>
        </g>
        
        <!-- Mint Green Accent Stars -->
        <circle cx="50" cy="60" r="3" fill="#4ade80"/>
        <circle cx="150" cy="60" r="3" fill="#4ade80"/>
        
        <!-- Silver Title Banner -->
        <rect x="45" y="166" width="110" height="20" rx="10" fill="#e2e8f0" stroke="#334155" stroke-width="1"/>
        <text x="100" y="180" font-family="sans-serif" font-weight="900" font-size="10" fill="#0f172a" text-anchor="middle" letter-spacing="1">SILVER GROWER</text>
      </svg>
    `)}`
  },
  {
    id: 'bronze-sprout-award',
    nameUk: 'Бронзовий Нагородний Пагін',
    level: 'Bronze',
    descriptionUk: 'Перша відзнака за успішне завершення першого циклу вирощування.',
    accentColor: '#d97706',
    badgeBg: 'from-amber-950/40 via-stone-900/50 to-neutral-950/60',
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          <radialGradient id="bronzeBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#451a03"/>
            <stop offset="70%" stop-color="#292524"/>
            <stop offset="100%" stop-color="#0c0a09"/>
          </radialGradient>
          <linearGradient id="bronzeMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#fde68a"/>
            <stop offset="40%" stop-color="#d97706"/>
            <stop offset="80%" stop-color="#92400e"/>
            <stop offset="100%" stop-color="#78350f"/>
          </linearGradient>
        </defs>
        
        <rect width="200" height="200" rx="40" fill="url(#bronzeBg)"/>
        <circle cx="100" cy="100" r="80" fill="none" stroke="#d97706" stroke-width="2" opacity="0.4"/>
        
        <!-- Bronze Medal Base -->
        <circle cx="100" cy="90" r="50" fill="url(#bronzeMetal)" stroke="#78350f" stroke-width="3"/>
        <circle cx="100" cy="90" r="42" fill="none" stroke="#fde68a" stroke-width="1.5" stroke-dasharray="4,3"/>
        
        <!-- Young Cannabis Sprout Icon -->
        <g transform="translate(100,90)">
          <path d="M0 25 C0 5, -2 -10, -20 -25 C-5 -25 0 -10 0 25 Z" fill="#22c55e"/>
          <path d="M0 25 C0 5, 2 -10, 20 -25 C5 -25 0 -10 0 25 Z" fill="#16a34a"/>
          <path d="M0 25 L0 -30" stroke="#fde68a" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="0" cy="-30" r="4" fill="#fde68a"/>
        </g>
        
        <!-- Title Banner -->
        <rect x="45" y="162" width="110" height="20" rx="10" fill="#d97706" stroke="#451a03" stroke-width="1"/>
        <text x="100" y="176" font-family="sans-serif" font-weight="900" font-size="10" fill="#ffffff" text-anchor="middle" letter-spacing="1">BRONZE SPROUT</text>
      </svg>
    `)}`
  },
  {
    id: 'emerald-medical-cup',
    nameUk: 'Смарагдовий Медичний Кубок',
    level: 'Diamond',
    descriptionUk: 'Особлива відзнака за вирощування медичних сортів з високим співвідношенням CBD/THC.',
    accentColor: '#10b981',
    badgeBg: 'from-emerald-950/60 via-teal-900/40 to-zinc-950/60',
    svgDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          <radialGradient id="emeraldBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#064e3b"/>
            <stop offset="70%" stop-color="#022c22"/>
            <stop offset="100%" stop-color="#020617"/>
          </radialGradient>
          <linearGradient id="emeraldGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#a7f3d0"/>
            <stop offset="50%" stop-color="#10b981"/>
            <stop offset="100%" stop-color="#047857"/>
          </linearGradient>
        </defs>
        
        <rect width="200" height="200" rx="40" fill="url(#emeraldBg)"/>
        <circle cx="100" cy="100" r="82" fill="none" stroke="#34d399" stroke-width="2" opacity="0.5"/>
        
        <!-- Emerald Chalice Base -->
        <path d="M60 160 L140 160 L130 145 L70 145 Z" fill="#047857" stroke="#34d399" stroke-width="1.5"/>
        <rect x="88" y="115" width="24" height="30" fill="url(#emeraldGlass)"/>
        
        <!-- Cup Bowl -->
        <path d="M55 60 L145 60 C140 110 115 120 100 120 C85 120 60 110 55 60 Z" fill="url(#emeraldGlass)" stroke="#a7f3d0" stroke-width="2"/>
        
        <!-- Medical Cross / Leaf Hybrid Badge inside Cup -->
        <circle cx="100" cy="85" r="18" fill="#064e3b" stroke="#a7f3d0" stroke-width="2"/>
        <path d="M96 75 H104 V81 H110 V89 H104 V95 H96 V89 H90 V81 H96 Z" fill="#34d399"/>
        
        <!-- Gold Crown Rim -->
        <path d="M52 60 L65 48 L80 58 L100 42 L120 58 L135 48 L148 60 Z" fill="#facc15"/>
        
        <rect x="40" y="166" width="120" height="20" rx="10" fill="#10b981" stroke="#a7f3d0" stroke-width="1"/>
        <text x="100" y="180" font-family="sans-serif" font-weight="900" font-size="10" fill="#ffffff" text-anchor="middle" letter-spacing="1">MEDICAL MASTER</text>
      </svg>
    `)}`
  }
];

/**
 * Returns the trophy avatar preset or custom URL based on trophy parameters
 */
export function getTrophyAvatarUrl(trophy?: Partial<HarvestTrophy>): string {
  if (!trophy) return TROPHY_AVATAR_PRESETS[1].svgDataUrl;
  
  if (trophy.avatarUrl) {
    return trophy.avatarUrl;
  }

  // Check level or yield
  const level = trophy.trophyLevel || (
    (trophy.totalYieldGrams || 0) >= 100 ? 'Diamond' :
    (trophy.totalYieldGrams || 0) >= 70 ? 'Gold' :
    (trophy.totalYieldGrams || 0) >= 40 ? 'Silver' : 'Bronze'
  );

  if (trophy.strain?.toLowerCase().includes('cbd') || trophy.strainType === 'Hybrid' && (trophy.totalYieldGrams || 0) > 80) {
    const emeraldPreset = TROPHY_AVATAR_PRESETS.find(p => p.id === 'emerald-medical-cup');
    if (emeraldPreset) return emeraldPreset.svgDataUrl;
  }

  const preset = TROPHY_AVATAR_PRESETS.find(p => p.level === level) || TROPHY_AVATAR_PRESETS[1];
  return preset.svgDataUrl;
}

/**
 * Helper to get preset metadata
 */
export function getTrophyPreset(level?: string, strain?: string): TrophyAvatarPreset {
  if (strain?.toLowerCase().includes('cbd')) {
    return TROPHY_AVATAR_PRESETS.find(p => p.id === 'emerald-medical-cup') || TROPHY_AVATAR_PRESETS[0];
  }
  return TROPHY_AVATAR_PRESETS.find(p => p.level === level) || TROPHY_AVATAR_PRESETS[1];
}
