# InternHub

Платформа проектного взаимодействия студентов и работодателей: компании публикуют реальные задания, администратор их модерирует, студенты выполняют и сдают решения, работодатель проверяет и оценивает.

Стек: **Next.js 16** (App Router, Server Components, Server Actions) · **React 19** + React Compiler · **TypeScript** · **Tailwind CSS 4** + **shadcn/ui** · **react-hook-form** + **zod** · **next-intl** · архитектура **Feature-Sliced Design**. База данных — PostgreSQL через **Prisma** (подключается на этапе 1).

## Запуск

Нужны [Bun](https://bun.sh) 1.3+ и Node.js 20+.

```bash
bun install
bun dev          # http://localhost:3000
```

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

Этап 0 (основа) завершён: проект собирается, архитектура и переводы настроены. Данных пока нет: функции в `entities/*/api` и server actions в `features/*/api` — заглушки с пометками `TODO(этап N)`. План: подключить PostgreSQL + Prisma (этап 1), авторизацию (этап 2), основной цикл задания (этап 3).
