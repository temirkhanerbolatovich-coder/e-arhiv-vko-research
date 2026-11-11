/** Памятные даты: в календаре архива дата хранится текстом («7 февраля 2025»), важны только день и месяц. */
const MONTHS = ['январ', 'феврал', 'март', 'апрел', 'ма', 'июн', 'июл', 'август', 'сентябр', 'октябр', 'ноябр', 'декабр'];

export function parseDayMonth(text: string): { day: number; month: number } | null {
  const match = /(\d{1,2})\s+([а-яё]+)/iu.exec(text);
  if (!match) return null;
  const word = match[2]!.toLocaleLowerCase('ru');
  // «ма» — префикс «мая»; проверяем длинные основы раньше, чтобы «март» не совпал с «ма».
  const month = MONTHS.map((stem, index) => ({ stem, index })).sort((a, b) => b.stem.length - a.stem.length).find(({ stem }) => word.startsWith(stem))?.index;
  const day = Number(match[1]);
  return month === undefined || day < 1 || day > 31 ? null : { day, month };
}

/** Ближайшие даты начиная с сегодняшнего дня (по кругу через Новый год). */
export function upcomingEvents<T extends { date: string }>(events: T[], today: Date, limit: number): Array<T & { day: number; month: number; inDays: number }> {
  const start = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return events.flatMap((event) => {
    const parsed = parseDayMonth(event.date ?? '');
    if (!parsed) return [];
    let next = Date.UTC(today.getUTCFullYear(), parsed.month, parsed.day);
    if (next < start) next = Date.UTC(today.getUTCFullYear() + 1, parsed.month, parsed.day);
    return [{ ...event, ...parsed, inDays: Math.round((next - start) / 86400000) }];
  }).sort((a, b) => a.inDays - b.inDays).slice(0, limit);
}
