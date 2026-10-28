import { defineTranslations } from '@/shared/i18n'

const en = {
	title: 'Applications',
	empty: 'No applications yet',
	course: 'year {course}',
	acceptedOf: 'Accepted {count} of {max}',
	acceptedUnlimited: 'Accepted: {count}',
}

const ru = {
	title: 'Заявки',
	empty: 'Заявок пока нет',
	course: '{course} курс',
	acceptedOf: 'Принято {count} из {max}',
	acceptedUnlimited: 'Принято: {count}',
}

export default defineTranslations({ en, ru })
