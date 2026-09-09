import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { StoreProvider } from './provider/StoreProvider'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: {
		template: '%s - Intern Hub',
		default: 'Intern Hub',
	},
	description: 'Платформа для поиска задач студенту',
	icons: {
		icon: ['/vercel.svg'],
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='ru' suppressHydrationWarning>
			<body className={`font-nimbus  antialiased`}>
				<main className='w-full min-h-screen flex flex-col items-center'>
					<StoreProvider>
						{children}
						<Toaster />
					</StoreProvider>
				</main>
			</body>
		</html>
	)
}
