# Словарь данных — проект v0.1

Сгенерирован из `tools/docs/build_model.py`. Не является готовой миграцией.

`id` — PK; обязательность и внешние ключи указаны явно. Все связи по умолчанию RESTRICT при удалении. Политики см. [constraints.md](constraints.md).

## resources

Единая идентичность публикуемого материала

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `kind` | `text` | да | — | — |
| `owner_branch_id` | `uuid` | нет | branches.id | — |
| `visibility` | `text` | да | — | internal, public_metadata |
| `access_version` | `bigint` | да | — | Меняется при отзыве доступа |
| `created_at` | `timestamptz` | да | — | — |
| `updated_at` | `timestamptz` | да | — | — |
| `withdrawn_at` | `timestamptz` | нет | — | — |

Не содержит произвольных бизнес-полей. Один соответствующий типу подтип. Права не определяются одним наличием URL.

## resource_versions

Неизменяемые редакции текста и снимка публикуемых данных

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `resource_id` | `uuid` | да | resources.id | — |
| `locale` | `text` | да | — | kk, ru, en |
| `version_no` | `integer` | да | — | — |
| `title` | `text` | да | — | — |
| `summary` | `text` | нет | — | — |
| `body` | `text` | нет | — | — |
| `seo_title` | `text` | нет | — | — |
| `meta_description` | `text` | нет | — | — |
| `public_snapshot` | `jsonb` | да | — | Проверенный снимок метаданных и связей для публичной выдачи; схема по kind |
| `workflow_status` | `text` | да | — | draft, in_review, changes_requested, approved, published, archived |
| `translation_origin` | `text` | да | — | human, machine_draft, reviewed_machine |
| `created_by` | `uuid` | да | users.id | — |
| `created_at` | `timestamptz` | да | — | — |
| `content_hash` | `text` | да | — | — |

Уникальность: `resource_id, locale, version_no`; `resource_id, locale, id`.

## resource_publications

Текущая одобренная редакция каждого языка

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `resource_id` | `uuid` | да | resources.id | — |
| `locale` | `text` | да | — | — |
| `revision_id` | `uuid` | да | resource_versions.id | — |
| `published_by` | `uuid` | да | users.id | — |
| `published_at` | `timestamptz` | да | — | — |

Уникальность: `resource_id, locale`.

Составной FK ниже гарантирует соответствие revision, resource и locale. Снятие публикации удаляет указатель, не историю.

## resource_routes

Канонические языковые адреса

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `resource_id` | `uuid` | да | resources.id | — |
| `locale` | `text` | да | — | — |
| `path` | `text` | да | — | Относительный путь сайта, без внешнего домена |

Уникальность: `locale, path`; `resource_id, locale`.

## branches

Главный архив и филиалы

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `code` | `text` | да | — | — |
| `branch_type` | `text` | да | — | — |
| `latitude` | `decimal(9,6)` | нет | — | — |
| `longitude` | `decimal(9,6)` | нет | — | — |
| `address` | `text` | нет | — | — |
| `show_on_map` | `boolean` | да | — | — |

Уникальность: `code`.

Официальное название и переводы — в resource_versions. Адрес в публичном снимке также переводится.

## branch_contacts

Публичные контакты и назначение контакта

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `branch_id` | `uuid` | да | branches.id | — |
| `kind` | `text` | да | — | phone, email, website, social |
| `value` | `text` | да | — | — |
| `purpose` | `text` | нет | — | — |
| `sort_order` | `integer` | да | — | — |

## branch_hours

Регулярные часы и исключения

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `branch_id` | `uuid` | да | branches.id | — |
| `weekday` | `integer` | нет | — | — |
| `specific_date` | `date` | нет | — | — |
| `opens_at` | `time` | нет | — | — |
| `closes_at` | `time` | нет | — | — |
| `closed` | `boolean` | да | — | — |
| `timezone` | `text` | да | — | — |

Ровно один из weekday или specific_date; часы проверяются с учётом closed.

## funds

Архивный фонд

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `branch_id` | `uuid` | да | branches.id | — |
| `number` | `text` | да | — | — |
| `date_label` | `text` | нет | — | Датировка в источнике без исправления |
| `date_from` | `date` | нет | — | — |
| `date_to` | `date` | нет | — | — |
| `date_precision` | `text` | да | — | unknown, day, month, year, range, approximate |
| `storage_units_label` | `text` | нет | — | Сохраняет исходные значения вроде 3618/34с |
| `provenance_note` | `text` | нет | — | — |

Уникальность: `branch_id, number`.

## fund_names

Исторические названия одного фонда

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `fund_id` | `uuid` | да | funds.id | — |
| `locale` | `text` | да | — | — |
| `name` | `text` | да | — | — |
| `date_label` | `text` | нет | — | Датировка в источнике без исправления |
| `date_from` | `date` | нет | — | — |
| `date_to` | `date` | нет | — | — |
| `date_precision` | `text` | да | — | unknown, day, month, year, range, approximate |
| `source_record_id` | `uuid` | нет | source_records.id | — |

## inventories

Опись внутри фонда

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `fund_id` | `uuid` | да | funds.id | — |
| `number` | `text` | да | — | — |
| `date_label` | `text` | нет | — | Датировка в источнике без исправления |
| `date_from` | `date` | нет | — | — |
| `date_to` | `date` | нет | — | — |
| `date_precision` | `text` | да | — | unknown, day, month, year, range, approximate |

Уникальность: `fund_id, number`.

## archive_cases

Архивное дело внутри описи

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `inventory_id` | `uuid` | да | inventories.id | — |
| `number` | `text` | да | — | — |
| `date_label` | `text` | нет | — | Датировка в источнике без исправления |
| `date_from` | `date` | нет | — | — |
| `date_to` | `date` | нет | — | — |
| `date_precision` | `text` | да | — | unknown, day, month, year, range, approximate |
| `leaf_count` | `integer` | нет | — | — |

Уникальность: `inventory_id, number`.

## documents

Каталожное описание документа

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `case_id` | `uuid` | да | archive_cases.id | — |
| `local_identifier` | `text` | нет | — | — |
| `reference_as_source` | `text` | нет | — | — |
| `document_type` | `text` | да | — | — |
| `original_language` | `text` | нет | — | — |
| `date_label` | `text` | нет | — | Датировка в источнике без исправления |
| `date_from` | `date` | нет | — | — |
| `date_to` | `date` | нет | — | — |
| `date_precision` | `text` | да | — | unknown, day, month, year, range, approximate |
| `leaf_count` | `integer` | нет | — | — |
| `access_status` | `text` | да | — | open, metadata_only, restricted, unknown |
| `access_note` | `text` | нет | — | — |

Нет выдуманных родителей. Неполные импортные записи остаются в import_rows. Историческая публикация без дела может быть page/collection item с источником.

## files

Файл в защищённом хранилище

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `storage_key` | `text` | да | — | — |
| `original_name` | `text` | да | — | — |
| `mime_type` | `text` | да | — | — |
| `byte_size` | `bigint` | да | — | — |
| `sha256` | `text` | да | — | — |
| `scan_status` | `text` | да | — | quarantine, clean, rejected |
| `access_status` | `text` | да | — | private, public_preview, public_download |
| `rights_basis` | `text` | нет | — | — |
| `uploaded_by` | `uuid` | да | users.id | — |
| `created_at` | `timestamptz` | да | — | — |

Уникальность: `storage_key`.

SHA индексируется для поиска дублей, но совпадение байтов не объединяет права разных загрузок.

## file_derivatives

Превью и облегчённые копии

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `original_file_id` | `uuid` | да | files.id | — |
| `derived_file_id` | `uuid` | да | files.id | — |
| `purpose` | `text` | да | — | — |
| `processor_version` | `text` | да | — | — |

Уникальность: `original_file_id, derived_file_id`.

## resource_files

Файлы публикаций и документов

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `resource_id` | `uuid` | да | resources.id | — |
| `file_id` | `uuid` | да | files.id | — |
| `purpose` | `text` | да | — | — |
| `sort_order` | `integer` | да | — | — |
| `caption` | `text` | нет | — | — |

Уникальность: `resource_id, file_id, purpose`.

## document_pages

Страницы просмотрщика и точные ссылки на листы

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `document_id` | `uuid` | да | documents.id | — |
| `file_id` | `uuid` | да | files.id | — |
| `sequence_no` | `integer` | да | — | — |
| `file_page_no` | `integer` | да | — | — |
| `leaf_label` | `text` | нет | — | — |

Уникальность: `document_id, sequence_no`.

## ocr_versions

Распознанный текст страницы и проверка сотрудником

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `page_id` | `uuid` | да | document_pages.id | — |
| `version_no` | `integer` | да | — | — |
| `text` | `text` | да | — | — |
| `language` | `text` | нет | — | — |
| `engine_version` | `text` | да | — | — |
| `status` | `text` | да | — | draft, reviewed, rejected |
| `reviewed_by` | `uuid` | нет | users.id | — |
| `reviewed_at` | `timestamptz` | нет | — | — |

Уникальность: `page_id, version_no`.

## pages

Информационные страницы, отчёты, инструкции и публикации

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `page_type` | `text` | да | — | about, history, structure, staff, regulation, report, guide, publication, privacy |
| `parent_id` | `uuid` | нет | pages.id | — |
| `sort_order` | `integer` | да | — | — |

## news

Новости и мероприятия учреждения

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `news_type` | `text` | да | — | news, announcement |
| `event_starts_at` | `timestamptz` | нет | — | — |
| `event_ends_at` | `timestamptz` | нет | — | — |

## faq_items

Проверенные справочные ответы

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `sort_order` | `integer` | да | — | — |

В resource_versions title = вопрос, body = ответ.

## collections

Тематические коллекции

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `collection_type` | `text` | да | — | history, photo_album, education |

## collection_items

Состав и порядок коллекции

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `collection_id` | `uuid` | да | collections.id | — |
| `resource_id` | `uuid` | да | resources.id | — |
| `position` | `integer` | да | — | — |

Уникальность: `collection_id, resource_id`; `collection_id, position`.

## exhibitions

Онлайн-выставки

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `starts_on` | `date` | нет | — | — |
| `ends_on` | `date` | нет | — | — |

## exhibition_items

Экспонаты с собственной переводимой подписью

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `exhibition_id` | `uuid` | да | exhibitions.id | — |
| `source_resource_id` | `uuid` | да | resources.id | — |
| `position` | `integer` | да | — | — |

Уникальность: `exhibition_id, position`.

## people

Исторические личности

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `name_as_source` | `text` | да | — | — |
| `birth_label` | `text` | нет | — | — |
| `death_label` | `text` | нет | — | — |

## organizations

Организации и авторы фондов

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `name_as_source` | `text` | да | — | — |
| `date_label` | `text` | нет | — | Датировка в источнике без исправления |
| `date_from` | `date` | нет | — | — |
| `date_to` | `date` | нет | — | — |
| `date_precision` | `text` | да | — | unknown, day, month, year, range, approximate |

## places

Населённые пункты и исторические объекты

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `place_type` | `text` | да | — | — |
| `parent_id` | `uuid` | нет | places.id | — |
| `latitude` | `decimal(9,6)` | нет | — | — |
| `longitude` | `decimal(9,6)` | нет | — | — |

## place_names

Языковые и исторические варианты топонимов

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `place_id` | `uuid` | да | places.id | — |
| `locale` | `text` | да | — | — |
| `name` | `text` | да | — | — |
| `date_label` | `text` | нет | — | Датировка в источнике без исправления |
| `date_from` | `date` | нет | — | — |
| `date_to` | `date` | нет | — | — |
| `date_precision` | `text` | да | — | unknown, day, month, year, range, approximate |
| `source_record_id` | `uuid` | нет | source_records.id | — |

## historical_events

Исторические события, отличные от анонсов учреждения

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `date_label` | `text` | нет | — | Датировка в источнике без исправления |
| `date_from` | `date` | нет | — | — |
| `date_to` | `date` | нет | — | — |
| `date_precision` | `text` | да | — | unknown, day, month, year, range, approximate |

## resource_people

Личности и их роль в материале

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `resource_id` | `uuid` | да | resources.id | — |
| `person_id` | `uuid` | да | people.id | — |
| `relation_role` | `text` | да | — | — |

Уникальность: `resource_id, person_id, relation_role`.

## resource_organizations

Организации и их роль в материале

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `resource_id` | `uuid` | да | resources.id | — |
| `organization_id` | `uuid` | да | organizations.id | — |
| `relation_role` | `text` | да | — | — |

Уникальность: `resource_id, organization_id, relation_role`.

## resource_places

Географические связи

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `resource_id` | `uuid` | да | resources.id | — |
| `place_id` | `uuid` | да | places.id | — |
| `relation_role` | `text` | да | — | — |

Уникальность: `resource_id, place_id, relation_role`.

## resource_events

Связь с историческими событиями

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `resource_id` | `uuid` | да | resources.id | — |
| `event_id` | `uuid` | да | historical_events.id | — |
| `relation_role` | `text` | да | — | — |

Уникальность: `resource_id, event_id, relation_role`.

## categories

Темы, категории и теги

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `taxonomy_kind` | `text` | да | — | category, tag |
| `parent_id` | `uuid` | нет | categories.id | — |

## resource_categories

Тематика материалов

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `resource_id` | `uuid` | да | resources.id | — |
| `category_id` | `uuid` | да | categories.id | — |

Уникальность: `resource_id, category_id`.

## periodical_titles

Названия газет и другой периодики

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `name_as_source` | `text` | да | — | — |
| `publisher_label` | `text` | нет | — | — |
| `publication_place_id` | `uuid` | нет | places.id | — |

## periodical_holdings

Сведения о наличии периодики из исходных перечней

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | resources.id | PK и FK; тип должен совпадать с resources.kind |
| `periodical_id` | `uuid` | да | periodical_titles.id | — |
| `branch_id` | `uuid` | нет | branches.id | — |
| `date_label` | `text` | нет | — | Датировка в источнике без исправления |
| `date_from` | `date` | нет | — | — |
| `date_to` | `date` | нет | — | — |
| `date_precision` | `text` | да | — | unknown, day, month, year, range, approximate |
| `volume_count_label` | `text` | нет | — | — |
| `holdings_note` | `text` | нет | — | — |

Наличие выпуска не означает наличие скана; неизвестный филиал требует проверки до публикации.

## site_links

Официальные внешние ссылки

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `locale` | `text` | да | — | — |
| `label` | `text` | да | — | — |
| `url` | `text` | да | — | — |
| `placement` | `text` | да | — | footer, social, government |
| `sort_order` | `integer` | да | — | — |
| `enabled` | `boolean` | да | — | — |

## navigation_items

Редактируемое меню сайта

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `locale` | `text` | да | — | — |
| `label` | `text` | да | — | — |
| `parent_id` | `uuid` | нет | navigation_items.id | — |
| `resource_id` | `uuid` | нет | resources.id | — |
| `internal_path` | `text` | нет | — | — |
| `position` | `integer` | да | — | — |

XOR resource_id/internal_path. Внутренние пути проверяются по реестру маршрутов.

## users

Учётные записи сотрудников; посетителю учётная запись не обязательна

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `email` | `text` | да | — | — |
| `password_hash` | `text` | да | — | — |
| `display_name` | `text` | да | — | — |
| `is_active` | `boolean` | да | — | — |
| `created_at` | `timestamptz` | да | — | — |

Уникальность: `email`.

## roles

Семь начальных ролей ТЗ

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `code` | `text` | да | — | — |
| `name` | `text` | да | — | — |

Уникальность: `code`.

## permissions

Действия над модулями

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `code` | `text` | да | — | — |

Уникальность: `code`.

## role_permissions

Полномочия роли

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `role_id` | `uuid` | да | roles.id | — |
| `permission_id` | `uuid` | да | permissions.id | — |

Уникальность: `role_id, permission_id`.

## user_role_assignments

Роль сотрудника и область доступа

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `user_id` | `uuid` | да | users.id | — |
| `role_id` | `uuid` | да | roles.id | — |
| `branch_id` | `uuid` | нет | branches.id | — |
| `scope` | `text` | да | — | global, branch |

CHECK scope/branch_id. Два partial unique индекса исключают дубли global/branch.

## moderation_actions

Решения проверяющих

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `revision_id` | `uuid` | да | resource_versions.id | — |
| `actor_id` | `uuid` | да | users.id | — |
| `action` | `text` | да | — | — |
| `comment` | `text` | нет | — | — |
| `created_at` | `timestamptz` | да | — | — |

## audit_logs

Неизменяемый журнал действий сотрудников

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `actor_id` | `uuid` | нет | users.id | — |
| `resource_id` | `uuid` | нет | resources.id | — |
| `action` | `text` | да | — | — |
| `target_reference` | `text` | нет | — | — |
| `safe_change_summary` | `jsonb` | да | — | — |
| `created_at` | `timestamptz` | да | — | — |

Без паролей, токенов и полного текста вопросов. Не является копией всей БД.

## feedback

Отзывы, предложения и пожелания

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `kind` | `text` | да | — | review, suggestion, wish |
| `body` | `text` | да | — | — |
| `reply_contact` | `text` | нет | — | — |
| `status` | `text` | да | — | new, reviewed, hidden, published |
| `created_at` | `timestamptz` | да | — | — |
| `moderated_by` | `uuid` | нет | users.id | — |
| `expires_at` | `timestamptz` | нет | — | — |

Контакты не публикуются. Нет регистрационных номеров обращений и обещаний услуги.

## source_records

Происхождение материалов

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `source_namespace` | `text` | да | — | — |
| `source_key` | `text` | да | — | — |
| `source_url` | `text` | нет | — | — |
| `local_path` | `text` | нет | — | — |
| `sha256` | `text` | нет | — | — |
| `fetched_at` | `timestamptz` | нет | — | — |
| `source_status` | `text` | да | — | — |
| `locator` | `text` | нет | — | — |

Уникальность: `source_namespace, source_key`.

locator = лист/строка/страница оригинала; URL не является лицензией на публикацию.

## resource_sources

Несколько источников одного материала

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `resource_id` | `uuid` | да | resources.id | — |
| `source_record_id` | `uuid` | да | source_records.id | — |
| `relation_role` | `text` | да | — | — |

Уникальность: `resource_id, source_record_id, relation_role`.

## import_batches

Пакет импорта с версиями правил

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `input_source_id` | `uuid` | да | source_records.id | — |
| `mapping_version` | `text` | да | — | — |
| `started_by` | `uuid` | да | users.id | — |
| `status` | `text` | да | — | — |
| `started_at` | `timestamptz` | да | — | — |
| `finished_at` | `timestamptz` | нет | — | — |
| `summary` | `jsonb` | да | — | — |

## import_rows

Исходные и неподтверждённые данные

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `batch_id` | `uuid` | да | import_batches.id | — |
| `source_key` | `text` | да | — | — |
| `row_locator` | `text` | да | — | — |
| `raw_payload` | `jsonb` | да | — | — |
| `proposed_payload` | `jsonb` | нет | — | — |
| `errors` | `jsonb` | да | — | — |
| `status` | `text` | да | — | pending, valid, needs_review, rejected, imported |
| `resource_id` | `uuid` | нет | resources.id | — |

Уникальность: `batch_id, row_locator`.

## legacy_redirects

Переходы со старых страниц

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `old_url` | `text` | да | — | — |
| `resource_id` | `uuid` | да | resources.id | — |
| `locale` | `text` | да | — | — |

Уникальность: `old_url`.

## search_chunks

Перестраиваемые фрагменты разрешённых источников

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `revision_id` | `uuid` | да | resource_versions.id | — |
| `ocr_version_id` | `uuid` | нет | ocr_versions.id | — |
| `chunk_no` | `integer` | да | — | — |
| `language` | `text` | да | — | — |
| `text` | `text` | да | — | — |
| `text_hash` | `text` | да | — | — |
| `locator` | `text` | нет | — | — |
| `pipeline_version` | `text` | да | — | — |
| `created_at` | `timestamptz` | да | — | — |

Уникальность: `revision_id, pipeline_version, chunk_no`.

## embedding_models

Версии моделей смыслового поиска

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `model_key` | `text` | да | — | — |
| `dimensions` | `integer` | да | — | — |
| `revision` | `text` | да | — | — |
| `active` | `boolean` | да | — | — |

Уникальность: `model_key, revision`.

## chunk_embeddings

Векторные представления фрагментов

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `chunk_id` | `uuid` | да | search_chunks.id | — |
| `model_id` | `uuid` | да | embedding_models.id | — |
| `embedding` | `vector` | да | — | — |

Уникальность: `chunk_id, model_id`.

vector без размерности — логический placeholder. В миграции отдельный согласованный размер и индекс для выбранной модели.

## chat_sessions

Анонимные сессии с ограниченным хранением

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `token_hash` | `text` | да | — | — |
| `locale` | `text` | да | — | — |
| `created_at` | `timestamptz` | да | — | — |
| `expires_at` | `timestamptz` | да | — | — |

Уникальность: `token_hash`.

## chat_messages

Сообщения разговора

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `session_id` | `uuid` | да | chat_sessions.id | — |
| `sequence_no` | `integer` | да | — | — |
| `role` | `text` | да | — | user, assistant |
| `body` | `text` | да | — | — |
| `status` | `text` | да | — | pending, completed, failed |
| `model_revision` | `text` | нет | — | — |
| `created_at` | `timestamptz` | да | — | — |

Уникальность: `session_id, sequence_no`.

## message_citations

Проверяемые источники ответа

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `message_id` | `uuid` | да | chat_messages.id | — |
| `revision_id` | `uuid` | да | resource_versions.id | — |
| `chunk_id` | `uuid` | нет | search_chunks.id | — |
| `source_text_hash` | `text` | да | — | — |
| `locator` | `text` | нет | — | — |
| `position` | `integer` | да | — | — |

Уникальность: `message_id, position`.

Если chunk задан, он принадлежит указанной revision. Источник при открытии снова проходит проверку доступа.

## answer_feedback

Оценка полезности ответа

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `message_id` | `uuid` | да | chat_messages.id | — |
| `rating` | `smallint` | да | — | — |
| `reason_code` | `text` | нет | — | — |
| `created_at` | `timestamptz` | да | — | — |

Уникальность: `message_id`.

Оценивать может только владелец сессии; rating -1 или 1.

## search_events

Минимальная обезличенная аналитика

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `locale` | `text` | да | — | — |
| `intent_code` | `text` | нет | — | — |
| `query_redacted` | `text` | нет | — | — |
| `result_count` | `integer` | да | — | — |
| `clicked_resource_id` | `uuid` | нет | resources.id | — |
| `latency_ms` | `integer` | да | — | — |
| `occurred_at` | `timestamptz` | да | — | — |

Не сохраняет IP, контакты, идентификатор сессии или сырые вопросы по умолчанию.

## index_jobs

Надёжное обновление поискового индекса

| Поле | Тип | Обязательно | Связь | Назначение |
|---|---|---|---|---|
| `id` | `uuid` | да | — | Постоянный идентификатор; PK |
| `resource_id` | `uuid` | да | resources.id | — |
| `requested_version` | `bigint` | да | — | — |
| `status` | `text` | да | — | — |
| `attempts` | `integer` | да | — | — |
| `available_at` | `timestamptz` | да | — | — |
| `last_error_code` | `text` | нет | — | — |

Публикация и запись задания — одна транзакция. Ошибка индекса не открывает старый закрытый контент.
