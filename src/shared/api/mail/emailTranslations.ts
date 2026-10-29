import { createTranslator } from 'next-intl'
import { defineTranslations, type Locale } from '@/shared/i18n'

/** Тексты писем. Письма отправляет сервер вне React, поэтому переводчик создаётся вручную. */
const en = {
	greeting: 'Hello, {name}!',
	ignore: 'If it was not you, just ignore this email.',
	linkExpires: 'The link is valid for 1 hour.',
	verifySubject: 'InternHub: confirm your email',
	verifyText: 'To finish signing up on InternHub, follow the link:',
	verifyButton: 'Confirm email',
	resetSubject: 'InternHub: password recovery',
	resetText: 'To set a new password, follow the link:',
	resetButton: 'Set a new password',
	inviteSubject: 'InternHub: you are invited as a teacher',
	inviteText:
		'The administrator created a teacher account for you on InternHub. To start, set a password:',
	inviteButton: 'Set a password',
	inviteIgnore: 'If the link has expired, ask the administrator to send the invitation again.',
	existingSubject: 'InternHub: repeated sign-up attempt',
	existingText:
		'Someone tried to sign up on InternHub with your email. If it was you, just log in, and if you forgot the password, recover it:',
	existingSafe: 'If it was not you, you do not need to do anything: your account is safe.',
	reportSubject: 'InternHub: new solutions this week',
	reportIntro: 'New solutions to your tasks since {since}:',
	reportLine: '“{taskTitle}” — {count, plural, one {# new solution} other {# new solutions}}',
	reportOpen: 'Open your tasks: {url}',
}

const ru = {
	greeting: 'Здравствуйте, {name}!',
	ignore: 'Если это были не вы, просто проигнорируйте это письмо.',
	linkExpires: 'Ссылка действует 1 час.',
	verifySubject: 'InternHub: подтвердите почту',
	verifyText: 'Чтобы завершить регистрацию на InternHub, перейдите по ссылке:',
	verifyButton: 'Подтвердить почту',
	resetSubject: 'InternHub: восстановление пароля',
	resetText: 'Чтобы задать новый пароль, перейдите по ссылке:',
	resetButton: 'Задать новый пароль',
	inviteSubject: 'InternHub: приглашение для преподавателя',
	inviteText:
		'Администратор создал для вас учётную запись преподавателя на InternHub. Чтобы начать, задайте пароль:',
	inviteButton: 'Задать пароль',
	inviteIgnore: 'Если ссылка устарела, попросите администратора отправить приглашение ещё раз.',
	existingSubject: 'InternHub: попытка повторной регистрации',
	existingText:
		'Кто-то пытался зарегистрироваться на InternHub с вашей почтой. Если это были вы — просто войдите, а если забыли пароль, восстановите его:',
	existingSafe: 'Если это были не вы, ничего делать не нужно: ваш аккаунт в безопасности.',
	reportSubject: 'InternHub: новые решения за неделю',
	reportIntro: 'Новые решения по вашим заданиям с {since}:',
	reportLine:
		'«{taskTitle}» — {count, plural, one {# новое решение} few {# новых решения} other {# новых решений}}',
	reportOpen: 'Открыть задания: {url}',
}

const emailTranslations = defineTranslations({ en, ru })

export const getEmailTranslator = (locale: Locale) =>
	createTranslator({ locale, messages: { Email: emailTranslations[locale] }, namespace: 'Email' })
