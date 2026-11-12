# Публикация на Vercel

## Действующий стенд

| Параметр | Значение |
|---|---|
| Сайт | [e-arhiv-vko-portal.vercel.app](https://e-arhiv-vko-portal.vercel.app/) |
| Проект | [e-arhiv-vko-portal](https://vercel.com/temirkhanerbolatovich-coder/e-arhiv-vko-portal) |
| Аккаунт | `temirkhanerbolatovich-coder` |
| Production-ветка | `main` |
| Node.js | `22.x` |
| Корневая папка | Корень репозитория |
| Установка | `npm ci --prefix backend` |
| Сборка | `npm run build:vercel --prefix backend` |
| Конфигурация | [vercel.json](../../vercel.json) |
| Результат | `.vercel/output` со статикой и функцией API |

Первая публикация в аккаунте владельца выполнена 12 ноября 2026 года из `feat/backend` на коммите `405ffb8`. При подготовке репозитория для жюри опубликованный код и документы объединены в `main`. Первоначальный стенд напарника доступен по адресу [e-arhiv-vko.vercel.app](https://e-arhiv-vko.vercel.app/).

## Обновление сайта

1. Создайте рабочую ветку от актуальной `main`.
2. Внесите изменения и выполните `npm run check --prefix backend`.
3. Отправьте ветку на GitHub и откройте pull request в `main`.
4. Дождитесь GitHub Actions и preview Vercel.
5. Проверьте preview и объедините согласованные изменения.
6. Vercel соберёт production из `main` и обновит основной адрес.

Preview защищён Vercel Authentication. Используйте аккаунт с доступом к проекту. Production-сайт доступен без входа в Vercel.

## Переменные окружения

Значения хранятся в настройках Vercel.

| Переменная | Назначение и состояние стенда |
|---|---|
| `SESSION_SECRET` | Секрет подписи сессий для production и preview |
| `LLM_GATEWAY=off` | Вызовы модели через Gateway отключены |
| `QUERY_EMBEDDINGS=off` | Поиск запросов работает без вычисления embeddings |
| `DATABASE_URL` | Подключается после подготовки PostgreSQL и загрузки данных |
| `OPENAI_API_KEY` или `AI_GATEWAY_API_KEY` | Задаются при отдельном подключении модели |

Полный список находится в [образце конфигурации](../../backend/.env.example). После изменения переменных требуется новый деплой.

## Хранение данных

Сборка загружает `backend/data/snapshot/` в PGlite. Правки сотрудников и отзывы живут в памяти экземпляра функции. Для постоянной эксплуатации нужен PostgreSQL с расширениями `vector` и `pg_trgm`, загруженными данными и резервным копированием.

Пароль демо-пользователей находится в готовом снимке. Изменение `DEMO_PASSWORD` само по себе не меняет хеши существующих пользователей. Рабочие учётные записи подготавливаются в постоянной БД.

## Проверка публикации

- Деплой имеет состояние `READY` и ожидаемый commit SHA.
- Главная открывается по основному адресу.
- `GET /api/v1/health` возвращает `ok: true`.
- Каталог, карточки и филиалы получают серверные данные.
- Проверки GitHub Actions завершены успешно.

Первый автодеплой подтверждён коммитом [b352c2e](https://github.com/temirkhanerbolatovich-coder/e-arhiv-vko-research/commit/b352c2e462a44db32e650fc4858b21b536b2c865). Тестовый файл проверен авторизованным CLI. Временный доступ для проверки отозван после её завершения.

Порядок production и preview описан в [документации Vercel](https://vercel.com/docs/git).

