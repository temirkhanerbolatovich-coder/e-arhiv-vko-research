/**
 * Исторические и вариантные названия мест ВКО. Нужны, чтобы запрос «Лениногорск»
 * находил материалы о Риддере, а «Өскемен» — об Усть-Каменогорске (ТЗ 5.8 Б).
 * Источник фактов: история архива (материалы заказчика), указы о переименованиях.
 */
export interface PlaceAlias {
  alias: string;
  canonical: string;
  note: string;
}

export const PLACE_ALIASES: PlaceAlias[] = [
  { alias: 'өскемен', canonical: 'усть-каменогорск', note: 'Казахское название города' },
  { alias: 'oskemen', canonical: 'усть-каменогорск', note: 'Латиница' },
  { alias: 'ust-kamenogorsk', canonical: 'усть-каменогорск', note: 'Латиница' },
  { alias: 'устькаменогорск', canonical: 'усть-каменогорск', note: 'Слитное написание' },
  { alias: 'устькаменный', canonical: 'усть-каменогорск', note: 'Поэтическое название в подписях фото' },
  { alias: 'лениногорск', canonical: 'риддер', note: 'Название до 2002 года' },
  { alias: 'зыряновск', canonical: 'алтай', note: 'Город и район переименованы в 2019 году' },
  { alias: 'семипалатинск', canonical: 'семей', note: 'С 2007 года Семей, с 2022 года — область Абай' },
  { alias: 'большенарымское', canonical: 'улкен нарын', note: 'Прежнее название села' },
  { alias: 'үлкен нарын', canonical: 'улкен нарын', note: 'Казахское написание' },
  { alias: 'самарское', canonical: 'самар', note: 'Прежнее название села' },
  { alias: 'марқакөл', canonical: 'маркаколь', note: 'Казахское написание' },
  { alias: 'головкова', canonical: 'бейбітшілік', note: 'Улица, на которой находится главный архив' },
  { alias: 'мира', canonical: 'головкова', note: '«Ул. Мира (ныне Головкова)» в подписях фото 1960-х' },
];

const aliasMap = new Map(PLACE_ALIASES.map((entry) => [entry.alias, entry]));

/** Возвращает все варианты названия, связанные с указанным местом (в обе стороны). */
export function placeVariants(place: string): string[] {
  const normalized = place.toLocaleLowerCase('ru').replace(/ё/g, 'е').trim();
  const variants = new Set([normalized]);
  const direct = aliasMap.get(normalized);
  if (direct) variants.add(direct.canonical);
  for (const entry of PLACE_ALIASES) {
    if (entry.canonical === normalized || (direct && entry.canonical === direct.canonical)) variants.add(entry.alias);
  }
  return [...variants];
}

/** Находит в тексте известное историческое название и объясняет связь. */
export function explainPlaceAlias(text: string): PlaceAlias | null {
  const normalized = text.toLocaleLowerCase('ru');
  return PLACE_ALIASES.find((entry) => entry.alias.length > 4 && normalized.includes(entry.alias)) ?? null;
}
