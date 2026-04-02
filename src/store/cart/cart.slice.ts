import { Product } from '@/types/products'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ICartItem extends Product {}

export interface IPromoCode {
	promo: string
	discount: number
}

export interface ICartState {
	products: ICartItem[]
	promoCode: IPromoCode
}

const initialState: ICartState = {
	products: [],
	promoCode: {
		promo: '',
		discount: 0,
	},
}

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		clearCart: () => initialState,

		toggleCart: (state, { payload: product }: PayloadAction<Product>) => {
			const isExists = state.products.some(pr => pr.id === product.id)
			if (isExists) {
				state.products = state.products.filter(pr => pr.id !== product.id)
			} else {
				state.products.push({ ...product, quantity: 1 })
			}
		},

		changeAmount: (
			state,
			{
				payload: { product, action },
			}: PayloadAction<{ product: ICartItem; action: 'add' | 'remove' }>
		) => {
			const productData = state.products.find(pr => pr.id === product.id)
			if (productData) {
				if (action === 'remove') {
					if (productData.quantity === 1) {
						state.products = state.products.filter(pr => pr.id !== product.id)
					} else {
						productData.quantity -= 1
					}
				} else if (action === 'add') {
					productData.quantity += 1
				}
			}
		},

		setPromoCode: (
			state,
			{ payload: { promo, discount } }: PayloadAction<{ promo: string; discount: number }>
		) => {
			state.promoCode.promo = promo
			state.promoCode.discount = discount
		},

		clearPromoCode: state => {
			state.promoCode.promo = ''
			state.promoCode.discount = 0
		},
	},
})

export const { actions: cartActions, reducer: cartReducer } = cartSlice
export default cartReducer
