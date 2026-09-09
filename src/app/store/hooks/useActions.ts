// app/store/hooks/useActions.ts
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { AppDispatch } from '../store'
import { userActions } from '../slices/user/user.slice'

const rootActions = {
	...userActions,
}

export const useActions = () => {
	const dispatch = useDispatch<AppDispatch>()

	return useMemo(() => bindActionCreators(rootActions, dispatch), [dispatch])
}

/* 
export const useAppSelector = useSelector.withTypes<RootState>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
 */
