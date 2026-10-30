import 'server-only'
import { randomUUID } from 'node:crypto'
import { extname } from 'node:path'
import { createLocalStorage } from './localStorage'
import { createS3Storage } from './s3Storage'
import type { FileStorage } from './types'

/**
 * Драйвер выбирается переменной STORAGE_DRIVER: `local` (по умолчанию, папка STORAGE_DIR)
 * или `s3` (переменные S3_*). Код приложения работает только с интерфейсом FileStorage.
 *
 * Наружу файлы напрямую не раздаются: скачивание идёт через route handler,
 * который сначала проверяет права (требование S-5).
 */
function createStorage(): FileStorage {
	const driver = process.env.STORAGE_DRIVER ?? 'local'
	if (driver === 'local') return createLocalStorage(process.env.STORAGE_DIR ?? '.storage')
	if (driver !== 's3') throw new Error(`Неизвестный STORAGE_DRIVER: ${driver}`)

	const required = [
		'S3_ENDPOINT',
		'S3_REGION',
		'S3_BUCKET',
		'S3_ACCESS_KEY_ID',
		'S3_SECRET_ACCESS_KEY',
	]
	const missing = required.filter(name => !process.env[name])
	if (missing.length > 0) throw new Error(`Для STORAGE_DRIVER=s3 не заданы: ${missing.join(', ')}`)

	return createS3Storage({
		endpoint: process.env.S3_ENDPOINT!,
		region: process.env.S3_REGION!,
		bucket: process.env.S3_BUCKET!,
		accessKeyId: process.env.S3_ACCESS_KEY_ID!,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
	})
}

let instance: FileStorage | undefined
// Драйвер создаётся при первом обращении, а не при импорте: сборке (next build) ключи S3 не нужны
const current = () => (instance ??= createStorage())

export const storage: FileStorage = {
	put: (key, data, contentType) => current().put(key, data, contentType),
	get: key => current().get(key),
	delete: key => current().delete(key),
	getDownloadUrl: (key, download) => {
		const driver = current()
		if (!driver.getDownloadUrl) throw new Error('Драйвер не выдаёт ссылки на скачивание')
		return driver.getDownloadUrl(key, download)
	},
}

/** Умеет ли текущий драйвер отдавать файлы ссылкой (S3), или их нужно пропускать через приложение. */
export const supportsDownloadUrl = () => Boolean(current().getDownloadUrl)

/**
 * Сохраняет загруженный файл под новым ключом и возвращает ключ.
 * Имя файла пользователя в ключ не попадает (только расширение): так нельзя подобрать путь или перезаписать чужой файл.
 */
export async function saveUpload(file: File, prefix: string): Promise<string> {
	const key = `${prefix}/${randomUUID()}${extname(file.name).toLowerCase()}`
	await storage.put(key, new Uint8Array(await file.arrayBuffer()), file.type || undefined)
	return key
}
