import { Badge } from '@/components/ui/badge'

type TagProps = {
	tagName: string
}

export default function Tag({ tagName }: TagProps) {
	return <Badge>{tagName}</Badge>
}
