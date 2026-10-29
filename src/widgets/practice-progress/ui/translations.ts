import { defineTranslations } from '@/shared/i18n'

const en = {
	title: 'Progress',
	student: 'Student',
	group: 'Group',
	grade: 'Final grade',
	empty: 'No students yet — add a group or a student by email',
}

const ru = {
	title: 'Прогресс',
	student: 'Студент',
	group: 'Группа',
	grade: 'Итоговая оценка',
	empty: 'Студентов пока нет — добавьте группу или студента по почте',
}

export default defineTranslations({ en, ru })
