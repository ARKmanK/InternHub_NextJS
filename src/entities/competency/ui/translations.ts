import { defineTranslations } from '@/shared/i18n'

const en = {
	basic: 'Basic',
	confident: 'Confident',
	advanced: 'Advanced',
	confirmedBy: '{count, plural, one {# accepted solution} other {# accepted solutions}}',
	averageScore: 'average score {score}',
	empty: 'No confirmed competencies yet: they appear when an employer accepts a solution',
	levelHint:
		'The level depends on the difficulty of accepted tasks (easy — 1 point, medium — 2, hard — 3): confident from {confident} points, advanced from {advanced}.',
}

const ru = {
	basic: 'Базовый',
	confident: 'Уверенный',
	advanced: 'Продвинутый',
	confirmedBy:
		'{count, plural, one {# принятое решение} few {# принятых решения} other {# принятых решений}}',
	averageScore: 'средняя оценка {score}',
	empty:
		'Подтверждённых компетенций пока нет: они появляются, когда работодатель принимает решение',
	levelHint:
		'Уровень зависит от сложности принятых заданий (простое — 1 балл, среднее — 2, сложное — 3): уверенный — от {confident} баллов, продвинутый — от {advanced}.',
}

export default defineTranslations({ en, ru })
