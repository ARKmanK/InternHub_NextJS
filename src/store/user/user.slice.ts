import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ICard {
	id: number
	cardNumber: string
	cardDate: string
	cardCVV: string
}

export interface IPurchase {
	id: number
	purchaseNumber: number
	purchaseTime: string
	purchasePrice: number
	purchasePaymentMethod: string
}

export interface IDeliveryAddress {
	id: number
	deliveryAddress: string
}

export interface IUser {
	id: number
	name: string
	phone: string
	birthday: string
	email: string
	adv: boolean
	dodoCoins: number
	cards: ICard[]
	purchaseHistory: IPurchase[]
	deliveryAddress: IDeliveryAddress[]
}

const initialState: IUser = {
	id: 1,
	name: '',
	phone: '',
	birthday: '',
	email: '',
	adv: false,
	dodoCoins: 0,
	cards: [],
	purchaseHistory: [],
	deliveryAddress: [],
}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		addCard: (
			state,
			action: PayloadAction<{ cardNumber: string; cardDate: string; cardCVV: string }>
		) => {
			const newCard = {
				id: state.cards.length > 0 ? Math.max(...state.cards.map(card => card.id)) + 1 : 1,
				cardNumber: action.payload.cardNumber,
				cardDate: action.payload.cardDate,
				cardCVV: action.payload.cardCVV,
			}
			state.cards.push(newCard)
		},

		removeCard: (state, action: PayloadAction<number>) => {
			state.cards = state.cards.filter(card => card.id !== action.payload)
		},

		updatePurchaseHistory: (
			state,
			action: PayloadAction<Omit<IPurchase, 'id' | 'purchaseNumber'>>
		) => {
			const newOrder = {
				id:
					state.purchaseHistory.length > 0
						? Math.max(...state.purchaseHistory.map(history => history.id)) + 1
						: 1,
				purchaseNumber:
					state.purchaseHistory.length > 0
						? Math.max(...state.purchaseHistory.map(history => +history.purchaseNumber)) + 1
						: 1,
				purchaseTime: action.payload.purchaseTime,
				purchasePrice: action.payload.purchasePrice,
				purchasePaymentMethod: action.payload.purchasePaymentMethod,
			}
			state.purchaseHistory.push(newOrder)
		},

		updateDeliveryAddress: (state, action: PayloadAction<string>) => {
			state.deliveryAddress.push({
				id:
					state.deliveryAddress.length > 0
						? Math.max(...state.deliveryAddress.map(add => add.id)) + 1
						: 1,
				deliveryAddress: action.payload,
			})
		},

		deleteDeliveryAddress: (state, action: PayloadAction<number>) => {
			state.deliveryAddress = state.deliveryAddress.filter(add => add.id !== action.payload)
		},

		updateUserData: (
			state,
			action: PayloadAction<{
				name: string
				phone: string
				birthday: string
				email: string
				adv: boolean
				dodoCoins: number
			}>
		) => {
			state.name = action.payload.name
			state.phone = action.payload.phone
			state.birthday = action.payload.birthday
			state.email = action.payload.email
			state.adv = action.payload.adv
		},
	},
})

export const { actions: userActions, reducer: userReducer } = userSlice
export default userReducer
