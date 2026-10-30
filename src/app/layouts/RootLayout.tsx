import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import { getCurrentUser } from '@/entities/user/index.server'
import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'
import { AppProviders } from './AppProviders'
import '../styles/globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin', 'cyrillic'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin', 'cyrillic'] })

export const rootMetadata: Metadata = {
	title: { template: '%s — InternHub', default: 'InternHub' },
	description: 'Платформа проектного взаимодействия студентов и работодателей',
}

export async function RootLayout({ children }: { children: ReactNode }) {
	const [locale, user] = await Promise.all([getLocale(), getCurrentUser()])

	return (
		// Переменные шрифтов — на <html>: font-sans применяется к нему (globals.css), и переменная должна быть видна там
		<html
			lang={locale}
			className={`${geistSans.variable} ${geistMono.variable}`}
			suppressHydrationWarning
		>
			<body className='antialiased'>
				<AppProviders userId={user?.id ?? null}>
					<div className='flex min-h-screen flex-col'>
						<Header />
						<main className='mx-auto w-full max-w-6xl flex-1 px-4 py-8'>{children}</main>
						<Footer />
					</div>
				</AppProviders>
			</body>
		</html>
	)
}
