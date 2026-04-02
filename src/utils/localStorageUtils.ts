import { ICartState } from '@/store/cart/cart.slice'
import { RootState } from '@/store/store'
import { IUser } from '@/store/user/user.slice'

interface IPersistedState {
	cart: ICartState
	user: IUser
}

export const loadState = (): IPersistedState | undefined => {
	if (typeof window === 'undefined') {
		return undefined
	}

	try {
		const cartState = localStorage.getItem('cart')
		const userState = localStorage.getItem('user')

		if (!cartState || !userState) {
			return undefined
		}

		return {
			cart: JSON.parse(cartState),
			user: JSON.parse(userState),
		}
	} catch (e) {
		console.error('Ошибка загрузки данных из localStorage', e)
		return undefined
	}
}

export const saveState = (state: RootState) => {
	if (typeof window === 'undefined') {
		return
	}

	try {
		localStorage.setItem('cart', JSON.stringify(state.cart))
		localStorage.setItem('user', JSON.stringify(state.user))
		const cartJson = JSON.stringify(state.cart)
		document.cookie = `cart=${cartJson}; path=/; max-age=2592000; SameSite=Lax`
	} catch (e) {
		console.error('Ошибка сохранения данных в localStorage', e)
	}
}
export const saveCartState = (cart: ICartState) => {
	if (typeof window === 'undefined') return

	try {
		const serializedState = JSON.stringify(cart)
		localStorage.setItem('cart', serializedState)
		document.cookie = `cart=${serializedState}; path=/; max-age=2592000; SameSite=Lax`
	} catch (e) {
		console.error('Ошибка сохранения корзины в localStorage', e)
	}
}

export const saveUserState = (user: IUser) => {
	if (typeof window === 'undefined') return

	try {
		const serializedState = JSON.stringify(user)
		localStorage.setItem('user', serializedState)
	} catch (e) {
		console.error('Ошибка сохранения пользователя в localStorage', e)
	}
}
