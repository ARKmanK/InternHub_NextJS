'use client'

import { useOptimistic, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { toggleFavoriteAction } from '../api/toggleFavoriteAction'

type FavoriteButtonProps = {
	taskId: number
	isFavorite: boolean
}

/** Сердечко меняется сразу (optimistic UI) и откатывается, если сервер вернул ошибку. */
export function FavoriteButton({ taskId, isFavorite }: FavoriteButtonProps) {
	const t = useTranslations('FavoriteButton')
	const tCommon = useTranslations('Common')
	const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(isFavorite)
	const [isPending, startTransition] = useTransition()

	const handleClick = () =>
		startTransition(async () => {
			setOptimisticFavorite(!optimisticFavorite)
			const result = await toggleFavoriteAction(taskId, !optimisticFavorite)
			if (!result.ok) toast.error(tCommon(result.error))
		})

	return (
		<Button
			variant='ghost'
			size='icon'
			disabled={isPending}
			aria-pressed={optimisticFavorite}
			aria-label={optimisticFavorite ? t('remove') : t('add')}
			onClick={handleClick}
		>
			<Heart className={optimisticFavorite ? 'fill-red-500 text-red-500' : undefined} />
		</Button>
	)
}
