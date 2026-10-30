import { describe, expect, it } from 'vitest'
import { getRequiredTitlePart } from './getRequiredTitlePart'

describe('getRequiredTitlePart', () => {
	it('два слова, если среди них есть длинное', () => {
		expect(getRequiredTitlePart('Лендинг для сервиса онлайн-записи')).toBe('Лендинг для')
	})

	it('три слова, если первые два короткие', () => {
		expect(getRequiredTitlePart('API для учёта заявок')).toBe('API для учёта')
	})

	it('лишние пробелы не мешают', () => {
		expect(getRequiredTitlePart('  REST   API  для  ')).toBe('REST API для')
	})
})
