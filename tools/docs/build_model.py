"""Generate the proposed logical model, dictionary and ER diagrams. No DB writes."""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs/database"
TABLES = {}


def table(name, purpose, fields, unique=(), note=""):
    """Fields: name, type, required, optional FK target, description; id is PK."""
    TABLES[name] = dict(purpose=purpose, fields=fields, unique=list(unique), note=note)


def f(name, kind="text", required=True, ref=None, note=""):
    return dict(name=name, type=kind, required=required, ref=ref, note=note)


def pk():
    return f("id", "uuid", note="Постоянный идентификатор; PK")


def rid():
    return f("id", "uuid", ref="resources.id", note="PK и FK; тип должен совпадать с resources.kind")


def dates():
    return [f("date_label", required=False, note="Датировка в источнике без исправления"),
            f("date_from", "date", False), f("date_to", "date", False),
            f("date_precision", note="unknown, day, month, year, range, approximate")]


table("resources", "Единая идентичность публикуемого материала", [pk(), f("kind"),
      f("owner_branch_id", "uuid", False, "branches.id"), f("visibility", note="internal, public_metadata"),
      f("access_version", "bigint", note="Меняется при отзыве доступа"), f("created_at", "timestamptz"),
      f("updated_at", "timestamptz"), f("withdrawn_at", "timestamptz", False)],
      note="Не содержит произвольных бизнес-полей. Один соответствующий типу подтип. Права не определяются одним наличием URL.")
table("resource_versions", "Неизменяемые редакции текста и снимка публикуемых данных", [pk(),
      f("resource_id", "uuid", ref="resources.id"), f("locale", note="kk, ru, en"), f("version_no", "integer"),
      f("title"), f("summary", required=False), f("body", required=False),
      f("seo_title", required=False), f("meta_description", required=False),
      f("public_snapshot", "jsonb", note="Проверенный снимок метаданных и связей для публичной выдачи; схема по kind"),
      f("workflow_status", note="draft, in_review, changes_requested, approved, published, archived"),
      f("translation_origin", note="human, machine_draft, reviewed_machine"),
      f("created_by", "uuid", ref="users.id"), f("created_at", "timestamptz"), f("content_hash")],
      unique=[("resource_id", "locale", "version_no"), ("resource_id", "locale", "id")])
table("resource_publications", "Текущая одобренная редакция каждого языка", [pk(),
      f("resource_id", "uuid", ref="resources.id"), f("locale"), f("revision_id", "uuid", ref="resource_versions.id"),
      f("published_by", "uuid", ref="users.id"), f("published_at", "timestamptz")],
      unique=[("resource_id", "locale")], note="Составной FK ниже гарантирует соответствие revision, resource и locale. Снятие публикации удаляет указатель, не историю.")
table("resource_routes", "Канонические языковые адреса", [pk(), f("resource_id", "uuid", ref="resources.id"),
      f("locale"), f("path", note="Относительный путь сайта, без внешнего домена")],
      unique=[("locale", "path"), ("resource_id", "locale")])
table("branches", "Главный архив и филиалы", [rid(), f("code"), f("branch_type"),
      f("latitude", "decimal(9,6)", False), f("longitude", "decimal(9,6)", False),
      f("address", required=False), f("show_on_map", "boolean")], unique=[("code",)],
      note="Официальное название и переводы — в resource_versions. Адрес в публичном снимке также переводится.")
table("branch_contacts", "Публичные контакты и назначение контакта", [pk(), f("branch_id", "uuid", ref="branches.id"),
      f("kind", note="phone, email, website, social"), f("value"), f("purpose", required=False), f("sort_order", "integer")])
table("branch_hours", "Регулярные часы и исключения", [pk(), f("branch_id", "uuid", ref="branches.id"),
      f("weekday", "integer", False), f("specific_date", "date", False), f("opens_at", "time", False),
      f("closes_at", "time", False), f("closed", "boolean"), f("timezone")],
      note="Ровно один из weekday или specific_date; часы проверяются с учётом closed.")
table("funds", "Архивный фонд", [rid(), f("branch_id", "uuid", ref="branches.id"), f("number"), *dates(),
      f("storage_units_label", required=False, note="Сохраняет исходные значения вроде 3618/34с"),
      f("provenance_note", required=False)], unique=[("branch_id", "number")])
table("fund_names", "Исторические названия одного фонда", [pk(), f("fund_id", "uuid", ref="funds.id"),
      f("locale"), f("name"), *dates(), f("source_record_id", "uuid", False, "source_records.id")])
table("inventories", "Опись внутри фонда", [rid(), f("fund_id", "uuid", ref="funds.id"), f("number"), *dates()],
      unique=[("fund_id", "number")])
table("archive_cases", "Архивное дело внутри описи", [rid(), f("inventory_id", "uuid", ref="inventories.id"),
      f("number"), *dates(), f("leaf_count", "integer", False)], unique=[("inventory_id", "number")])
table("documents", "Каталожное описание документа", [rid(), f("case_id", "uuid", ref="archive_cases.id"),
      f("local_identifier", required=False), f("reference_as_source", required=False), f("document_type"),
      f("original_language", required=False), *dates(), f("leaf_count", "integer", False),
      f("access_status", note="open, metadata_only, restricted, unknown"), f("access_note", required=False)],
      note="Нет выдуманных родителей. Неполные импортные записи остаются в import_rows. Историческая публикация без дела может быть page/collection item с источником.")
table("files", "Файл в защищённом хранилище", [pk(), f("storage_key"), f("original_name"), f("mime_type"),
      f("byte_size", "bigint"), f("sha256"), f("scan_status", note="quarantine, clean, rejected"),
      f("access_status", note="private, public_preview, public_download"),
      f("rights_basis", required=False), f("uploaded_by", "uuid", ref="users.id"), f("created_at", "timestamptz")],
      unique=[("storage_key",)], note="SHA индексируется для поиска дублей, но совпадение байтов не объединяет права разных загрузок.")
table("file_derivatives", "Превью и облегчённые копии", [pk(), f("original_file_id", "uuid", ref="files.id"),
      f("derived_file_id", "uuid", ref="files.id"), f("purpose"), f("processor_version")],
      unique=[("original_file_id", "derived_file_id")])
table("resource_files", "Файлы публикаций и документов", [pk(), f("resource_id", "uuid", ref="resources.id"),
      f("file_id", "uuid", ref="files.id"), f("purpose"), f("sort_order", "integer"), f("caption", required=False)],
      unique=[("resource_id", "file_id", "purpose")])
table("document_pages", "Страницы просмотрщика и точные ссылки на листы", [pk(), f("document_id", "uuid", ref="documents.id"),
      f("file_id", "uuid", ref="files.id"), f("sequence_no", "integer"), f("file_page_no", "integer"),
      f("leaf_label", required=False)], unique=[("document_id", "sequence_no")])
table("ocr_versions", "Распознанный текст страницы и проверка сотрудником", [pk(),
      f("page_id", "uuid", ref="document_pages.id"), f("version_no", "integer"), f("text"),
      f("language", required=False), f("engine_version"), f("status", note="draft, reviewed, rejected"),
      f("reviewed_by", "uuid", False, "users.id"), f("reviewed_at", "timestamptz", False)], unique=[("page_id", "version_no")])
table("pages", "Информационные страницы, отчёты, инструкции и публикации", [rid(),
      f("page_type", note="about, history, structure, staff, regulation, report, guide, publication, privacy"),
      f("parent_id", "uuid", False, "pages.id"), f("sort_order", "integer")])
table("news", "Новости и мероприятия учреждения", [rid(), f("news_type", note="news, announcement"),
      f("event_starts_at", "timestamptz", False), f("event_ends_at", "timestamptz", False)])
table("faq_items", "Проверенные справочные ответы", [rid(), f("sort_order", "integer")],
      note="В resource_versions title = вопрос, body = ответ.")
table("collections", "Тематические коллекции", [rid(), f("collection_type", note="history, photo_album, education")])
table("collection_items", "Состав и порядок коллекции", [pk(), f("collection_id", "uuid", ref="collections.id"),
      f("resource_id", "uuid", ref="resources.id"), f("position", "integer")],
      unique=[("collection_id", "resource_id"), ("collection_id", "position")])
table("exhibitions", "Онлайн-выставки", [rid(), f("starts_on", "date", False), f("ends_on", "date", False)])
table("exhibition_items", "Экспонаты с собственной переводимой подписью", [rid(),
      f("exhibition_id", "uuid", ref="exhibitions.id"), f("source_resource_id", "uuid", ref="resources.id"),
      f("position", "integer")], unique=[("exhibition_id", "position")])
table("people", "Исторические личности", [rid(), f("name_as_source"), f("birth_label", required=False),
      f("death_label", required=False)])
table("organizations", "Организации и авторы фондов", [rid(), f("name_as_source"), *dates()])
table("places", "Населённые пункты и исторические объекты", [rid(), f("place_type"),
      f("parent_id", "uuid", False, "places.id"), f("latitude", "decimal(9,6)", False), f("longitude", "decimal(9,6)", False)])
table("place_names", "Языковые и исторические варианты топонимов", [pk(), f("place_id", "uuid", ref="places.id"),
      f("locale"), f("name"), *dates(), f("source_record_id", "uuid", False, "source_records.id")])
table("historical_events", "Исторические события, отличные от анонсов учреждения", [rid(), *dates()])
for name, target, col, purpose in [
    ("resource_people", "people", "person_id", "Личности и их роль в материале"),
    ("resource_organizations", "organizations", "organization_id", "Организации и их роль в материале"),
    ("resource_places", "places", "place_id", "Географические связи"),
    ("resource_events", "historical_events", "event_id", "Связь с историческими событиями")]:
    table(name, purpose, [pk(), f("resource_id", "uuid", ref="resources.id"), f(col, "uuid", ref=target+".id"),
                         f("relation_role")], unique=[("resource_id", col, "relation_role")])
table("categories", "Темы, категории и теги", [rid(), f("taxonomy_kind", note="category, tag"),
      f("parent_id", "uuid", False, "categories.id")])
table("resource_categories", "Тематика материалов", [pk(), f("resource_id", "uuid", ref="resources.id"),
      f("category_id", "uuid", ref="categories.id")], unique=[("resource_id", "category_id")])
table("periodical_titles", "Названия газет и другой периодики", [rid(), f("name_as_source"),
      f("publisher_label", required=False), f("publication_place_id", "uuid", False, "places.id")])
table("periodical_holdings", "Сведения о наличии периодики из исходных перечней", [rid(),
      f("periodical_id", "uuid", ref="periodical_titles.id"), f("branch_id", "uuid", False, "branches.id"),
      *dates(), f("volume_count_label", required=False), f("holdings_note", required=False)],
      note="Наличие выпуска не означает наличие скана; неизвестный филиал требует проверки до публикации.")
table("site_links", "Официальные внешние ссылки", [pk(), f("locale"), f("label"), f("url"),
      f("placement", note="footer, social, government"), f("sort_order", "integer"), f("enabled", "boolean")])
table("navigation_items", "Редактируемое меню сайта", [pk(), f("locale"), f("label"),
      f("parent_id", "uuid", False, "navigation_items.id"), f("resource_id", "uuid", False, "resources.id"),
      f("internal_path", required=False), f("position", "integer")], note="XOR resource_id/internal_path. Внутренние пути проверяются по реестру маршрутов.")
table("users", "Учётные записи сотрудников; посетителю учётная запись не обязательна", [pk(), f("email"),
      f("password_hash"), f("display_name"), f("is_active", "boolean"), f("created_at", "timestamptz")], unique=[("email",)])
table("roles", "Семь начальных ролей ТЗ", [pk(), f("code"), f("name")], unique=[("code",)])
table("permissions", "Действия над модулями", [pk(), f("code")], unique=[("code",)])
table("role_permissions", "Полномочия роли", [pk(), f("role_id", "uuid", ref="roles.id"),
      f("permission_id", "uuid", ref="permissions.id")], unique=[("role_id", "permission_id")])
table("user_role_assignments", "Роль сотрудника и область доступа", [pk(), f("user_id", "uuid", ref="users.id"),
      f("role_id", "uuid", ref="roles.id"), f("branch_id", "uuid", False, "branches.id"),
      f("scope", note="global, branch")], note="CHECK scope/branch_id. Два partial unique индекса исключают дубли global/branch.")
table("moderation_actions", "Решения проверяющих", [pk(), f("revision_id", "uuid", ref="resource_versions.id"),
      f("actor_id", "uuid", ref="users.id"), f("action"), f("comment", required=False), f("created_at", "timestamptz")])
table("audit_logs", "Неизменяемый журнал действий сотрудников", [pk(), f("actor_id", "uuid", False, "users.id"),
      f("resource_id", "uuid", False, "resources.id"), f("action"), f("target_reference", required=False),
      f("safe_change_summary", "jsonb"), f("created_at", "timestamptz")],
      note="Без паролей, токенов и полного текста вопросов. Не является копией всей БД.")
table("feedback", "Отзывы, предложения и пожелания", [pk(), f("kind", note="review, suggestion, wish"),
      f("body"), f("reply_contact", required=False), f("status", note="new, reviewed, hidden, published"),
      f("created_at", "timestamptz"), f("moderated_by", "uuid", False, "users.id"), f("expires_at", "timestamptz", False)],
      note="Контакты не публикуются. Нет регистрационных номеров обращений и обещаний услуги.")
table("source_records", "Происхождение материалов", [pk(), f("source_namespace"), f("source_key"),
      f("source_url", required=False), f("local_path", required=False), f("sha256", required=False),
      f("fetched_at", "timestamptz", False), f("source_status"), f("locator", required=False)],
      unique=[("source_namespace", "source_key")], note="locator = лист/строка/страница оригинала; URL не является лицензией на публикацию.")
table("resource_sources", "Несколько источников одного материала", [pk(), f("resource_id", "uuid", ref="resources.id"),
      f("source_record_id", "uuid", ref="source_records.id"), f("relation_role")],
      unique=[("resource_id", "source_record_id", "relation_role")])
table("import_batches", "Пакет импорта с версиями правил", [pk(), f("input_source_id", "uuid", ref="source_records.id"),
      f("mapping_version"), f("started_by", "uuid", ref="users.id"), f("status"),
      f("started_at", "timestamptz"), f("finished_at", "timestamptz", False), f("summary", "jsonb")])
table("import_rows", "Исходные и неподтверждённые данные", [pk(), f("batch_id", "uuid", ref="import_batches.id"),
      f("source_key"), f("row_locator"), f("raw_payload", "jsonb"), f("proposed_payload", "jsonb", False),
      f("errors", "jsonb"), f("status", note="pending, valid, needs_review, rejected, imported"),
      f("resource_id", "uuid", False, "resources.id")], unique=[("batch_id", "row_locator")])
table("legacy_redirects", "Переходы со старых страниц", [pk(), f("old_url"), f("resource_id", "uuid", ref="resources.id"),
      f("locale")], unique=[("old_url",)])
table("search_chunks", "Перестраиваемые фрагменты разрешённых источников", [pk(),
      f("revision_id", "uuid", ref="resource_versions.id"), f("ocr_version_id", "uuid", False, "ocr_versions.id"),
      f("chunk_no", "integer"), f("language"), f("text"), f("text_hash"), f("locator", required=False),
      f("pipeline_version"), f("created_at", "timestamptz")], unique=[("revision_id", "pipeline_version", "chunk_no")])
table("embedding_models", "Версии моделей смыслового поиска", [pk(), f("model_key"), f("dimensions", "integer"),
      f("revision"), f("active", "boolean")], unique=[("model_key", "revision")])
table("chunk_embeddings", "Векторные представления фрагментов", [pk(), f("chunk_id", "uuid", ref="search_chunks.id"),
      f("model_id", "uuid", ref="embedding_models.id"), f("embedding", "vector")],
      unique=[("chunk_id", "model_id")], note="vector без размерности — логический placeholder. В миграции отдельный согласованный размер и индекс для выбранной модели.")
table("chat_sessions", "Анонимные сессии с ограниченным хранением", [pk(), f("token_hash"), f("locale"),
      f("created_at", "timestamptz"), f("expires_at", "timestamptz")], unique=[("token_hash",)])
table("chat_messages", "Сообщения разговора", [pk(), f("session_id", "uuid", ref="chat_sessions.id"),
      f("sequence_no", "integer"), f("role", note="user, assistant"), f("body"),
      f("status", note="pending, completed, failed"), f("model_revision", required=False),
      f("created_at", "timestamptz")], unique=[("session_id", "sequence_no")])
table("message_citations", "Проверяемые источники ответа", [pk(), f("message_id", "uuid", ref="chat_messages.id"),
      f("revision_id", "uuid", ref="resource_versions.id"), f("chunk_id", "uuid", False, "search_chunks.id"),
      f("source_text_hash"), f("locator", required=False), f("position", "integer")],
      unique=[("message_id", "position")], note="Если chunk задан, он принадлежит указанной revision. Источник при открытии снова проходит проверку доступа.")
table("answer_feedback", "Оценка полезности ответа", [pk(), f("message_id", "uuid", ref="chat_messages.id"),
      f("rating", "smallint"), f("reason_code", required=False), f("created_at", "timestamptz")],
      unique=[("message_id",)], note="Оценивать может только владелец сессии; rating -1 или 1.")
table("search_events", "Минимальная обезличенная аналитика", [pk(), f("locale"), f("intent_code", required=False),
      f("query_redacted", required=False), f("result_count", "integer"),
      f("clicked_resource_id", "uuid", False, "resources.id"), f("latency_ms", "integer"), f("occurred_at", "timestamptz")],
      note="Не сохраняет IP, контакты, идентификатор сессии или сырые вопросы по умолчанию.")
table("index_jobs", "Надёжное обновление поискового индекса", [pk(), f("resource_id", "uuid", ref="resources.id"),
      f("requested_version", "bigint"), f("status"), f("attempts", "integer"),
      f("available_at", "timestamptz"), f("last_error_code", required=False)],
      note="Публикация и запись задания — одна транзакция. Ошибка индекса не открывает старый закрытый контент.")

GROUPS = {
    "01-catalog": ["branches", "funds", "fund_names", "inventories", "archive_cases", "documents"],
    "02-publication": ["resources", "resource_versions", "resource_publications", "resource_routes", "moderation_actions"],
    "03-content": ["resources", "pages", "news", "faq_items", "collections", "collection_items", "exhibitions", "exhibition_items", "categories", "resource_categories"],
    "04-files": ["resources", "documents", "files", "file_derivatives", "resource_files", "document_pages", "ocr_versions"],
    "05-ai": ["resource_versions", "search_chunks", "embedding_models", "chunk_embeddings", "chat_sessions", "chat_messages", "message_citations", "answer_feedback"],
    "06-access": ["branches", "users", "roles", "permissions", "role_permissions", "user_role_assignments", "audit_logs", "feedback"],
    "07-migration": ["resources", "source_records", "resource_sources", "import_batches", "import_rows", "legacy_redirects"],
    "08-history": ["resources", "people", "organizations", "places", "place_names", "historical_events", "resource_people", "resource_organizations", "resource_places", "resource_events"],
    "09-periodicals": ["branches", "places", "periodical_titles", "periodical_holdings"],
    "10-operations": ["resources", "branches", "branch_contacts", "branch_hours", "site_links", "navigation_items", "index_jobs", "search_events"],
}


def quote(value):
    return "'" + value.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n") + "'"


def generate():
    OUT.mkdir(parents=True, exist_ok=True)
    diagrams = OUT / "diagrams"
    diagrams.mkdir(exist_ok=True)
    dbml = ["// GENERATED by tools/docs/build_model.py; proposed logical model, not a production migration.",
            "Project archive_vko {", "  database_type: 'PostgreSQL'", "}", ""]
    dictionary = ["# Словарь данных — проект v0.1", "", "Сгенерирован из `tools/docs/build_model.py`. Не является готовой миграцией.", "",
                  "`id` — PK; обязательность и внешние ключи указаны явно. Все связи по умолчанию RESTRICT при удалении. Политики см. [constraints.md](constraints.md).", ""]
    for name, info in TABLES.items():
        dictionary += [f"## {name}", "", info["purpose"], "", "| Поле | Тип | Обязательно | Связь | Назначение |", "|---|---|---|---|---|"]
        dbml += [f"Table {name} {{", f"  Note: {quote(info['purpose'] + '. ' + info['note'])}"]
        for field in info["fields"]:
            opts = ["pk"] if field["name"] == "id" else []
            opts.append("not null" if field["required"] else "null")
            if field["note"]:
                opts.append("note: " + quote(field["note"]))
            dbml.append(f"  {field['name']} {field['type']} [{', '.join(opts)}]")
            dictionary.append(f"| `{field['name']}` | `{field['type']}` | {'да' if field['required'] else 'нет'} | {field['ref'] or '—'} | {field['note'] or '—'} |")
        if info["unique"]:
            dbml.append("  indexes {")
            for cols in info["unique"]:
                dbml.append(f"    ({', '.join(cols)}) [unique]")
            dbml.append("  }")
            dictionary += ["", "Уникальность: " + "; ".join("`" + ", ".join(c) + "`" for c in info["unique"]) + "."]
        if info["note"]:
            dictionary += ["", info["note"]]
        dictionary.append("")
        dbml += ["}", ""]
    for name, info in TABLES.items():
        for field in info["fields"]:
            if field["ref"]:
                # Composite publication FK below includes revision_id.
                if name == "resource_publications" and field["name"] == "revision_id":
                    continue
                if field["name"] == "id" or (field["name"],) in info["unique"]:
                    dbml.append(f"Ref: {field['ref']} - {name}.id [delete: restrict]")
                else:
                    dbml.append(f"Ref: {name}.{field['name']} > {field['ref']} [delete: restrict]")
    dbml.append("Ref: resource_publications.(resource_id, locale, revision_id) > resource_versions.(resource_id, locale, id) [delete: restrict]")
    (OUT / "schema.dbml").write_text("\n".join(dbml) + "\n", encoding="utf-8")
    (OUT / "data-dictionary.md").write_text("\n".join(dictionary), encoding="utf-8")
    (OUT / "schema.json").write_text(json.dumps(TABLES, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for group, names in GROUPS.items():
        lines = ["erDiagram", "    direction TB"]
        for name in names:
            lines.append(f"    {name.upper()} {{")
            # Keep exported images readable. Full fields are in DBML/dictionary.
            selected = [x for x in TABLES[name]["fields"] if x["name"] == "id" or x["ref"]]
            selected += [x for x in TABLES[name]["fields"] if x not in selected][:2]
            for field in selected:
                keys = " PK, FK" if field["name"] == "id" and field["ref"] else " PK" if field["name"] == "id" else " FK" if field["ref"] else ""
                kind = field["type"].split("(")[0]
                lines.append(f"        {kind} {field['name']}{keys}")
            lines.append("    }")
        for name in names:
            for field in TABLES[name]["fields"]:
                if not field["ref"]:
                    continue
                target = field["ref"].split(".")[0]
                if target not in names:
                    continue
                left = "||" if field["required"] else "|o"
                unique_fk = field["name"] == "id" or (field["name"],) in TABLES[name]["unique"]
                right = "o|" if unique_fk else "o{"
                lines.append(f"    {target.upper()} {left}--{right} {name.upper()} : {field['name']}")
        (diagrams / (group + ".mmd")).write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Generated {len(TABLES)} tables and {len(GROUPS)} ER diagrams")


if __name__ == "__main__":
    generate()
