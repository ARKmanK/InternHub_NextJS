'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { routes } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { startConversationAction } from '../api/startConversationAction'

type WriteMessageButtonProps = {
	peerId: string
	/** Кому — для подписи и screen reader: «Написать Анне Соколовой» */
	peerName?: string
	size?: 'sm' | 'default'
}

export function WriteMessageButton({ peerId, peerName, size = 'sm' }: WriteMessageButtonProps) {
	const t = useTranslations('StartConversation')
	const tCommon = useTranslations('Common')
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	const open = () =>
		startTransition(async () => {
			const result = await startConversationAction(peerId)
			if (!result.ok) {
				toast.error(tCommon(result.error))
				return
			}
			router.push(routes.conversation(result.data.conversationId))
		})

	return (
		<Button
			variant='outline'
			size={size}
			disabled={isPending}
			onClick={open}
			aria-label={peerName ? t('writeTo', { name: peerName }) : undefined}
		>
			<MessageSquare /> {t('write')}
		</Button>
	)
}
