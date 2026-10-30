'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { SquarePen } from 'lucide-react'
import { toast } from 'sonner'
import { routes } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { startConversationByEmailAction } from '../api/startConversationAction'

export function StartChatByEmailForm() {
	const t = useTranslations('StartConversation')
	const tCommon = useTranslations('Common')
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [isPending, startTransition] = useTransition()

	const submit = (event: FormEvent) => {
		event.preventDefault()
		startTransition(async () => {
			const result = await startConversationByEmailAction(email)
			if (!result.ok) {
				toast.error(tCommon(result.error))
				return
			}
			setEmail('')
			router.push(routes.conversation(result.data.conversationId))
		})
	}

	return (
		<form onSubmit={submit} className='flex gap-2'>
			<Label htmlFor='start-chat-email' className='sr-only'>
				{t('byEmail')}
			</Label>
			<Input
				id='start-chat-email'
				type='email'
				required
				placeholder={t('byEmail')}
				value={email}
				onChange={event => setEmail(event.target.value)}
			/>
			<Button type='submit' size='icon' disabled={isPending} aria-label={t('start')}>
				<SquarePen />
			</Button>
		</form>
	)
}
