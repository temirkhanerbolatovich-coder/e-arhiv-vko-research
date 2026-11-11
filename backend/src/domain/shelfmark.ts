/**
 * Разбор архивного шифра: «Ф. Р-1, оп. 1, д. 15, л. 3» → {fund, inventory, case, sheet}.
 * Используется поиском (точный шифр важнее смыслового совпадения) и помощником.
 */
export interface Shelfmark {
  fund: string | null;
  inventory: string | null;
  case: string | null;
  sheet: string | null;
}

const PART = '([рp]?-?\\s?\\d+[а-я]?(?:\\s?ч\\.?\\s?с\\.?)?)';
const patterns: Array<[keyof Shelfmark, RegExp]> = [
  ['fund', new RegExp(`(?:^|\\s|,)(?:ф|фонд|қор|fund)\\.?\\s*№?\\s*${PART}`, 'iu')],
  ['inventory', /(?:^|\s|,)(?:оп|опись|тізімдеме|inv|inventory)\.?\s*№?\s*(\d+[а-я]?)/iu],
  ['case', /(?:^|\s|,)(?:д|дело|іс|case)\.?\s*№?\s*(\d+[а-я]?)/iu],
  ['sheet', /(?:^|\s|,)(?:л|лист|парақ|sheet)\.?\s*(\d+(?:\s?[-–]\s?\d+)?)/iu],
];

/** Приводит номер фонда к виду каталога: «р1» → «Р-1», латинская p → кириллическая Р. */
export function normalizeFundNumber(raw: string): string {
  const compact = raw.toLocaleUpperCase('ru').replace(/P/g, 'Р').replace(/\s+/g, ' ').trim();
  const match = /^(Р)?\s?-?\s?(\d+[А-Я]?)(.*)$/u.exec(compact);
  if (!match) return compact;
  const [, prefix, number, rest = ''] = match;
  return `${prefix ? 'Р-' : ''}${number}${rest.trim() ? ' ' + rest.trim().toLocaleLowerCase('ru') : ''}`;
}

export function parseShelfmark(text: string): Shelfmark | null {
  const result: Shelfmark = { fund: null, inventory: null, case: null, sheet: null };
  for (const [key, pattern] of patterns) {
    const match = pattern.exec(text);
    if (match?.[1]) result[key] = key === 'fund' ? normalizeFundNumber(match[1]) : match[1].replace(/\s/g, '');
  }
  // Номер фонда без слова «фонд» («Р-136», «р136») — частый способ искать по шифру.
  const bareFund = /^\s*([рp]\s?-?\s?\d+[а-я]?)\s*$/iu.exec(text);
  if (!result.fund && bareFund?.[1]) result.fund = normalizeFundNumber(bareFund[1]);
  return result.fund || result.inventory || result.case ? result : null;
}

export function formatShelfmark(parts: Partial<Shelfmark>): string {
  return [
    parts.fund && `Ф. ${parts.fund}`,
    parts.inventory && `оп. ${parts.inventory}`,
    parts.case && `д. ${parts.case}`,
    parts.sheet && `л. ${parts.sheet}`,
  ].filter(Boolean).join(', ');
}
