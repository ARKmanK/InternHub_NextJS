import { defineTranslations } from '@/shared/i18n'

const en = {
	teacher: 'Teacher: {name}',
	counts:
		'{students, plural, one {# student} other {# students}} · {tasks, plural, one {# task} other {# tasks}}',
	noGrade: 'Not graded',
	excellent: 'Excellent',
	good: 'Good',
	satisfactory: 'Satisfactory',
	unsatisfactory: 'Unsatisfactory',
}

const ru = {
	teacher: 'Преподаватель: {name}',
	counts:
		'{students, plural, one {# студент} few {# студента} other {# студентов}} · {tasks, plural, one {# задание} few {# задания} other {# заданий}}',
	noGrade: 'Без оценки',
	excellent: 'Отлично',
	good: 'Хорошо',
	satisfactory: 'Удовлетворительно',
	unsatisfactory: 'Неудовлетворительно',
}

export default defineTranslations({ en, ru })
