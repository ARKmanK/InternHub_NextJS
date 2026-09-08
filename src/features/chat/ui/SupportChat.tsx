'use client'

import { useState } from 'react'
import {
	MessageScroller,
	MessageScrollerButton,
	MessageScrollerContent,
	MessageScrollerProvider,
	MessageScrollerViewport,
} from '@/components/ui/message-scroller'
import { Message } from '@/components/ui/message'

export function SupportChat() {
	const [messages, setMessages] = useState([
		{ id: 1, role: 'user', content: 'Привет!' },
		{ id: 2, role: 'assistant', content: 'Здравствуйте! Чем могу помочь?' },
	])

	return (
		<MessageScrollerProvider>
			<div className='h-96 w-full'>
				<MessageScroller>
					<MessageScrollerViewport>
						<MessageScrollerContent>
							{messages.map(msg => (
								<Message key={msg.id} align={msg.role === 'user' ? 'end' : 'start'}>
									{msg.content}
								</Message>
							))}
						</MessageScrollerContent>
					</MessageScrollerViewport>
					<MessageScrollerButton />
				</MessageScroller>
			</div>
		</MessageScrollerProvider>
	)
}
