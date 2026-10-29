import { defineTranslations } from '@/shared/i18n'

/**
 * Тексты уведомлений. Для каждого типа — заголовок и текст; в фигурных скобках — параметры из базы.
 * Комментарий проверяющего показывается отдельно, поэтому в текст он не входит.
 */
const en = {
	TASK_ON_MODERATION_title: 'New task awaiting moderation',
	TASK_ON_MODERATION_body: '“{taskTitle}” is waiting for review.',
	TASK_EDITED_title: 'Task edited, awaiting moderation',
	TASK_EDITED_body: 'The author changed “{taskTitle}”.',
	TASK_PUBLISHED_title: 'Task published',
	TASK_PUBLISHED_body: '“{taskTitle}” passed moderation.',
	TASK_RETURNED_title: 'Task returned for changes',
	TASK_RETURNED_body: '“{taskTitle}” needs to be fixed.',
	APPLICATION_RECEIVED_title: 'New application',
	APPLICATION_RECEIVED_body: '{studentName} wants to take “{taskTitle}”.',
	APPLICATION_ACCEPTED_title: 'Application accepted',
	APPLICATION_ACCEPTED_body: 'You can start “{taskTitle}” and submit a solution.',
	APPLICATION_DECLINED_title: 'Application declined',
	APPLICATION_DECLINED_body: 'The employer declined your application for “{taskTitle}”.',
	SOLUTION_RECEIVED_title: 'New solution',
	SOLUTION_RECEIVED_body: '{studentName} submitted a solution for “{taskTitle}”.',
	SOLUTION_RESUBMITTED_title: 'Solution revised',
	SOLUTION_RESUBMITTED_body: '{studentName} sent the revised solution for “{taskTitle}”.',
	SOLUTION_ACCEPTED_title: 'Solution accepted',
	SOLUTION_ACCEPTED_body: 'Your solution for “{taskTitle}” was accepted.',
	SOLUTION_CHANGES_REQUESTED_title: 'Solution sent back for changes',
	SOLUTION_CHANGES_REQUESTED_body: 'See the employer’s comment on “{taskTitle}”.',
	SOLUTION_REJECTED_title: 'Solution rejected',
	SOLUTION_REJECTED_body: 'Your solution for “{taskTitle}” was rejected.',
	ORGANIZATION_VERIFIED_title: 'Organization confirmed',
	ORGANIZATION_VERIFIED_body: 'You can now publish tasks.',
	ORGANIZATION_REJECTED_title: 'Organization did not pass verification',
	ORGANIZATION_REJECTED_body: 'Contact the platform administrator to find out why.',
}

const ru = {
	TASK_ON_MODERATION_title: 'Новое задание на модерации',
	TASK_ON_MODERATION_body: '«{taskTitle}» ждёт проверки.',
	TASK_EDITED_title: 'Задание изменено и ждёт модерации',
	TASK_EDITED_body: 'Автор отредактировал «{taskTitle}».',
	TASK_PUBLISHED_title: 'Задание опубликовано',
	TASK_PUBLISHED_body: '«{taskTitle}» прошло модерацию.',
	TASK_RETURNED_title: 'Задание возвращено на доработку',
	TASK_RETURNED_body: '«{taskTitle}» нужно исправить.',
	APPLICATION_RECEIVED_title: 'Новая заявка',
	APPLICATION_RECEIVED_body: '{studentName} хочет выполнить «{taskTitle}».',
	APPLICATION_ACCEPTED_title: 'Заявка принята',
	APPLICATION_ACCEPTED_body: 'Можно приступать к «{taskTitle}» и сдавать решение.',
	APPLICATION_DECLINED_title: 'Заявка отклонена',
	APPLICATION_DECLINED_body: 'Работодатель отклонил заявку на «{taskTitle}».',
	SOLUTION_RECEIVED_title: 'Новое решение',
	SOLUTION_RECEIVED_body: '{studentName} отправил решение по «{taskTitle}».',
	SOLUTION_RESUBMITTED_title: 'Решение доработано',
	SOLUTION_RESUBMITTED_body: '{studentName} прислал доработанное решение по «{taskTitle}».',
	SOLUTION_ACCEPTED_title: 'Решение принято',
	SOLUTION_ACCEPTED_body: 'Ваше решение по «{taskTitle}» принято.',
	SOLUTION_CHANGES_REQUESTED_title: 'Решение возвращено на доработку',
	SOLUTION_CHANGES_REQUESTED_body: 'Посмотрите комментарий работодателя к «{taskTitle}».',
	SOLUTION_REJECTED_title: 'Решение отклонено',
	SOLUTION_REJECTED_body: 'Ваше решение по «{taskTitle}» отклонено.',
	ORGANIZATION_VERIFIED_title: 'Организация подтверждена',
	ORGANIZATION_VERIFIED_body: 'Теперь вы можете публиковать задания.',
	ORGANIZATION_REJECTED_title: 'Организация не прошла проверку',
	ORGANIZATION_REJECTED_body: 'Свяжитесь с администратором платформы, чтобы уточнить причину.',
}

export default defineTranslations({ en, ru })
