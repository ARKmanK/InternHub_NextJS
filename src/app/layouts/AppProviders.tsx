import type { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/shared/ui/sonner'

/** Все провайдеры приложения в одном месте. Сообщения next-intl провайдер берёт с сервера сам. */
export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<NextIntlClientProvider>
			<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
				{children}
				<Toaster richColors position='bottom-right' />
			</ThemeProvider>
		</NextIntlClientProvider>
	)
}
