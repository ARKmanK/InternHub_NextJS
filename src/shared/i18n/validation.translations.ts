import { defineTranslations } from './define-translations'

/**
 * Тексты ошибок валидации. В zod-схемах вместо текста пишется ключ отсюда
 * (`{ error: 'email' }`), а переводит его компонент FormFieldError.
 * Так одна схема работает и на клиенте, и на сервере, на любом языке.
 */
const en = {
	competenciesLimit: 'Choose up to 5 competencies',
	required: 'Required field',
	email: 'Enter a valid email',
	password: 'At least 8 characters',
	passwordsMismatch: 'Passwords do not match',
	name: 'From 2 to 60 characters',
	group: 'From 2 to 20 characters',
	course: 'Choose a course',
	companyName: 'From 2 to 100 characters',
	inn: 'INN is 10 digits (company) or 12 digits (sole proprietor)',
	ogrn: 'OGRN is 13 or 15 digits',
	taskTitle: 'From 3 to 50 characters',
	taskDescription: 'From 20 to 3000 characters',
	difficulty: 'Choose difficulty',
	tag: 'From 2 to 20 characters',
	tagsLimit: 'No more than 10 tags',
	fileSize: 'File is larger than 50 MB',
	fileType: 'Unsupported file type',
	repositoryUrl: 'Enter a link to the repository (https://...)',
	comment: 'No more than 2000 characters',
	confirmText: 'The text does not match',
	longText: 'No more than 2000 characters',
	maxParticipants: 'A number from 1 to 999, or leave empty',
	score: 'Rate from 1 to 5',
	imagesLimit: 'No more than 5 images',
	imageSize: 'Image is larger than 10 MB',
	reviewComment: 'Explain what should be changed (from 5 characters)',
	practiceTitle: 'From 3 to 100 characters',
	date: 'Choose a date',
	dateRange: 'The end date cannot be earlier than the start date',
}

const ru = {
	competenciesLimit: 'Выберите не больше 5 компетенций',
	required: 'Обязательное поле',
	email: 'Введите корректный email',
	password: 'Минимум 8 символов',
	passwordsMismatch: 'Пароли не совпадают',
	name: 'От 2 до 60 символов',
	group: 'От 2 до 20 символов',
	course: 'Выберите курс',
	companyName: 'От 2 до 100 символов',
	inn: 'ИНН — 10 цифр у организации или 12 у ИП',
	ogrn: 'ОГРН — 13 или 15 цифр',
	taskTitle: 'От 3 до 50 символов',
	taskDescription: 'От 20 до 3000 символов',
	difficulty: 'Выберите сложность',
	tag: 'От 2 до 20 символов',
	tagsLimit: 'Не больше 10 тегов',
	fileSize: 'Файл больше 50 МБ',
	fileType: 'Неподдерживаемый тип файла',
	repositoryUrl: 'Укажите ссылку на репозиторий (https://...)',
	comment: 'Не больше 2000 символов',
	confirmText: 'Текст не совпадает',
	longText: 'Не больше 2000 символов',
	maxParticipants: 'Число от 1 до 999 или оставьте пустым',
	score: 'Поставьте оценку от 1 до 5',
	imagesLimit: 'Не больше 5 изображений',
	imageSize: 'Изображение больше 10 МБ',
	reviewComment: 'Поясните, что нужно изменить (от 5 символов)',
	practiceTitle: 'От 3 до 100 символов',
	date: 'Выберите дату',
	dateRange: 'Дата окончания не может быть раньше даты начала',
}

const validation = defineTranslations({ en, ru })

export type ValidationKey = keyof typeof ru

export default validation
