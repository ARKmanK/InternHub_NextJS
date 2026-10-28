import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { GraduationCap, Plus, User } from 'lucide-react'
import { routes } from '@/shared/config'
import { Button } from '@/shared/ui/button'
import { getUnreadNotifications } from '@/entities/notification/index.server'
import { getCurrentUser } from '@/entities/user/index.server'
import { LangSwitch } from '@/features/lang-switch'
import { NotificationsPopover } from '@/features/notifications'
import { ThemeToggle } from '@/features/theme-toggle'

export async function Header() {
	const t = await getTranslations('Header')
	const user = await getCurrentUser()
	const notifications = user ? await getUnreadNotifications(user.id) : []

	return (
		<header className='sticky top-0 z-40 border-b bg-background/80 backdrop-blur'>
			<div className='mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4'>
				<Link href={routes.home()} className='flex items-center gap-2 font-semibold'>
					<GraduationCap className='size-6' /> {t('brand')}
				</Link>
				<nav className='hidden sm:block'>
					<Button asChild variant='ghost'>
						<Link href={routes.home()}>{t('tasks')}</Link>
					</Button>
				</nav>
				<div className='ml-auto flex items-center gap-2'>
					{user?.role === 'employer' && (
						<Button asChild>
							<Link href={routes.taskCreate()}>
								<Plus /> <span className='hidden sm:inline'>{t('createTask')}</span>
							</Link>
						</Button>
					)}
					{user && <NotificationsPopover notifications={notifications} />}
					<LangSwitch />
					<ThemeToggle />
					<Button asChild variant='outline'>
						<Link href={routes.profile()}>
							<User /> <span className='hidden sm:inline'>{user ? t('profile') : t('login')}</span>
						</Link>
					</Button>
				</div>
			</div>
		</header>
	)
}
