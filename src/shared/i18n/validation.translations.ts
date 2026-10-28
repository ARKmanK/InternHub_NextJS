import { defineTranslations } from './define-translations'

/**
 * Тексты ошибок валидации. В zod-схемах вместо текста пишется ключ отсюда
 * (`{ error: 'email' }`), а переводит его компонент FormFieldError.
 * Так одна схема работает и на клиенте, и на сервере, на любом языке.
 */
const en = {
	required: 'Required field',
	email: 'Enter a valid email',
	password: 'At least 8 characters',
	name: 'From 2 to 30 characters',
	group: 'From 2 to 20 characters',
	course: 'Choose a course',
	companyName: 'From 2 to 100 characters',
	taskTitle: 'From 3 to 50 characters',
	taskDescription: 'From 20 to 3000 characters',
	difficulty: 'Choose difficulty',
	tag: 'From 2 to 20 characters',
	tagsLimit: 'No more than 10 tags',
	fileSize: 'File is larger than 50 MB',
	fileType: 'Unsupported file type',
	githubUrl: 'Enter a GitHub repository link',
	comment: 'No more than 2000 characters',
	confirmText: 'The text does not match',
}

const ru = {
	required: 'Обязательное поле',
	email: 'Введите корректный email',
	password: 'Минимум 8 символов',
	name: 'От 2 до 30 символов',
	group: 'От 2 до 20 символов',
	course: 'Выберите курс',
	companyName: 'От 2 до 100 символов',
	taskTitle: 'От 3 до 50 символов',
	taskDescription: 'От 20 до 3000 символов',
	difficulty: 'Выберите сложность',
	tag: 'От 2 до 20 символов',
	tagsLimit: 'Не больше 10 тегов',
	fileSize: 'Файл больше 50 МБ',
	fileType: 'Неподдерживаемый тип файла',
	githubUrl: 'Укажите ссылку на репозиторий GitHub',
	comment: 'Не больше 2000 символов',
	confirmText: 'Текст не совпадает',
}

const validation = defineTranslations({ en, ru })

export type ValidationKey = keyof typeof ru

export default validation
