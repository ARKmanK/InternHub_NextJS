import { useFormatter } from 'next-intl'
import { cn } from 'cn'
import type { IMessage } from '../model/IConversation'

type MessageBubbleProps = {
	message: Pick<IMessage, 'text' | 'createdAt'>
	/** Своё сообщение — справа и другим цветом */
	isOwn: boolean
	/** Ещё не подтверждено сервером */
	isPending?: boolean
}

export function MessageBubble({ message, isOwn, isPending = false }: MessageBubbleProps) {
	const format = useFormatter()

	return (
		<div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
			<div
				className={cn(
					'max-w-[80%] rounded-2xl px-3 py-2 text-sm',
					isOwn ? 'rounded-br-sm bg-primary text-primary-foreground' : 'rounded-bl-sm bg-muted',
					isPending && 'opacity-60',
				)}
			>
				{/* Текст выводится как текст (React экранирует), переносы строк сохраняются */}
				<p className='break-words whitespace-pre-wrap'>{message.text}</p>
				<time
					dateTime={message.createdAt}
					className={cn(
						'mt-1 block text-right text-[11px]',
						isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground',
					)}
				>
					{format.dateTime(new Date(message.createdAt), { hour: '2-digit', minute: '2-digit' })}
				</time>
			</div>
		</div>
	)
}
