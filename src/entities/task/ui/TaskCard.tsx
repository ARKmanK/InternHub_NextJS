import { memo } from 'react'
import { ITask } from '../model/ITask'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLegend } from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import { Delete, DeleteIcon, Edit, Edit2, Link, Settings } from 'lucide-react'

type TaskCardProps = {
	data: ITask
	onEdit?: React.ReactNode
	onDelete?: React.ReactNode
	onFavorite?: React.ReactNode
}

function TaskCard({ data, onEdit, onDelete, onFavorite }: TaskCardProps) {
	return (
		<Card>
			<CardHeader>
				<Field orientation={'horizontal'}>
					<FieldGroup>
						<FieldLegend>Сейчас отслеживают: {data.trackingNumber}</FieldLegend>
						{onEdit && onEdit}
						{onDelete && onDelete}
						{onFavorite && onFavorite}
					</FieldGroup>
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
