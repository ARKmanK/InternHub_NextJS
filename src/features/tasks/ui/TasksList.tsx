import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Field, FieldLegend } from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import { DeleteIcon, Edit } from 'lucide-react'
import Link from 'next/link'
import { ITask } from '../types/ITask'

type TasksListProps = {
	list: ITask[]
}

export default function TasksList({ list }: TasksListProps) {
	return (
		<article className='flex flex-col'>
			{list.map(task => (
				<Card>
					<CardHeader>
						<Field orientation={'horizontal'}>
							<FieldLegend>Сейчас отслеживают: {task.trackingNumber}</FieldLegend>
							<ButtonGroup>
								<Button variant='outline'>
									Edit <Edit />
								</Button>
								<Button variant='outline'>
									Delete task <DeleteIcon />
								</Button>
							</ButtonGroup>
						</Field>
						<CardTitle>{task.title}</CardTitle>
						<CardDescription>{task.description}</CardDescription>
					</CardHeader>
					<CardContent>
						<p>Срок до: {task.deadline && <p>Неограниченно</p>}</p>
						<p className='flex flex-col'>
							Сложность
							{'*'.repeat(task.difficulty)}
						</p>
						<div className='w-full flex justify-between'>
							<Link href='/task'>На страницу задачи</Link>
							<p>{task.companyName}</p>
						</div>
					</CardContent>
				</Card>
			))}
		</article>
	)
}
