-- Физическая схема MVP. Это подмножество логической модели v0.1 (docs/database):
-- одна таблица resources для иерархии каталога и публикаций, остальные — служебные.
-- Расширения: pgvector (смысловой поиск), pg_trgm (похожее написание, старые названия).
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS branches (
  id            text PRIMARY KEY,
  kind          text NOT NULL CHECK (kind IN ('main', 'branch')),
  name_ru       text NOT NULL,
  name_kk       text,
  name_en       text,
  address       text NOT NULL,
  locality      text,
  phone         text,
  email         text,
  hours         text,
  lat           double precision,
  lng           double precision,
  coords_precision text CHECK (coords_precision IN ('building', 'street', 'town')),
  coords_source text,
  show_on_map   boolean NOT NULL DEFAULT true,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Ресурс: фонд, опись, дело, документ, фото, газета, страница, новость, событие, личность.
-- status — состояние модерации (ТЗ 6.7). Публичное API видит только status = 'published'.
CREATE TABLE IF NOT EXISTS resources (
  id            text PRIMARY KEY,
  kind          text NOT NULL CHECK (kind IN ('fund','inventory','case','document','photo','newspaper','page','news','event','person')),
  parent_id     text REFERENCES resources(id) ON DELETE RESTRICT,
  branch_id     text REFERENCES branches(id),
  title         text NOT NULL,
  title_kk      text,
  title_en      text,
  reference     text,
  fund_no       text,
  inventory_no  text,
  case_no       text,
  year_from     integer,
  year_to       integer,
  period_label  text,
  doc_type      text,
  language      text,
  sheets        integer,
  description   text,
  history_note  text,
  place         text,
  author_org    text,
  topics        text[] NOT NULL DEFAULT '{}',
  access        text NOT NULL DEFAULT 'open' CHECK (access IN ('open','restricted','metadata_only')),
  copy_status   text NOT NULL DEFAULT 'unknown' CHECK (copy_status IN ('available','none','unknown','restricted')),
  file_key      text,
  image_url     text,
  source_label  text,
  source_url    text,
  is_demo       boolean NOT NULL DEFAULT false,
  status        text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','needs_changes','approved','published','archived')),
  published_at  timestamptz,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  created_by    text,
  CHECK (year_from IS NULL OR year_to IS NULL OR year_from <= year_to)
);
CREATE INDEX IF NOT EXISTS resources_kind_status ON resources(kind, status);
CREATE INDEX IF NOT EXISTS resources_parent ON resources(parent_id);
CREATE INDEX IF NOT EXISTS resources_fund_no ON resources(lower(fund_no));

-- История названий фондообразователя (одна строка на период названия).
CREATE TABLE IF NOT EXISTS fund_names (
  fund_id       text NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  ord           integer NOT NULL,
  name          text NOT NULL,
  period_label  text,
  PRIMARY KEY (fund_id, ord)
);

-- Производный поисковый индекс: перестраивается из опубликованных ресурсов.
CREATE TABLE IF NOT EXISTS search_chunks (
  id            text PRIMARY KEY,
  resource_id   text NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  text          text NOT NULL,
  tsv           tsvector,
  embedding     vector(256)
);
CREATE INDEX IF NOT EXISTS search_chunks_resource ON search_chunks(resource_id);

-- Справочник исторических и вариантных названий мест.
CREATE TABLE IF NOT EXISTS place_aliases (
  alias         text PRIMARY KEY,
  canonical     text NOT NULL,
  note          text
);

CREATE TABLE IF NOT EXISTS users (
  id            text PRIMARY KEY,
  email         text NOT NULL UNIQUE,
  name          text NOT NULL,
  role          text NOT NULL,
  branch_id     text REFERENCES branches(id),
  password_hash text NOT NULL,
  is_active     boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS audit_log (
  id            bigserial PRIMARY KEY,
  at            timestamptz NOT NULL DEFAULT now(),
  user_id       text,
  action        text NOT NULL,
  entity        text,
  entity_id     text,
  details       jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS moderation_events (
  id            bigserial PRIMARY KEY,
  resource_id   text NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  from_status   text NOT NULL,
  to_status     text NOT NULL,
  user_id       text NOT NULL,
  note          text,
  at            timestamptz NOT NULL DEFAULT now()
);

-- Отзывы и предложения о сайте. Это не официальные обращения (ТЗ 5.4).
CREATE TABLE IF NOT EXISTS feedback (
  id            text PRIMARY KEY,
  kind          text NOT NULL CHECK (kind IN ('review','suggestion','error','wish')),
  message       text NOT NULL,
  status        text NOT NULL DEFAULT 'new' CHECK (status IN ('new','approved','rejected')),
  moderator_note text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Обезличенные события для ИИ-аналитики (ТЗ 5.8 Д). Текст вопроса хранится после маскирования ПДн.
CREATE TABLE IF NOT EXISTS search_events (
  id            bigserial PRIMARY KEY,
  at            timestamptz NOT NULL DEFAULT now(),
  channel       text NOT NULL CHECK (channel IN ('chat','catalog')),
  message_id    text,
  session_hash  text,
  locale        text,
  query         text,
  status        text NOT NULL,
  results       integer NOT NULL DEFAULT 0,
  latency_ms    integer,
  rating        smallint
);

CREATE TABLE IF NOT EXISTS import_batches (
  id            text PRIMARY KEY,
  at            timestamptz NOT NULL DEFAULT now(),
  user_id       text NOT NULL,
  file_name     text NOT NULL,
  accepted      integer NOT NULL DEFAULT 0,
  rejected      integer NOT NULL DEFAULT 0,
  report        jsonb NOT NULL DEFAULT '[]'
);
