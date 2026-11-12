/** Нормализация текста для поиска на русском и казахском. */

export function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase('ru')
    .replace(/ё/g, 'е')
    .replace(/[«»"“”„'`]/g, ' ')
    .replace(/[\s.,;:!?()[\]{}–—-]+/g, ' ')
    .trim();
}

// В PostgreSQL нет казахского словаря. Лёгкий стеммер срезает частые падежные
// и множественные окончания, чтобы «мұрағаттың», «мұрағатта» сводились к «мұрағат».
// Это сознательное упрощение: точность ниже морфологического анализатора.
const KAZAKH_SUFFIXES = [
  'лардың', 'лердің', 'дардың', 'дердің', 'тардың', 'тердің',
  'ларда', 'лерде', 'дарда', 'дерде', 'тарда', 'терде',
  'ларға', 'лерге', 'дарға', 'дерге', 'тарға', 'терге',
  'лары', 'лері', 'дары', 'дері', 'тары', 'тері',
  'ның', 'нің', 'дың', 'дің', 'тың', 'тің',
  'лар', 'лер', 'дар', 'дер', 'тар', 'тер',
  'ға', 'ге', 'қа', 'ке', 'да', 'де', 'та', 'те', 'нан', 'нен', 'дан', 'ден', 'тан', 'тен',
  'ны', 'ні', 'ды', 'ді', 'ты', 'ті',
];

const KAZAKH_LETTERS = /[әғқңөұүһі]/;

export function stemKazakhWord(word: string): string {
  if (!KAZAKH_LETTERS.test(word) || word.length < 5) return word;
  for (const suffix of KAZAKH_SUFFIXES) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 3) return word.slice(0, -suffix.length);
  }
  return word;
}

/** Слова запроса для полнотекстового поиска: без стоп-слов, со стеммингом казахского. */
const STOP_WORDS = new Set([
  'и', 'в', 'во', 'на', 'по', 'о', 'об', 'с', 'со', 'к', 'у', 'за', 'из', 'для', 'от', 'до', 'как', 'что', 'где', 'это',
  'хочу', 'найти', 'покажи', 'покажите', 'показать', 'найди', 'найдите', 'нужно', 'нужна', 'нужен', 'есть', 'ли', 'мне', 'я', 'мой', 'моего', 'моей', 'какие', 'какой', 'годов', 'годах', 'году', 'год', 'гг',
  'the', 'a', 'an', 'of', 'in', 'on', 'for', 'to', 'and', 'is', 'are', 'find', 'i', 'want', 'where',
  'және', 'мен', 'бен', 'пен', 'бар', 'ма', 'ме', 'қайда', 'керек', 'табу',
]);

export function queryTerms(value: string): string[] {
  return normalizeText(value)
    .split(' ')
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word))
    .map(stemKazakhWord);
}

/** Безопасное выражение для to_tsquery: только буквы и цифры, префиксный поиск. */
export function toPrefixTsQuery(terms: string[]): string | null {
  const safe = terms
    .map((term) => term.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter((term) => term.length > 1)
    .slice(0, 8);
  return safe.length ? safe.map((term) => `${term}:*`).join(' | ') : null;
}
