import type { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'
import { RealtimeProvider } from '@/shared/lib/realtime'
import { Toaster } from '@/shared/ui/sonner'

type AppProvidersProps = {
	/** Вошедший пользователь: только ему нужно realtime-соединение */
	userId: string | null
	children: ReactNode
}

/** Все провайдеры приложения в одном месте. Сообщения next-intl провайдер берёт с сервера сам. */
export function AppProviders({ userId, children }: AppProvidersProps) {
	return (
		<NextIntlClientProvider>
			<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
				<RealtimeProvider userId={userId}>{children}</RealtimeProvider>
				<Toaster richColors position='bottom-right' />
			</ThemeProvider>
		</NextIntlClientProvider>
	)
}
