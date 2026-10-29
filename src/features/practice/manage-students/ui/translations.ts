import { defineTranslations } from '@/shared/i18n'

const en = {
	by_group: 'Whole group',
	by_email: 'One student by email',
	placeholder_group: 'PMI-22',
	placeholder_email: 'student@example.com',
	add: 'Add',
	added: '{count, plural, one {# student added} other {# students added}}',
	nobody: 'No new students found: check the group name or email (the email must be confirmed)',
	remove: 'Remove {name} from the practice',
	confirmRemove: 'Remove {name} from the practice? Their solutions will remain.',
}

const ru = {
	by_group: 'Всю группу',
	by_email: 'Одного студента по почте',
	placeholder_group: 'ПМИ-22',
	placeholder_email: 'student@example.com',
	add: 'Добавить',
	added:
		'{count, plural, one {Добавлен # студент} few {Добавлено # студента} other {Добавлено # студентов}}',
	nobody: 'Новых студентов не найдено: проверьте группу или почту (почта должна быть подтверждена)',
	remove: 'Убрать {name} из практики',
	confirmRemove: 'Убрать {name} из практики? Решения студента сохранятся.',
}

export default defineTranslations({ en, ru })
