# Эта папка нарочно пустая

Next.js ищет роутинг сначала в корне проекта (`app/`, `pages/`), и только если там ничего нет — в `src/`.
Пустая `pages/` в корне нужна, чтобы Next **не** считал `src/pages` своим Pages Router:
`src/pages` — это слой pages из Feature-Sliced Design.

Роутинг Next живёт в корневой `app/`, а файлы там только отдают страницы из `src/pages`.
Так рекомендует официальный гайд FSD для Next.js: https://feature-sliced.design/docs/guides/tech/with-nextjs
