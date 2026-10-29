import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { routes } from '@/shared/config'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import type { IPracticeProgress } from '@/entities/practice'
import { SubmissionStatusBadge } from '@/entities/submission'
import { GradeStudentDialog } from '@/features/practice/grade-student'
import { RemoveStudentButton } from '@/features/practice/manage-students'
import { RemovePracticeTaskButton } from '@/features/practice/manage-tasks'

/**
 * Матрица прогресса практики: строки — студенты, колонки — задания.
 * В ячейке — статус решения студента по заданию; в конце строки — итоговая оценка.
 */
export async function PracticeProgressTable({ progress }: { progress: IPracticeProgress }) {
	const t = await getTranslations('PracticeProgress')
	const { practice, tasks, students } = progress
	const columns = tasks.length + 4

	return (
		<section className='flex flex-col gap-3'>
			<h2 className='text-lg font-semibold'>{t('title')}</h2>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{t('student')}</TableHead>
						<TableHead>{t('group')}</TableHead>
						{tasks.map(task => (
							<TableHead key={task.id}>
								<div className='flex items-center gap-1'>
									<Link href={routes.task(task.id)} className='hover:underline'>
										{task.title}
										<span className='block text-xs font-normal text-muted-foreground'>
											{task.companyName}
										</span>
									</Link>
									<RemovePracticeTaskButton
										practiceId={practice.id}
										taskId={task.id}
										taskTitle={task.title}
									/>
								</div>
							</TableHead>
						))}
						<TableHead>{t('grade')}</TableHead>
						<TableHead className='w-0' />
					</TableRow>
				</TableHeader>
				<TableBody>
					{students.length === 0 ? (
						<TableRow>
							<TableCell colSpan={columns} className='text-center text-muted-foreground'>
								{t('empty')}
							</TableCell>
						</TableRow>
					) : (
						students.map(student => (
							<TableRow key={student.id}>
								<TableCell>
									<Link href={routes.studentPortfolio(student.id)} className='hover:underline'>
										{student.name}
									</Link>
								</TableCell>
								<TableCell>{student.group}</TableCell>
								{tasks.map(task => {
									const result = student.results[task.id]
									return (
										<TableCell key={task.id}>
											{result ? (
												<span className='flex items-center gap-1'>
													<SubmissionStatusBadge status={result.status} />
													{result.score !== null && (
														<span className='text-sm text-muted-foreground'>{result.score}</span>
													)}
												</span>
											) : (
												<span className='text-muted-foreground'>—</span>
											)}
										</TableCell>
									)
								})}
								<TableCell>
									<GradeStudentDialog
										practiceId={practice.id}
										studentId={student.id}
										studentName={student.name}
										grade={student.grade}
										comment={student.gradeComment}
									/>
								</TableCell>
								<TableCell>
									<RemoveStudentButton
										practiceId={practice.id}
										studentId={student.id}
										studentName={student.name}
									/>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</section>
	)
}
