// Серверный публичный API: импортировать только из серверных компонентов и server actions
export {
	getTasks,
	getTaskById,
	getTasksByAuthor,
	getTasksOnModeration,
	getFavoriteTasks,
	getStudentTasksInProgress,
	getStudentAcceptedTasks,
	getTaskFilterOptions,
	type TaskViewer,
} from './api/taskQueries'
export { changeTaskStatus, canChangeTaskStatus } from './api/taskStatus'
export { getTaskArchive } from './api/taskArchive'
export { difficultyFromDto } from './api/taskMapper'
