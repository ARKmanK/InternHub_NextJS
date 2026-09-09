import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from '@/components/ui/popover'
import NotificationSkeleton from '@/entities/notification/ui/NotificationSkeleton'
import { createServerClient } from '@/shared/api/supabaseClient'
import { BellIcon } from 'lucide-react'
import { cookies } from 'next/headers'
import { toast } from 'sonner'
import NotificationClient from './NotificationClient'

export default async function Notifications() {
	const supabase = await createServerClient()
	const cookieStore = await cookies()
	const userID = cookieStore.get('userID')?.value

	const { data, error } = await supabase
		.from('notifications')
		.select('*')
		.eq('userId', userID)
		.eq('isRead', false)

	return <NotificationClient initialData={data || []} error={error} />
}
