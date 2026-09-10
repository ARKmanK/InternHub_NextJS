import { createServerSupabaseClient } from '@/features/api/supabase/server'
import NotificationClient from './NotificationClient'
import { cookies } from 'next/headers'

export default async function Notifications() {
	const supabase = await createServerSupabaseClient()
	const cookieStore = await cookies()
	const userID = cookieStore.get('userID')?.value

	const { data, error } = await supabase
		.from('notifications')
		.select('*')
		.eq('userId', userID)
		.eq('isRead', false)

	return <NotificationClient initialData={data || []} error={error} />
}
