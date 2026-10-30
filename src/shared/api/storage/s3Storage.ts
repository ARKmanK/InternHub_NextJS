import 'server-only'
import {
	DeleteObjectCommand,
	GetObjectCommand,
	NoSuchKey,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { attachmentHeader, type FileStorage } from './types'

/** Сколько живёт ссылка на скачивание: её получают сразу после проверки прав, дольше не нужно. */
const DOWNLOAD_URL_TTL_SECONDS = 60

export type S3Config = {
	endpoint: string
	region: string
	bucket: string
	accessKeyId: string
	secretAccessKey: string
}

/**
 * S3-совместимый драйвер (Timeweb Cloud S3, Yandex Object Storage, MinIO…).
 *
 * Бакет приватный: публичных ссылок на файлы нет. Скачивание — так же через route handler
 * с проверкой прав, но вместо того чтобы пропускать файл через приложение, он отвечает
 * редиректом на подписанную ссылку S3 со сроком жизни 60 секунд.
 */
export function createS3Storage(config: S3Config): FileStorage {
	const client = new S3Client({
		endpoint: config.endpoint,
		region: config.region,
		credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
		// Адреса вида endpoint/bucket/key: работают у всех S3-совместимых провайдеров
		forcePathStyle: true,
	})
	const Bucket = config.bucket

	return {
		async put(key, data, contentType) {
			await client.send(
				new PutObjectCommand({
					Bucket,
					Key: key,
					Body: data,
					ContentType: contentType ?? 'application/octet-stream',
				}),
			)
		},
		async get(key) {
			try {
				const object = await client.send(new GetObjectCommand({ Bucket, Key: key }))
				return object.Body ? await object.Body.transformToByteArray() : null
			} catch (error) {
				if (error instanceof NoSuchKey) return null
				throw error
			}
		},
		async delete(key) {
			await client.send(new DeleteObjectCommand({ Bucket, Key: key }))
		},
		getDownloadUrl(key, { fileName, contentType }) {
			return getSignedUrl(
				client,
				new GetObjectCommand({
					Bucket,
					Key: key,
					// Заголовки ответа задаёт подпись: файл скачается под исходным именем и не откроется в браузере
					ResponseContentDisposition: attachmentHeader(fileName),
					ResponseContentType: contentType,
				}),
				{ expiresIn: DOWNLOAD_URL_TTL_SECONDS },
			)
		},
	}
}
