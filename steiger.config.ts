import { defineConfig } from 'steiger'
import fsd from '@feature-sliced/steiger-plugin'

/**
 * Линтер архитектуры FSD: ловит импорты «снизу вверх» (shared → features),
 * импорты в обход public API (index.ts) и импорты между слайсами одного слоя.
 * Запуск: bun run lint:fsd
 */
export default defineConfig([
	...fsd.configs.recommended,
	{
		// Пока данных нет (этап 1), многие слайсы используются в одном месте — это нормально
		rules: {
			'fsd/insignificant-slice': 'off',
		},
	},
])
