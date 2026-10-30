import 'server-only'
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'
import type { FileStorage } from './types'

/** Локальный драйвер: папка на диске. Для разработки и одного сервера без S3. */
export function createLocalStorage(dir: string): FileStorage {
	// Относительный путь считается от рабочей папки процесса. Не resolve(process.cwd(), dir): такую запись
	// трассировка файлов при сборке понимает как «нужна вся папка проекта» и копирует её в standalone-образ
	const root = resolve(dir)

	/** Путь внутри папки хранилища. Ключи генерирует сервер, но проверяем, что `..` не выведет за её пределы. */
	const toPath = (key: string) => {
		const path = resolve(root, key)
		if (!path.startsWith(root + sep)) throw new Error(`Недопустимый ключ файла: ${key}`)
		return path
	}

	return {
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
}
