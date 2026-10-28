import { defineTranslations } from '@/shared/i18n'

const en = {
	title: 'Filters',
	difficulty: 'Difficulty',
	anyDifficulty: 'Any',
	lvl1: 'Easy',
	lvl2: 'Medium',
	lvl3: 'Hard',
	company: 'Company',
	anyCompany: 'All companies',
	tags: 'Tags',
	noTags: 'No tags yet',
	reset: 'Reset filters',
}

const ru = {
	title: 'Фильтры',
	difficulty: 'Сложность',
	anyDifficulty: 'Любая',
	lvl1: 'Легко',
	lvl2: 'Средне',
	lvl3: 'Сложно',
	company: 'Компания',
	anyCompany: 'Все компании',
	tags: 'Теги',
	noTags: 'Тегов пока нет',
	reset: 'Сбросить фильтры',
}

export default defineTranslations({ en, ru })
