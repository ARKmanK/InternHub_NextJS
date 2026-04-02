import { configureStore } from '@reduxjs/toolkit'
import { loadState, saveState } from '@/utils/localStorageUtils'
import userReducer from './user/user.slice'
import cartReducer from './cart/cart.slice'

const initialState = loadState()

export const store = configureStore({
	reducer: {
		cart: cartReducer,
		user: userReducer,
	},
	preloadedState: initialState,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

store.subscribe(() => {
	const state = store.getState()
	saveState({
		cart: state.cart,
		user: state.user,
	})
})
