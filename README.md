# InternHub

Платформа проектного взаимодействия студентов и работодателей: компании публикуют реальные задания, администратор их модерирует, студенты выполняют и сдают решения, работодатель проверяет и оценивает.

Стек: **Next.js 16** (App Router, Server Components, Server Actions) · **React 19** + React Compiler · **TypeScript** · **Tailwind CSS 4** + **shadcn/ui** · **react-hook-form** + **zod** · **next-intl** · архитектура **Feature-Sliced Design**. База данных — **PostgreSQL** через **Prisma 7**.

Документация: [требования](docs/01-requirements.md) · [модель данных и жизненные циклы](docs/02-data-model.md) · [архитектура](docs/03-architecture.md).

## Запуск

Нужны [Bun](https://bun.sh) 1.3+ и Node.js 20+. Docker и установленный PostgreSQL не нужны: для разработки Prisma поднимает локальную базу сама.

```bash
bun install                  # заодно сгенерирует Prisma Client
cp .env.example .env.local
bun run db:start             # локальный PostgreSQL в фоне; адрес — `bunx prisma dev ls` (строка TCP)
bun run db:migrate           # применить миграции
bun run db:seed              # тестовые данные
bun dev                      # http://localhost:3000
```

Если порты базы в `bunx prisma dev ls` отличаются от `.env.local`, поправьте `DATABASE_URL` и `SHADOW_DATABASE_URL`.

## База данных

| Команда                        | Что делает                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| `bun run db:start` / `db:stop` | запустить / остановить локальную базу (`prisma dev`)                                  |
| `bun run db:migrate`           | изменили `prisma/schema.prisma` → создать и применить миграцию (`prisma migrate dev`) |
| `bun run db:generate`          | перегенерировать Prisma Client (после изменения схемы)                                |
| `bun run db:seed`              | заполнить базу тестовыми данными (`prisma/seed.ts`)                                   |
| `bun run db:reset`             | удалить все данные, заново применить миграции и сид                                   |
| `bun run db:studio`            | Prisma Studio — просмотр и правка данных в браузере                                   |
| `bun run db:deploy`            | применить миграции на production (без создания новых)                                 |

Как устроено: схема — `prisma/schema.prisma`, миграции — `prisma/migrations` (хранятся в git), настройки CLI — `prisma.config.ts`. Клиент генерируется в `src/shared/api/db/generated` (в git не попадает), подключение — `src/shared/api/db/client.ts`. Запросы пишутся в `entities/*/api` и превращают строки БД в DTO для интерфейса.

## Команды

| Команда                           | Что делает                                      |
| --------------------------------- | ----------------------------------------------- |
| `bun dev`                         | режим разработки                                |
| `bun run build` / `bun start`     | production-сборка и её запуск                   |
| `bun run typecheck`               | генерация типов маршрутов + проверка TypeScript |
| `bun run lint`                    | ESLint                                          |
| `bun run lint:fsd`                | проверка архитектуры FSD (Steiger)              |
| `bun run format` / `format:check` | Prettier                                        |
| `bun run check`                   | всё сразу, как в CI                             |

## Структура

```
app/            роутинг Next.js — тонкие файлы, которые только отдают страницы из src/pages
pages/          пустая папка-заглушка (см. pages/README.md), чтобы Next не трогал src/pages
src/
  app/          слой app: корневой layout, провайдеры, стили, i18n (реестр переводов)
  pages/        страницы: home, task, task-editor, profile, not-found
  widgets/      крупные блоки: header, footer, tasks-feed, task-activity, profile-dashboards, auth-panel
  features/     действия пользователя: auth/*, task/*, submission/*, notifications, lang-switch, theme-toggle
  entities/     бизнес-сущности: task, submission, user, tag, notification
  shared/       ui (shadcn и общие компоненты), config, i18n, lib
```

Правила:

- Импорты только сверху вниз: `app → pages → widgets → features → entities → shared`. Между слайсами одного слоя импортировать нельзя (для сущностей есть нотация `@x`, см. `entities/tag/@x/task.ts`).
- Из слайса импортируется только его public API — `index.ts`. Серверные функции (запросы к БД) лежат в `index.server.ts` и импортируются только в серверных компонентах и server actions.
- Всё это проверяет `bun run lint:fsd`.

## Переводы (i18n)

Строки компонента лежат рядом с ним в `translations.ts`:

```ts
import { defineTranslations } from '@/shared/i18n'

const en = { title: 'Filters' }
const ru = { title: 'Фильтры' }

export default defineTranslations({ en, ru }) // ошибка компиляции, если ключи в языках не совпадают
```

Файл экспортируется из `index.ts` слайса как `translations` и регистрируется одной строкой в реестре `src/app/i18n/messages.ts` под своим namespace. В компоненте: `useTranslations('TaskFilters')` (клиент) или `await getTranslations('TaskFilters')` (сервер). Ключи типизированы: опечатка — ошибка компиляции.

Язык хранится в куке `NEXT_LOCALE`, адреса без `/ru` и `/en`. Ошибки zod-схем — это ключи из `shared/i18n/validation.translations.ts`, их переводит `FormFieldError`.

## Состояние проекта

- **Этап 0** — основа: архитектура FSD, i18n, линтеры, CI.
- **Этап 1** — база данных: схема, миграции, сид, чтение данных через Prisma (лента, фильтры, страница задания, кабинеты), документация.
- Дальше: **этап 2** — авторизация (Better Auth), **этап 3** — изменение данных (создание заданий, модерация, заявки, решения, файлы). Server actions в `features/*/api` пока заглушки с пометками `TODO(этап N)`; `getCurrentUser()` возвращает `null`, поэтому кабинеты увидеть пока нельзя.
