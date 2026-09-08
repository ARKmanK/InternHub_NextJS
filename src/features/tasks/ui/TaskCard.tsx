import { memo } from 'react'
import { ITask } from '../types/ITask'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLegend } from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import { Delete, DeleteIcon, Edit, Edit2, Link, Settings } from 'lucide-react'

type TaskCardProps = {
	data: ITask
	role?: string
}

function TaskCard({ data, role }: TaskCardProps) {
	return (
		<Card>
			<CardHeader>
				<Field orientation={'horizontal'}>
					<FieldGroup>
						<FieldLegend>Сейчас отслеживают: {data.trackingNumber}</FieldLegend>
						{role === 'employer' && (
							<ButtonGroup>
								<Button className='bg-blue-600'>
									Edit <Settings />
								</Button>
								<Button className='bg-red-600'>
									Delete <Delete />
								</Button>
							</ButtonGroup>
						)}
					</FieldGroup>
					<ButtonGroup>
						<Button variant='outline'>
							Edit <Edit />
						</Button>
						<Button variant='outline'>
							Delete data <DeleteIcon />
						</Button>
					</ButtonGroup>
				</Field>
				<CardTitle>{data.title}</CardTitle>
				<CardDescription>{data.description}</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Срок до: {data.deadline && <p>Неограниченно</p>}</p>
				<p className='flex flex-col'>
					Сложность
					{'*'.repeat(data.difficulty)}
				</p>
				<div className='w-full flex justify-between'>
					<Link href='/data'>На страницу задачи</Link>
					<p>{data.companyName}</p>
				</div>
			</CardContent>
		</Card>
	)
}

export default memo(TaskCard)
