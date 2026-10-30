// Excel в русской локали ждёт «;», а BOM нужен, чтобы он распознал UTF-8
const SEPARATOR = ';'
const BOM = '﻿'

/**
 * Ячейка CSV: в кавычках, кавычки удваиваются. Значения, начинающиеся с = + - @,
 * экранируются апострофом — иначе Excel выполнит их как формулу (CSV injection).
 */
export const csvCell = (value: string | number) => {
	const text = String(value)
	const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
	return `"${safe.replaceAll('"', '""')}"`
}

/** Таблица → CSV для Excel: BOM, разделитель «;», строки через CRLF. */
export const toCsv = (rows: (string | number)[][]) =>
	BOM + rows.map(row => row.map(csvCell).join(SEPARATOR)).join('\r\n')
