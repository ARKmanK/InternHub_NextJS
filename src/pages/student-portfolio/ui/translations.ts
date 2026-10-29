import { defineTranslations } from '@/shared/i18n'

const en = {
	competencies: 'Confirmed competencies',
	solutions: 'Accepted solutions',
	metaTitle: 'Portfolio',
	groupCourse: 'Group {group}, year {course}',
	summary:
		'{count, plural, =0 {No accepted solutions yet} one {# accepted solution} other {# accepted solutions}}',
	averageScore: 'average score {score}',
	empty: 'No accepted solutions yet',
}

const ru = {
	competencies: 'Подтверждённые компетенции',
	solutions: 'Принятые решения',
	metaTitle: 'Портфолио',
	groupCourse: 'Группа {group}, {course} курс',
	summary:
		'{count, plural, =0 {Принятых решений пока нет} one {# принятое решение} few {# принятых решения} other {# принятых решений}}',
	averageScore: 'средняя оценка {score}',
	empty: 'Принятых решений пока нет',
}

export default defineTranslations({ en, ru })
