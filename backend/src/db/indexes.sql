-- Индексы полнотекстового и похожего поиска. Для PostgreSQL в продакшене.
-- Во встроенном PGlite (демо, ~10 тыс. фрагментов) не создаются: последовательный просмотр быстрее, чем построение GIN при каждом холодном старте.
CREATE INDEX IF NOT EXISTS resources_title_trgm ON resources USING gin (lower(title) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS fund_names_trgm ON fund_names USING gin (lower(name) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS search_chunks_tsv ON search_chunks USING gin (tsv);
