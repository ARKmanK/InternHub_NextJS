import { describe, expect, it } from 'vitest'
import { csvCell, toCsv } from './csv'

describe('csvCell', () => {
	it('берёт значение в кавычки и удваивает кавычки внутри', () => {
		expect(csvCell('Сделано "вовремя"')).toBe('"Сделано ""вовремя"""')
	})

	it.each(['=1+1', '+7', '-2', '@SUM(A1)'])('экранирует формулу %s апострофом', value => {
		expect(csvCell(value)).toBe(`"'${value}"`)
	})

	it('числа превращает в строку', () => {
		expect(csvCell(3)).toBe('"3"')
	})
})

describe('toCsv', () => {
	it('BOM, разделитель «;» и CRLF между строками', () => {
		expect(
			toCsv([
				['a', 'b'],
				['c', 1],
			]),
		).toBe('﻿"a";"b"\r\n"c";"1"')
	})
})
