import { useSelector } from 'react-redux'
import { RootState } from '../store'

export const useTagsSummary = () => {
	const user = useSelector((state: RootState) => state.user)

	const defaultTags = user.defaultTags
	const userTags = user.userTags

	return {
		defaultTags,
		userTags,
	}
}
