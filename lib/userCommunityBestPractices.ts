/**
 * PROPAHANDA GROW - User Community Best Practices & Knowledge Engine
 * 
 * ГОЛОВНА БАЗА ЗНАНЬ:
 * Цей модуль агрегує реальний практичний досвід, заміри (pH, PPM, вологість до/після),
 * реальні врожаї та перевірені методики користувачів нашого додатку (app_user_best_practices.md).
 * 
 * ДОДАТКОВИЙ МОДУЛЬ (growdiaries_full_database.md):
 * Слугує як додаткове довідкове джерело для тонкого порівняльного аналізу,
 * звірки світових генетик сідбанків та калібрування довгострокових прогнозів.
 */

import fs from 'fs';
import path from 'path';

let cachedUserPractices = '';
let cachedGrowdiariesDb = '';

/**
 * Читає основну внутрішню базу кращих практик користувачів додатку
 */
export function getAppUserBestPracticesText(): string {
  if (cachedUserPractices) return cachedUserPractices;
  try {
    const filePath = path.join(process.cwd(), 'app_user_best_practices.md');
    if (fs.existsSync(filePath)) {
      cachedUserPractices = fs.readFileSync(filePath, 'utf-8');
      return cachedUserPractices;
    }
  } catch (err) {
    console.warn('Could not read app_user_best_practices.md:', err);
  }
  return '';
}

/**
 * Читає додаткову зовнішню емпіричну базу GrowDiaries для порівняння та прогнозів
 */
export function getGrowdiariesSupplementText(): string {
  if (cachedGrowdiariesDb) return cachedGrowdiariesDb;
  try {
    const filePath = path.join(process.cwd(), 'growdiaries_full_database.md');
    if (fs.existsSync(filePath)) {
      cachedGrowdiariesDb = fs.readFileSync(filePath, 'utf-8');
      return cachedGrowdiariesDb;
    }
  } catch (err) {
    console.warn('Could not read growdiaries_full_database.md:', err);
  }
  return '';
}

/**
 * Формує системний контекст основних практик спільноти нашого додатку
 */
export function getAppUserBestPracticesPrompt(plantContext?: {
  strain?: string;
  stage?: string;
  medium?: string;
}): string {
  const baseText = getAppUserBestPracticesText();
  const summary = baseText ? baseText.slice(0, 5500) : '';

  return `
--- ОСНОВНА ВНУТРІШНЯ БАЗА: ДОСВІД ТА ПРАКТИКИ КОРИСТУВАЧІВ НАШОГО ДОДАТКУ ---
(Пріоритет №1 для всіх рекомендацій, контролю, діагностики та прогнозів.
 ВРАХОВУЙТЕ ЯК НЕГАТИВНИЙ ДОСВІД (переливи, сольові опіки, некрози, стреси),
 ТАК І ПОЗИТИВНИЙ (LST, правильний Dry-Back, помірне живлення) ДЛЯ ТОЧНОГО РОЗУМІННЯ СТАНУ РОСЛИНИ):
${summary}
------------------------------------------------------------------------------------
`.trim();
}


/**
 * Формує контекст додаткового модуля GrowDiaries для точного аналізу та прогнозів
 */
export function getGrowdiariesSupplementPrompt(breeder?: string): string {
  const gdText = getGrowdiariesSupplementText();
  const excerpt = gdText ? gdText.slice(0, 2400) : '';

  return `
--- ДОДАТКОВИЙ МОДУЛЬ GROWDIARIES (ДЛЯ ПОРІВНЯЛЬНОГО АНАЛІЗУ ТА КАЛІБРУВАННЯ ПРОГНОЗІВ) ---
(Використовується як довідник глобальних генетичних референсів, лабораторних норм та перевірки світових результатів брідерів):
${excerpt}
---------------------------------------------------------------------------------------------
`.trim();
}
