import { describe, expect, it } from 'vitest'
import { parseTaskFilters } from './taskFilters'
import { emptyTaskForm, taskFormSchema } from './taskForm.schema'

const validTask = {
	...emptyTaskForm,
	title: 'Лендинг',
	description: 'Свёрстать лендинг по готовому макету.',
}

describe('taskFormSchema', () => {
	it('принимает минимальное задание', () => {
		expect(taskFormSchema.safeParse(validTask).success).toBe(true)
	})

	it('не больше 5 компетенций', () => {
		const result = taskFormSchema.safeParse({ ...validTask, competencies: [1, 2, 3, 4, 5, 6] })
		expect(result.error?.issues[0]?.message).toBe('competenciesLimit')
	})

	it('ограничение участников — только целое от 1 до 999 или пусто', () => {
		for (const value of ['0', '-1', '1.5', '1000', 'abc']) {
			expect(taskFormSchema.safeParse({ ...validTask, maxParticipants: value }).success).toBe(false)
		}
		for (const value of ['', '1', '999']) {
			expect(taskFormSchema.safeParse({ ...validTask, maxParticipants: value }).success).toBe(true)
		}
	})
})

describe('parseTaskFilters', () => {
	it('разбирает параметры адресной строки', () => {
		expect(parseTaskFilters({ difficulty: '2', tags: 'React,SQL', company: '5' })).toEqual({
			difficulty: '2',
			tags: ['React', 'SQL'],
			company: '5',
		})
	})

	it('мусор в адресе не ломает страницу, а сбрасывает фильтр', () => {
		expect(parseTaskFilters({ difficulty: '9', tags: undefined })).toEqual({
			difficulty: undefined,
			company: undefined,
			tags: [],
		})
	})

	it('из повторяющихся параметров берёт первый', () => {
		expect(parseTaskFilters({ difficulty: ['1', '3'] }).difficulty).toBe('1')
	})
})
