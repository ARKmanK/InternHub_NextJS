'use client'

import { memo } from 'react'
import { ITask } from '../../../entities/task/model/ITask'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup } from '@/components/ui/field'
import { ButtonGroup } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'

type VerifyTaskCardProps = {
	data: ITask
}

function VerifyTaskCard({ data }: VerifyTaskCardProps) {
	const handleApproval = () => {
		alert('approved')
	}

	const handleReject = () => {
		alert('rejected')
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{data.title}</CardTitle>
				<CardDescription>{data.description}</CardDescription>
			</CardHeader>
			<CardContent>
				<p>Срок до: {data.deadline && <p>Неограниченно</p>}</p>
				<p>{data.companyName}</p>
				<div className='flex space-x-3'>
					{data.tags?.map((tag, index) => (
						<p key={index}>{tag}</p>
					))}
				</div>
				<Field>
					<FieldGroup>
						<ButtonGroup>
							<Button onClick={() => handleApproval}>Approve</Button>
							<Button onClick={() => handleReject}>Reject</Button>
						</ButtonGroup>
					</FieldGroup>
				</Field>
			</CardContent>
		</Card>
	)
}

export default memo(VerifyTaskCard)
