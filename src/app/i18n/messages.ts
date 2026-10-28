import { commonTranslations, validationTranslations, type Locale } from '@/shared/i18n'
import { translations as submissionStatus } from '@/entities/submission'
import { translations as taskCard } from '@/entities/task'
import { translations as loginForm } from '@/features/auth/login'
import { translations as registerEmployerForm } from '@/features/auth/register-employer'
import { translations as registerStudentForm } from '@/features/auth/register-student'
import { translations as langSwitch } from '@/features/lang-switch'
import { translations as notifications } from '@/features/notifications'
import { translations as reviewSubmission } from '@/features/submission/review-submission'
import { translations as taskDelete } from '@/features/task/task-delete'
import { translations as taskFilters } from '@/features/task/task-filters'
import { translations as taskForm } from '@/features/task/task-form'
import { translations as taskModeration } from '@/features/task/task-moderation'
import { translations as favoriteButton } from '@/features/task/toggle-favorite'
import { translations as themeToggle } from '@/features/theme-toggle'
import { translations as homePage } from '@/pages/home'
import { translations as notFoundPage } from '@/pages/not-found'
import { translations as authPanel } from '@/widgets/auth-panel'
import { translations as footer } from '@/widgets/footer'
import { translations as header } from '@/widgets/header'
import { translations as profileDashboards } from '@/widgets/profile-dashboards'
import { translations as taskActivity } from '@/widgets/task-activity'
import { translations as tasksFeed } from '@/widgets/tasks-feed'

/**
 * Реестр переводов. Каждый компонент хранит свои строки рядом с собой в translations.ts,
 * а здесь они собираются в один словарь для next-intl: ключ — namespace,
 * который передаётся в useTranslations('...') / getTranslations('...').
 *
 * Добавили новый translations.ts — допишите его сюда одной строкой.
 * Реестр лежит в слое app, потому что только app может импортировать все остальные слои.
 */
const registry = {
	Common: commonTranslations,
	Validation: validationTranslations,
	// entities
	SubmissionStatus: submissionStatus,
	TaskCard: taskCard,
	// features
	LoginForm: loginForm,
	RegisterStudentForm: registerStudentForm,
	RegisterEmployerForm: registerEmployerForm,
	LangSwitch: langSwitch,
	ThemeToggle: themeToggle,
	Notifications: notifications,
	ReviewSubmission: reviewSubmission,
	TaskForm: taskForm,
	TaskDelete: taskDelete,
	TaskFilters: taskFilters,
	TaskModeration: taskModeration,
	FavoriteButton: favoriteButton,
	// widgets
	Header: header,
	Footer: footer,
	AuthPanel: authPanel,
	TasksFeed: tasksFeed,
	TaskActivity: taskActivity,
	ProfileDashboards: profileDashboards,
	// pages
	HomePage: homePage,
	NotFoundPage: notFoundPage,
} as const

type Registry = typeof registry

export type Messages = { [Namespace in keyof Registry]: Registry[Namespace]['ru'] }

export const getMessages = (locale: Locale): Messages =>
	Object.fromEntries(
		Object.entries(registry).map(([namespace, translations]) => [namespace, translations[locale]]),
	) as Messages
