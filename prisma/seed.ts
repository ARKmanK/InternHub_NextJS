/**
 * Тестовые данные для разработки: `bun run db:seed` (или автоматически после `prisma migrate reset`).
 * Все организации и люди выдуманные. Скрипт идемпотентный: сначала очищает таблицы, потом заполняет заново.
 *
 * Войти можно под любым пользователем — пароль из SEED_PASSWORD (.env.local):
 *   admin@internhub.local, teacher@internhub.local, student1..4@internhub.local, employer1..4@internhub.local
 *   (employer4 — организация «на проверке», её можно подтвердить из кабинета админа).
 */
import { randomUUID } from 'node:crypto'
import nextEnv from '@next/env'
import { PrismaPg } from '@prisma/adapter-pg'
import { hashPassword } from 'better-auth/crypto'
import {
	ApplicationStatus,
	IpTerms,
	NotificationType,
	OrganizationStatus,
	PrismaClient,
	SubmissionFileKind,
	SubmissionStatus,
	TaskDifficulty,
	TaskStatus,
	UserRole,
} from '../src/shared/api/db/generated/client'

nextEnv.loadEnvConfig(process.cwd())

const getSeedPassword = () => {
	const password = process.env.SEED_PASSWORD
	if (!password || password.length < 8) {
		throw new Error('Задайте SEED_PASSWORD (минимум 8 символов) в .env.local — см. .env.example')
	}
	return password
}
const SEED_PASSWORD = getSeedPassword()

const db = new PrismaClient({
	adapter: new PrismaPg({
		connectionString: process.env.DATABASE_URL!,
		max: Number(process.env.DATABASE_POOL_SIZE ?? 10),
	}),
})

const DAY = 24 * 60 * 60 * 1000
const daysAgo = (days: number) => new Date(Date.now() - days * DAY)
const daysFromNow = (days: number) => new Date(Date.now() + days * DAY)

const TAGS = [
	'React',
	'TypeScript',
	'SQL',
	'Python',
	'API',
	'Дизайн',
	'Аналитика',
	'Маркетинг',
	'Машинное обучение',
	'Инженерия',
	'CAD',
	'Тестирование',
]

// Справочник компетенций: code — стабильный ключ, названия на двух языках
const COMPETENCIES = [
	{ code: 'frontend', nameRu: 'Frontend-разработка', nameEn: 'Frontend development' },
	{ code: 'backend', nameRu: 'Backend-разработка', nameEn: 'Backend development' },
	{ code: 'databases', nameRu: 'Проектирование баз данных', nameEn: 'Database design' },
	{ code: 'testing', nameRu: 'Тестирование ПО', nameEn: 'Software testing' },
	{ code: 'ui-design', nameRu: 'UI/UX-дизайн', nameEn: 'UI/UX design' },
	{ code: 'data-analysis', nameRu: 'Анализ данных', nameEn: 'Data analysis' },
	{ code: 'machine-learning', nameRu: 'Машинное обучение', nameEn: 'Machine learning' },
	{ code: 'marketing', nameRu: 'Маркетинг и коммуникации', nameEn: 'Marketing and communications' },
	{ code: 'engineering', nameRu: 'Инженерные расчёты', nameEn: 'Engineering calculations' },
	{ code: 'cad', nameRu: '3D-моделирование и САПР', nameEn: '3D modelling and CAD' },
	{ code: 'documentation', nameRu: 'Техническая документация', nameEn: 'Technical writing' },
]

// Какие компетенции развивает каждое задание (по названию задания)
const TASK_COMPETENCIES: Record<string, string[]> = {
	'Лендинг для сервиса онлайн-записи': ['frontend', 'ui-design'],
	'REST API для учёта заявок': ['backend', 'databases', 'documentation'],
	'Панель мониторинга заказов': ['frontend', 'data-analysis'],
	'Автотесты для формы регистрации': ['testing', 'frontend'],
	'Миграция базы данных интернет-магазина': ['databases'],
	'Анализ эффективности рекламной кампании': ['data-analysis', 'marketing'],
	'Контент-план для соцсетей на месяц': ['marketing'],
	'Сегментация клиентов по истории покупок': ['machine-learning', 'data-analysis'],
	'Редизайн email-рассылки': ['ui-design', 'marketing'],
	'3D-модель кронштейна крепления': ['cad', 'engineering'],
	'Расчёт нагрузки на ленточный конвейер': ['engineering'],
	'Учёт простоев оборудования в таблице': ['data-analysis'],
	'Прогноз отказов по данным датчиков': ['machine-learning', 'data-analysis'],
	'Инструкция по технике безопасности в видео': ['documentation'],
}

async function clear() {
	// Порядок важен: сначала зависимые таблицы
	await db.practiceTask.deleteMany()
	await db.practiceStudent.deleteMany()
	await db.practice.deleteMany()
	await db.submissionStatusChange.deleteMany()
	await db.submissionFile.deleteMany()
	await db.submission.deleteMany()
	await db.application.deleteMany()
	await db.favorite.deleteMany()
	await db.taskStatusChange.deleteMany()
	await db.task.deleteMany()
	await db.tag.deleteMany()
	await db.competency.deleteMany()
	await db.notification.deleteMany()
	await db.employerProfile.deleteMany()
	await db.studentProfile.deleteMany()
	await db.session.deleteMany()
	await db.account.deleteMany()
	await db.verification.deleteMany()
	await db.organization.deleteMany()
	await db.user.deleteMany()
}

async function main() {
	await clear()

	await db.tag.createMany({ data: TAGS.map(name => ({ name })) })
	await db.competency.createMany({ data: COMPETENCIES })

	// ─── Пользователи ─────────────────────────────────────────────────────────
	const admin = await db.user.create({
		data: {
			name: 'Администратор',
			email: 'admin@internhub.local',
			emailVerified: true,
			role: UserRole.ADMIN,
		},
	})

	const teacher = await db.user.create({
		data: {
			name: 'Елена Преподавателева',
			email: 'teacher@internhub.local',
			emailVerified: true,
			role: UserRole.TEACHER,
		},
	})

	const students = await Promise.all(
		[
			// interests — что студент хочет развивать (коды компетенций)
			{
				firstName: 'Анна',
				lastName: 'Соколова',
				group: 'ПМИ-22',
				course: 3,
				interests: ['frontend', 'data-analysis'],
			},
			{ firstName: 'Илья', lastName: 'Ветров', group: 'ПМИ-22', course: 3, interests: ['backend'] },
			{
				firstName: 'Мария',
				lastName: 'Кедрова',
				group: 'ЭК-21',
				course: 4,
				interests: ['marketing'],
			},
			{ firstName: 'Денис', lastName: 'Орлов', group: 'ИВТ-23', course: 2, interests: [] },
		].map(({ interests, ...profile }, index) =>
			db.user.create({
				data: {
					name: `${profile.firstName} ${profile.lastName}`,
					email: `student${index + 1}@internhub.local`,
					emailVerified: true,
					role: UserRole.STUDENT,
					studentProfile: {
						create: { ...profile, interests: { connect: interests.map(code => ({ code })) } },
					},
				},
			}),
		),
	)

	const organizations = await Promise.all(
		[
			{ name: 'ИТ-студия «Северный код»', inn: '3805000001', status: OrganizationStatus.VERIFIED },
			{
				name: 'Агентство «Байкал Маркетинг»',
				inn: '3805000002',
				status: OrganizationStatus.VERIFIED,
			},
			{
				name: 'Завод «Ангара Машиностроение»',
				inn: '3805000003',
				status: OrganizationStatus.VERIFIED,
			},
			{ name: 'Стартап «Лето»', inn: '3805000004', status: OrganizationStatus.PENDING },
		].map(org =>
			db.organization.create({
				data: {
					...org,
					verifiedAt: org.status === OrganizationStatus.VERIFIED ? daysAgo(60) : null,
					verifiedById: org.status === OrganizationStatus.VERIFIED ? admin.id : null,
				},
			}),
		),
	)

	const employers = await Promise.all(
		['Олег Северов', 'Светлана Байкалова', 'Павел Ангарский', 'Кира Летова'].map((name, index) =>
			db.user.create({
				data: {
					name,
					email: `employer${index + 1}@internhub.local`,
					emailVerified: true,
					role: UserRole.EMPLOYER,
					employerProfile: {
						create: {
							organizationId: organizations[index].id,
							position: 'Руководитель направления',
						},
					},
				},
			}),
		),
	)

	// Пароль для входа: запись в accounts с хэшем, как её создаёт Better Auth при регистрации по email
	const passwordHash = await hashPassword(SEED_PASSWORD)
	await db.account.createMany({
		data: [admin, teacher, ...students, ...employers].map(user => ({
			id: randomUUID(),
			accountId: user.id,
			providerId: 'credential',
			userId: user.id,
			password: passwordHash,
		})),
	})

	// ─── Задания ──────────────────────────────────────────────────────────────
	type SeedTask = {
		employer: number
		title: string
		description: string
		expectedResult: string
		criteria: string
		difficulty: TaskDifficulty
		status: TaskStatus
		ipTerms?: IpTerms
		tags: string[]
		publishedDaysAgo?: number
		deadlineInDays?: number
		maxParticipants?: number
	}

	const seedTasks: SeedTask[] = [
		{
			employer: 0,
			title: 'Лендинг для сервиса онлайн-записи',
			description:
				'Свёрстать адаптивный лендинг по готовому макету: шапка, блок преимуществ, тарифы, форма заявки. Форма должна валидировать телефон и email.',
			expectedResult: 'Репозиторий с проектом и ссылка на развёрнутую версию.',
			criteria: 'Соответствие макету, адаптивность, доступность формы, чистота кода.',
			difficulty: TaskDifficulty.EASY,
			status: TaskStatus.PUBLISHED,
			tags: ['React', 'Дизайн'],
			publishedDaysAgo: 2,
			deadlineInDays: 21,
		},
		{
			employer: 0,
			title: 'REST API для учёта заявок',
			description:
				'Спроектировать и реализовать REST API для приёма и обработки заявок клиентов: CRUD, фильтрация, пагинация, авторизация по токену. Описать API в OpenAPI.',
			expectedResult: 'Репозиторий, OpenAPI-спецификация, инструкция по запуску.',
			criteria: 'Корректность HTTP-статусов, валидация данных, тесты, документация.',
			difficulty: TaskDifficulty.MEDIUM,
			status: TaskStatus.PUBLISHED,
			tags: ['API', 'TypeScript', 'SQL'],
			publishedDaysAgo: 5,
			deadlineInDays: 30,
			maxParticipants: 5,
		},
		{
			employer: 0,
			title: 'Панель мониторинга заказов',
			description:
				'Сделать дашборд с графиками заказов по дням, фильтрами по статусу и экспортом в CSV. Данные — из тестового JSON.',
			expectedResult: 'Работающий дашборд и описание принятых решений.',
			criteria: 'Понятность визуализации, производительность на 10 000 записей.',
			difficulty: TaskDifficulty.HARD,
			status: TaskStatus.PUBLISHED,
			tags: ['React', 'TypeScript', 'Аналитика'],
			publishedDaysAgo: 9,
		},
		{
			employer: 0,
			title: 'Автотесты для формы регистрации',
			description:
				'Написать end-to-end тесты для формы регистрации: позитивные сценарии, ошибки валидации, повторная регистрация.',
			expectedResult: 'Набор тестов, запускаемый одной командой, и отчёт.',
			criteria: 'Покрытие сценариев, стабильность тестов, читаемость.',
			difficulty: TaskDifficulty.EASY,
			status: TaskStatus.PUBLISHED,
			tags: ['Тестирование', 'TypeScript'],
			publishedDaysAgo: 12,
			deadlineInDays: 14,
		},
		{
			employer: 0,
			title: 'Миграция базы данных интернет-магазина',
			description:
				'Подготовить скрипты миграции схемы каталога товаров с сохранением данных и сценарий отката.',
			expectedResult: 'SQL-скрипты миграции и отката, описание проверки.',
			criteria: 'Сохранность данных, обратимость, время простоя.',
			difficulty: TaskDifficulty.MEDIUM,
			status: TaskStatus.MODERATION,
			ipTerms: IpTerms.NDA,
			tags: ['SQL'],
		},
		{
			employer: 1,
			title: 'Анализ эффективности рекламной кампании',
			description:
				'По выгрузке данных рекламной кампании посчитать ключевые метрики (CTR, CPA, ROMI), найти неэффективные каналы и предложить перераспределение бюджета.',
			expectedResult: 'Отчёт с расчётами и выводами (PDF или ноутбук).',
			criteria: 'Корректность расчётов, обоснованность выводов, наглядность.',
			difficulty: TaskDifficulty.MEDIUM,
			status: TaskStatus.PUBLISHED,
			ipTerms: IpTerms.PORTFOLIO_ONLY,
			tags: ['Аналитика', 'Маркетинг', 'Python'],
			publishedDaysAgo: 3,
			deadlineInDays: 10,
		},
		{
			employer: 1,
			title: 'Контент-план для соцсетей на месяц',
			description:
				'Составить контент-план для аккаунта кофейни: рубрики, частота, примеры постов, KPI для оценки.',
			expectedResult: 'Таблица контент-плана и 5 примеров постов.',
			criteria: 'Соответствие аудитории, реалистичность, измеримость KPI.',
			difficulty: TaskDifficulty.EASY,
			status: TaskStatus.PUBLISHED,
			tags: ['Маркетинг'],
			publishedDaysAgo: 7,
		},
		{
			employer: 1,
			title: 'Сегментация клиентов по истории покупок',
			description:
				'Кластеризовать клиентов по RFM-признакам, описать сегменты и предложить маркетинговые действия для каждого.',
			expectedResult: 'Ноутбук с кодом и презентация с выводами.',
			criteria: 'Качество кластеризации, интерпретируемость сегментов.',
			difficulty: TaskDifficulty.HARD,
			status: TaskStatus.PUBLISHED,
			tags: ['Машинное обучение', 'Python', 'Аналитика'],
			publishedDaysAgo: 15,
			deadlineInDays: 45,
		},
		{
			employer: 1,
			title: 'Редизайн email-рассылки',
			description:
				'Предложить новый шаблон еженедельной рассылки, который корректно отображается в популярных почтовых клиентах.',
			expectedResult: 'HTML-шаблон и скриншоты из почтовых клиентов.',
			criteria: 'Кроссклиентность, читаемость, конверсия в клик.',
			difficulty: TaskDifficulty.EASY,
			status: TaskStatus.CLOSED,
			tags: ['Дизайн', 'Маркетинг'],
			publishedDaysAgo: 40,
		},
		{
			employer: 2,
			title: '3D-модель кронштейна крепления',
			description:
				'По эскизу разработать 3D-модель кронштейна, подготовить чертёж для производства и оценить массу детали.',
			expectedResult: 'Файл модели, чертёж в PDF, расчёт массы.',
			criteria: 'Соответствие эскизу и ЕСКД, технологичность.',
			difficulty: TaskDifficulty.MEDIUM,
			status: TaskStatus.PUBLISHED,
			ipTerms: IpTerms.NDA,
			tags: ['Инженерия', 'CAD'],
			publishedDaysAgo: 4,
			deadlineInDays: 20,
			maxParticipants: 3,
		},
		{
			employer: 2,
			title: 'Расчёт нагрузки на ленточный конвейер',
			description:
				'Рассчитать требуемую мощность привода и натяжение ленты для заданных параметров конвейера, подобрать двигатель из каталога.',
			expectedResult: 'Пояснительная записка с расчётами.',
			criteria: 'Правильность расчётов, обоснование выбора.',
			difficulty: TaskDifficulty.HARD,
			status: TaskStatus.PUBLISHED,
			tags: ['Инженерия'],
			publishedDaysAgo: 11,
		},
		{
			employer: 2,
			title: 'Учёт простоев оборудования в таблице',
			description:
				'Сделать шаблон для учёта простоев станков: ввод причин, автоматический подсчёт длительности и сводка по сменам.',
			expectedResult: 'Шаблон таблицы и инструкция для мастеров.',
			criteria: 'Удобство ввода, корректность сводки.',
			difficulty: TaskDifficulty.EASY,
			status: TaskStatus.PUBLISHED,
			tags: ['Аналитика'],
			publishedDaysAgo: 18,
			deadlineInDays: 7,
		},
		{
			employer: 2,
			title: 'Прогноз отказов по данным датчиков',
			description:
				'По историческим данным вибродатчиков построить модель, предсказывающую отказ подшипника за 48 часов.',
			expectedResult: 'Модель, метрики качества, описание признаков.',
			criteria: 'Recall на отказах, объяснимость модели.',
			difficulty: TaskDifficulty.HARD,
			status: TaskStatus.PUBLISHED,
			ipTerms: IpTerms.PORTFOLIO_ONLY,
			tags: ['Машинное обучение', 'Python'],
			publishedDaysAgo: 22,
			deadlineInDays: 60,
		},
		{
			employer: 2,
			title: 'Инструкция по технике безопасности в видео',
			description: 'Черновик: сценарий короткого обучающего ролика для новых сотрудников цеха.',
			expectedResult: 'Сценарий и раскадровка.',
			criteria: 'Понятность, соответствие требованиям охраны труда.',
			difficulty: TaskDifficulty.EASY,
			status: TaskStatus.DRAFT,
			tags: [],
		},
	]

	const tasks = []
	for (const task of seedTasks) {
		const author = employers[task.employer]
		const created = await db.task.create({
			data: {
				title: task.title,
				description: task.description,
				expectedResult: task.expectedResult,
				criteria: task.criteria,
				difficulty: task.difficulty,
				status: task.status,
				ipTerms: task.ipTerms ?? IpTerms.OPEN,
				requireRepository: (task.ipTerms ?? IpTerms.OPEN) === IpTerms.OPEN,
				maxParticipants: task.maxParticipants ?? null,
				deadline: task.deadlineInDays ? daysFromNow(task.deadlineInDays) : null,
				organizationId: organizations[task.employer].id,
				authorId: author.id,
				publishedAt: task.publishedDaysAgo ? daysAgo(task.publishedDaysAgo) : null,
				createdAt: daysAgo((task.publishedDaysAgo ?? 0) + 2),
				tags: { connect: task.tags.map(name => ({ name })) },
				competencies: {
					connect: (TASK_COMPETENCIES[task.title] ?? []).map(code => ({ code })),
				},
			},
		})

		// История статусов: как задание дошло до текущего состояния
		const history: { from: TaskStatus | null; to: TaskStatus; by: string; daysAgo: number }[] = [
			{
				from: null,
				to: TaskStatus.DRAFT,
				by: author.id,
				daysAgo: (task.publishedDaysAgo ?? 0) + 2,
			},
		]
		if (task.status !== TaskStatus.DRAFT) {
			history.push({
				from: TaskStatus.DRAFT,
				to: TaskStatus.MODERATION,
				by: author.id,
				daysAgo: (task.publishedDaysAgo ?? 0) + 1,
			})
		}
		if (task.publishedDaysAgo !== undefined) {
			history.push({
				from: TaskStatus.MODERATION,
				to: TaskStatus.PUBLISHED,
				by: admin.id,
				daysAgo: task.publishedDaysAgo,
			})
		}
		if (task.status === TaskStatus.CLOSED) {
			history.push({ from: TaskStatus.PUBLISHED, to: TaskStatus.CLOSED, by: author.id, daysAgo: 5 })
		}
		await db.taskStatusChange.createMany({
			data: history.map(item => ({
				taskId: created.id,
				fromStatus: item.from,
				toStatus: item.to,
				changedById: item.by,
				createdAt: daysAgo(item.daysAgo),
			})),
		})

		tasks.push(created)
	}

	// ─── Избранное, заявки, решения ───────────────────────────────────────────
	const [landing, restApi, dashboard, , , adAnalysis] = tasks

	await db.favorite.createMany({
		data: [
			{ studentId: students[0].id, taskId: landing.id },
			{ studentId: students[0].id, taskId: restApi.id },
			{ studentId: students[1].id, taskId: restApi.id },
			{ studentId: students[1].id, taskId: dashboard.id },
			{ studentId: students[2].id, taskId: adAnalysis.id },
			{ studentId: students[3].id, taskId: landing.id },
		],
	})

	await db.application.createMany({
		data: [
			{ taskId: landing.id, studentId: students[0].id, status: ApplicationStatus.ACCEPTED },
			{ taskId: restApi.id, studentId: students[1].id, status: ApplicationStatus.ACCEPTED },
			{ taskId: restApi.id, studentId: students[0].id, status: ApplicationStatus.ACCEPTED },
			{ taskId: adAnalysis.id, studentId: students[2].id, status: ApplicationStatus.ACCEPTED },
			{ taskId: landing.id, studentId: students[3].id, status: ApplicationStatus.PENDING },
		],
	})

	type SeedSubmission = {
		task: (typeof tasks)[number]
		student: (typeof students)[number]
		status: SubmissionStatus
		repositoryUrl?: string
		score?: number
		reviewComment?: string
		submittedDaysAgo: number
	}

	const seedSubmissions: SeedSubmission[] = [
		{
			task: landing,
			student: students[0],
			status: SubmissionStatus.ACCEPTED,
			repositoryUrl: 'https://github.com/example/landing-booking',
			score: 5,
			reviewComment: 'Отличная вёрстка, всё по макету. Форма работает аккуратно.',
			submittedDaysAgo: 1,
		},
		{
			task: restApi,
			student: students[1],
			status: SubmissionStatus.CHANGES_REQUESTED,
			repositoryUrl: 'https://github.com/example/requests-api',
			reviewComment: 'Не хватает тестов и пагинации в списке заявок.',
			submittedDaysAgo: 2,
		},
		{
			task: restApi,
			student: students[0],
			status: SubmissionStatus.SUBMITTED,
			repositoryUrl: 'https://github.com/example/requests-api-2',
			submittedDaysAgo: 1,
		},
		{
			task: adAnalysis,
			student: students[2],
			status: SubmissionStatus.SUBMITTED,
			submittedDaysAgo: 1,
		},
	]

	for (const item of seedSubmissions) {
		const submission = await db.submission.create({
			data: {
				taskId: item.task.id,
				studentId: item.student.id,
				status: item.status,
				repositoryUrl: item.repositoryUrl ?? null,
				comment: 'Решение во вложении, готов ответить на вопросы.',
				score: item.score ?? null,
				reviewComment: item.reviewComment ?? null,
				submittedAt: daysAgo(item.submittedDaysAgo),
				reviewedAt: item.reviewComment ? daysAgo(0) : null,
			},
		})

		if (!item.repositoryUrl) {
			await db.submissionFile.create({
				data: {
					submissionId: submission.id,
					kind: SubmissionFileKind.ARCHIVE,
					storageKey: `submissions/${submission.id}/report.zip`,
					fileName: 'report.zip',
					mimeType: 'application/zip',
					sizeBytes: 2_340_000,
				},
			})
		}

		const history: { from: SubmissionStatus | null; to: SubmissionStatus; by: string }[] = [
			{ from: null, to: SubmissionStatus.SUBMITTED, by: item.student.id },
		]
		if (item.status !== SubmissionStatus.SUBMITTED) {
			history.push({ from: SubmissionStatus.SUBMITTED, to: item.status, by: item.task.authorId })
		}
		await db.submissionStatusChange.createMany({
			data: history.map(change => ({
				submissionId: submission.id,
				fromStatus: change.from,
				toStatus: change.to,
				changedById: change.by,
				comment: change.to === item.status ? (item.reviewComment ?? null) : null,
			})),
		})
	}

	// ─── Практика: группа ПМИ-22 (student1, student2) и два опубликованных задания ───
	const practice = await db.practice.create({
		data: {
			title: 'Учебная практика ПМИ-22',
			description: 'Выполнить два задания от партнёров платформы. Оценка — по принятым решениям.',
			teacherId: teacher.id,
			startsAt: daysAgo(14),
			endsAt: daysFromNow(30),
			students: { create: [{ studentId: students[0].id }, { studentId: students[1].id }] },
			tasks: { create: [{ taskId: landing.id }, { taskId: restApi.id }] },
		},
	})

	// ─── Уведомления ──────────────────────────────────────────────────────────
	const [, , , , migration] = tasks
	await db.notification.createMany({
		data: [
			{
				userId: students[0].id,
				type: NotificationType.SOLUTION_ACCEPTED,
				params: { taskTitle: landing.title },
				link: `/tasks/${landing.id}`,
			},
			{
				userId: students[1].id,
				type: NotificationType.SOLUTION_CHANGES_REQUESTED,
				params: {
					taskTitle: restApi.title,
					comment: 'Не хватает тестов и пагинации в списке заявок.',
				},
				link: `/tasks/${restApi.id}`,
			},
			{
				userId: employers[0].id,
				type: NotificationType.SOLUTION_RECEIVED,
				params: { taskTitle: restApi.title, studentName: students[0].name },
				link: `/tasks/${restApi.id}`,
			},
			...students.slice(0, 2).map(student => ({
				userId: student.id,
				type: NotificationType.PRACTICE_ADDED,
				params: { practiceTitle: practice.title },
				link: '/profile',
			})),
			{
				userId: admin.id,
				type: NotificationType.TASK_ON_MODERATION,
				params: { taskTitle: migration.title },
				link: `/tasks/${migration.id}`,
			},
		],
	})

	console.log(
		`Готово: ${students.length} студента, ${employers.length} работодателя, ${tasks.length} заданий, ${seedSubmissions.length} решения.`,
	)
}

main()
	.catch(error => {
		console.error(error)
		process.exitCode = 1
	})
	.finally(() => db.$disconnect())
