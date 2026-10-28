/**
 * Сколько слов из названия нужно ввести для подтверждения удаления (алгоритм из ПЗ, п. 3.3.7):
 * первые два слова, если хотя бы одно из них длиннее 5 символов, иначе первые три.
 */
export const getRequiredTitlePart = (title: string) => {
	const words = title.trim().split(/\s+/)
	const firstTwo = words.slice(0, 2)
	const count = firstTwo.some(word => word.length > 5) ? 2 : 3
	return words.slice(0, count).join(' ')
}
