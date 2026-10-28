import 'server-only'
import { storage } from './storage'

/**
 * Ответ со скачиванием файла из хранилища.
 * Content-Disposition: attachment — браузер скачивает файл, а не открывает его (архивы и HTML из решений не исполнятся на нашем домене).
 * nosniff — браузер не будет угадывать тип содержимого.
 */
export async function fileResponse(storageKey: string, fileName: string, mimeType?: string) {
	const data = await storage.get(storageKey)
	if (!data) return new Response('Not Found', { status: 404 })

	return new Response(data as BodyInit, {
		headers: {
			'Content-Type': mimeType ?? 'application/octet-stream',
			'Content-Length': String(data.byteLength),
			'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
			'X-Content-Type-Options': 'nosniff',
			'Cache-Control': 'private, no-store',
		},
	})
}
