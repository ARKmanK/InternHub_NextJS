'use client'

import { Button } from '@/components/ui/button'
import z from 'zod'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createServerClient } from '@/shared/api/supabaseClient'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = (taskTitle: string) =>
	z.object({
		confirmText: z.string().refine(value => value === taskTitle, {
			message: `Введите "${taskTitle}" для подтверждения`,
		}),
	})

type TaskDeleteFormProps = {
	taskId: number
}

export default async function TaskDeleteForm({ taskId }: TaskDeleteFormProps) {
	const supabase = await createServerClient()

	const taskTitle = '1'

	const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
		resolver: zodResolver(formSchema(taskTitle)),
		mode: 'onSubmit',
	})

	const isValid = form.formState.isValid

	const onSubmit = async (data: { confirmText: string }) => {
		//deleteTask(taskId)
		//------------------------Send data------------------------//
		form.reset()
	}

	return (
		<Dialog>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Controller
					name='confirmText'
					control={form.control}
					render={({ field, fieldState }) => (
						<>
							<DialogTrigger>Delete Task</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Are you absolutely sure?</DialogTitle>
									<DialogDescription>
										This action cannot be undone. This will permanently delete your task and remove
										your data from our servers. Type {taskTitle} to confirm delete
									</DialogDescription>
								</DialogHeader>
								<Input {...field} aria-invalid={fieldState.invalid} autoComplete='off' />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								<DialogFooter>
									<DialogClose>
										<Button>Cancel</Button>
									</DialogClose>
									<Button type='submit' variant='destructive' disabled={!isValid}>
										Delete
									</Button>
								</DialogFooter>
							</DialogContent>
						</>
					)}
				/>
			</form>
		</Dialog>
	)
}
