import 'server-only'
import { storage, supportsDownloadUrl } from './storage'
import { attachmentHeader } from './types'

/**
 * Ответ со скачиванием файла из хранилища. Вызывать только после проверки прав.
 *
 * S3: редирект на подписанную ссылку (60 с) — файл идёт из хранилища, минуя приложение.
 * Локальный диск: файл отдаётся приложением.
 *
 * В обоих случаях Content-Disposition: attachment — браузер скачивает файл, а не открывает его
 * (архивы и HTML из решений не исполнятся на нашем домене), и nosniff — без угадывания типа.
 */
export async function fileResponse(storageKey: string, fileName: string, mimeType?: string) {
	const contentType = mimeType ?? 'application/octet-stream'

	if (supportsDownloadUrl()) {
		const url = await storage.getDownloadUrl!(storageKey, { fileName, contentType })
		return new Response(null, {
			status: 302,
			headers: { Location: url, 'Cache-Control': 'private, no-store' },
		})
	}

	const data = await storage.get(storageKey)
	if (!data) return new Response('Not Found', { status: 404 })

	return new Response(data as BodyInit, {
		headers: {
			'Content-Type': contentType,
			'Content-Length': String(data.byteLength),
			'Content-Disposition': attachmentHeader(fileName),
			'X-Content-Type-Options': 'nosniff',
			'Cache-Control': 'private, no-store',
		},
	})
}
