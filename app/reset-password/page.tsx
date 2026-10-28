import { ResetPasswordPage } from '@/pages/auth'

export default async function Page({ searchParams }: PageProps<'/reset-password'>) {
	const { token } = await searchParams
	return <ResetPasswordPage token={typeof token === 'string' && token ? token : null} />
}
