import { ResetPasswordForm } from '@/features/auth/reset-password'

type ResetPasswordPageProps = {
	/** Better Auth перенаправляет сюда с ?token=... или с ?error=INVALID_TOKEN */
	token: string | null
}

export function ResetPasswordPage({ token }: ResetPasswordPageProps) {
	return (
		<div className='mx-auto w-full max-w-md py-8'>
			<ResetPasswordForm token={token} />
		</div>
	)
}
