import { Avatar, AvatarFallback } from '@/shared/ui/avatar'

/** Инициалы собеседника: «Анна Соколова» → «АС». */
const initials = (name: string) =>
	name
		.split(/\s+/)
		.slice(0, 2)
		.map(word => word[0]?.toUpperCase() ?? '')
		.join('')

export function PeerAvatar({ name }: { name: string }) {
	return (
		<Avatar aria-hidden>
			<AvatarFallback>{initials(name)}</AvatarFallback>
		</Avatar>
	)
}
