/** Ограничения на загружаемые файлы (нефункциональные требования, этап 1). */
export const MAX_FILE_SIZE_MB = 50
export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024

export const ARCHIVE_EXTENSIONS = ['.zip', '.rar', '.7z', '.tar', '.gz'] as const
export const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'] as const

export const hasExtension = (fileName: string, extensions: readonly string[]) =>
	extensions.some(extension => fileName.toLowerCase().endsWith(extension))
