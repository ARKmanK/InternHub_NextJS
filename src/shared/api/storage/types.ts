/**
 * Хранилище файлов: архивы с материалами заданий, архивы и скриншоты решений.
 * В базе хранится только ключ (`tasks/3f1c….zip`), сам файл — в хранилище.
 */
export interface FileStorage {
	put(key: string, data: Uint8Array, contentType?: string): Promise<void>
	get(key: string): Promise<Uint8Array | null>
	delete(key: string): Promise<void>
	/**
	 * Временная ссылка на скачивание прямо из хранилища (S3 presigned URL).
	 * Есть не у всех драйверов: локальный отдаёт файл через приложение.
	 */
	getDownloadUrl?(key: string, download: DownloadOptions): Promise<string>
}

export type DownloadOptions = {
	fileName: string
	contentType: string
}

/** Content-Disposition для скачивания: имя в UTF-8 по RFC 5987, файл не откроется в браузере. */
export const attachmentHeader = (fileName: string) =>
	`attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`
