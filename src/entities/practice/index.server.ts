// Серверный публичный API: импортировать только из серверных компонентов и server actions
export {
	getTeacherPractices,
	getPracticeProgress,
	getStudentPractices,
	getAvailableTasksForPractice,
} from './api/practiceQueries'
export { findTeacherPractice } from './api/findTeacherPractice'
