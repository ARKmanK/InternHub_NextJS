import { ITag } from '@/features/tag/model/ITag'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
	id: number | null
	email: string
	defaultTags: ITag[]
	userTags: ITag[]
}

const initialState: UserState = {
	id: null,
	email: '',
	defaultTags: [],
	userTags: [],
}

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		addUserTag: (state, action: PayloadAction<string>) => {
			const label = action.payload
			const lastID = state.userTags.reduce((max, tag) => Math.max(max, tag.id), 0)

			const newTag: ITag = {
				id: lastID + 1,
				label: label,
			}

			const exists = state.userTags.some(tag => tag.label === label)
			if (!exists) {
				state.userTags.push(newTag)
			}
		},
		removeUserTag: (state, action: PayloadAction<number>) => {
			state.userTags = state.userTags.filter(tag => tag.id !== action.payload)
		},

		updateEmail: (state, action: PayloadAction<string>) => {
			state.email = action.payload
		},

		/* updateUserData: (
			state,
			action: PayloadAction<{
				name: string
				phone: string
				birthday: string
				email: string
				adv: boolean
			}>,
		) => {
			state.name = action.payload.name
			state.phone = action.payload.phone
			state.birthday = action.payload.birthday
			state.email = action.payload.email
			state.adv = action.payload.adv
		},
	}, */
	},
})

export const { actions: userActions, reducer: userReducer } = userSlice
export default userReducer
