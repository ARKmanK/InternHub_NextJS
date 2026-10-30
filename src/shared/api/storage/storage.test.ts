import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createLocalStorage } from './localStorage'
import { createS3Storage } from './s3Storage'

describe('локальный драйвер', () => {
	let dir: string
	beforeAll(async () => {
		dir = await mkdtemp(join(tmpdir(), 'internhub-storage-'))
	})
	afterAll(() => rm(dir, { recursive: true, force: true }))

	it('сохраняет, читает и удаляет файл', async () => {
		const storage = createLocalStorage(dir)
		await storage.put('tasks/a.zip', new Uint8Array([1, 2, 3]))
		expect(await storage.get('tasks/a.zip')).toEqual(new Uint8Array([1, 2, 3]))
		await storage.delete('tasks/a.zip')
		expect(await storage.get('tasks/a.zip')).toBeNull()
	})

	it('не выпускает ключ за пределы папки хранилища', async () => {
		const storage = createLocalStorage(dir)
		await expect(storage.get('../secret.txt')).rejects.toThrow('Недопустимый ключ')
		await expect(storage.put('tasks/../../x', new Uint8Array())).rejects.toThrow(
			'Недопустимый ключ',
		)
	})

	it('ссылок на скачивание не выдаёт — файлы идут через приложение', () => {
		expect(createLocalStorage(dir).getDownloadUrl).toBeUndefined()
	})
})

describe('S3-драйвер: ссылка на скачивание', () => {
	// Подпись считается локально — сеть и настоящие ключи не нужны
	const storage = createS3Storage({
		endpoint: 'https://s3.example.test',
		region: 'ru-1',
		bucket: 'internhub',
		accessKeyId: 'test-key',
		secretAccessKey: 'test-secret',
	})

	it('подписанная ссылка на 60 секунд с именем файла для скачивания', async () => {
		const url = new URL(
			await storage.getDownloadUrl!('submissions/1/abc.zip', {
				fileName: 'Решение.zip',
				contentType: 'application/zip',
			}),
		)
		expect(url.origin + url.pathname).toBe(
			'https://s3.example.test/internhub/submissions/1/abc.zip',
		)
		expect(url.searchParams.get('X-Amz-Expires')).toBe('60')
		expect(url.searchParams.get('X-Amz-Signature')).toMatch(/^[0-9a-f]{64}$/)
		expect(url.searchParams.get('response-content-disposition')).toBe(
			`attachment; filename*=UTF-8''${encodeURIComponent('Решение.zip')}`,
		)
		expect(url.searchParams.get('response-content-type')).toBe('application/zip')
	})
})
