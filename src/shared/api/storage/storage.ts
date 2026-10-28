import 'server-only'
import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, extname, resolve, sep } from 'node:path'

/**
 * Хранилище файлов: архивы с материалами заданий, архивы и скриншоты решений.
 *
 * В базе хранится только ключ (`tasks/12/3f1c….zip`), сам файл — здесь. Наружу файлы не раздаются
 * напрямую: скачивание идёт через route handler, который сначала проверяет права (требование S-5).
 *
 * Сейчас реализован локальный драйвер (папка на диске) — для разработки и одного сервера.
 * TODO(этап 7): S3-совместимый драйвер с тем же интерфейсом для production (выбор по переменной окружения).
 */
export interface FileStorage {
	put(key: string, data: Uint8Array): Promise<void>
	get(key: string): Promise<Uint8Array | null>
	delete(key: string): Promise<void>
}

const STORAGE_DIR = resolve(process.cwd(), process.env.STORAGE_DIR ?? '.storage')

/** Путь внутри папки хранилища. Ключи генерирует сервер, но проверяем, что `..` не выведет за её пределы. */
const toPath = (key: string) => {
	const path = resolve(STORAGE_DIR, key)
	if (!path.startsWith(STORAGE_DIR + sep)) throw new Error(`Недопустимый ключ файла: ${key}`)
	return path
}

const localStorage: FileStorage = {
	async put(key, data) {
		const path = toPath(key)
		await mkdir(dirname(path), { recursive: true })
		await writeFile(path, data)
	},
	async get(key) {
		const path = toPath(key)
		const exists = await stat(path).catch(() => null)
		return exists?.isFile() ? new Uint8Array(await readFile(path)) : null
	},
	async delete(key) {
		await rm(toPath(key), { force: true })
	},
}

export const storage: FileStorage = localStorage

/**
 * Сохраняет загруженный файл под новым ключом и возвращает ключ.
 * Имя файла пользователя в ключ не попадает (только расширение): так нельзя подобрать путь или перезаписать чужой файл.
 */
export async function saveUpload(file: File, prefix: string): Promise<string> {
	const key = `${prefix}/${randomUUID()}${extname(file.name).toLowerCase()}`
	await storage.put(key, new Uint8Array(await file.arrayBuffer()))
	return key
}
