'use client'

import { useState, useTransition, type FormEvent, type KeyboardEvent } from 'react'
import { useTranslations } from 'next-intl'
import { SendHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { MESSAGE_MAX_LENGTH, type IMessage } from '@/entities/conversation'
import { sendMessageAction } from '../api/sendMessageAction'

type MessageComposerProps = {
	conversationId: number
	/** Сервер сохранил сообщение — можно показать его, не дожидаясь события по WebSocket */
	onSent: (message: IMessage) => void
}

/** Поле ввода: Enter — отправить, Shift+Enter — новая строка. */
export function MessageComposer({ conversationId, onSent }: MessageComposerProps) {
	const t = useTranslations('SendMessage')
	const tCommon = useTranslations('Common')
	const [text, setText] = useState('')
	const [isPending, startTransition] = useTransition()
	const canSend = text.trim().length > 0 && !isPending

	const send = () => {
		if (!canSend) return
		const value = text
		startTransition(async () => {
			const result = await sendMessageAction(conversationId, value)
			if (!result.ok) {
				toast.error(tCommon(result.error))
				return
			}
			setText(current => (current === value ? '' : current))
			onSent(result.data)
		})
	}

	const onSubmit = (event: FormEvent) => {
		event.preventDefault()
		send()
	}

	const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		// isComposing — ввод через IME (китайский, японский): Enter подтверждает символ, а не отправляет
		if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
			event.preventDefault()
			send()
		}
	}

	return (
		<form onSubmit={onSubmit} className='flex items-end gap-2 border-t pt-3'>
			<Label htmlFor={`composer-${conversationId}`} className='sr-only'>
				{t('label')}
			</Label>
			<Textarea
				id={`composer-${conversationId}`}
				value={text}
				onChange={event => setText(event.target.value)}
				onKeyDown={onKeyDown}
				placeholder={t('placeholder')}
				maxLength={MESSAGE_MAX_LENGTH}
				rows={1}
				className='max-h-40 min-h-10 resize-none'
			/>
			<Button type='submit' size='icon' disabled={!canSend} aria-label={t('send')}>
				<SendHorizontal />
			</Button>
		</form>
	)
}
