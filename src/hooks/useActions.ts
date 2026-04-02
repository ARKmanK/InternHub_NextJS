import { cartActions } from '@/store/cart/cart.slice'
import { AppDispatch } from '@/store/store'
import { userActions } from '@/store/user/user.slice'
import { bindActionCreators } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'

const rootActions = {
	...cartActions,
	...userActions,
}

export const useActions = () => {
	const dispatch = useDispatch<AppDispatch>()

	return useMemo(() => {
		return bindActionCreators(rootActions, dispatch)
	}, [dispatch])
}
