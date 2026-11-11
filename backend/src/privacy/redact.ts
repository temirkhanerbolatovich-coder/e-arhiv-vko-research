/**
 * Маскирование персональных данных до отправки текста в модель и до записи в аналитику
 * (ТЗ 5.8 Д: «нельзя передавать ИИ персональные сведения посетителей»; Закон РК о ПДн).
 */

/** Проверка контрольного разряда ИИН (алгоритм с двумя наборами весов). */
export function isValidIin(iin: string): boolean {
  if (!/^\d{12}$/.test(iin)) return false;
  const digits = [...iin].map(Number);
  const checksum = (weights: number[]) => weights.reduce((sum, weight, index) => sum + weight * (digits[index] ?? 0), 0) % 11;
  let control = checksum([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  if (control === 10) control = checksum([3, 4, 5, 6, 7, 8, 9, 10, 11, 1, 2]);
  return control !== 10 && control === digits[11];
}

const EMAIL = /[\p{L}\p{N}._%+-]+@[\p{L}\p{N}.-]+\.[\p{L}]{2,}/gu;
const PHONE = /(?:\+7|8)[\s(-]*\d{3}[\s)-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}/g;
const TWELVE_DIGITS = /\b\d{12}\b/g;

export interface RedactionResult {
  text: string;
  found: Array<'iin' | 'phone' | 'email'>;
}

export function redactPersonalData(input: string): RedactionResult {
  const found = new Set<'iin' | 'phone' | 'email'>();
  let text = input.replace(EMAIL, () => {
    found.add('email');
    return '[EMAIL]';
  });
  // Любые 12 цифр подряд маскируем: даже без верного контрольного разряда это может быть ИИН с опечаткой.
  text = text.replace(TWELVE_DIGITS, (match) => {
    found.add('iin');
    return isValidIin(match) ? '[ИИН]' : '[НОМЕР]';
  });
  text = text.replace(PHONE, () => {
    found.add('phone');
    return '[ТЕЛЕФОН]';
  });
  return { text, found: [...found] };
}
