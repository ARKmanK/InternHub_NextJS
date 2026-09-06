export interface ILoginResponse {
	success: boolean
	error?: string
	requiresOTP?: boolean
}

export interface IVerifyOTPResponse {
	success: boolean
	token?: string
	error?: string
}

export const loginUser = async (username: string, password: string): Promise<ILoginResponse> => {
	await new Promise(resolve => setTimeout(resolve, 1000))

	if (username === 'server_error') {
		throw new Error('Сервер недоступен. Попробуйте позже.')
	}
	if (username === 'wrong_data' || password === 'wrong_data') {
		return { success: false, error: 'Неверное имя пользователя или пароль.' }
	}
	if (username === 'ban') {
		return { success: false, error: 'Пользователь заблокирован.' }
	}
	if (username === 'requests') {
		return { success: false, error: 'Слишком много запросов, подождите.' }
	}

	return {
		success: true,
		requiresOTP: true,
	}
}

export const verifyOTP = async (otp: string): Promise<IVerifyOTPResponse> => {
	await new Promise(resolve => setTimeout(resolve, 1000))
	if (otp === '131311') {
		return { success: true, token: 'mock_token_131311' }
	} else if (otp === '111111') {
		throw new Error('Время действия кода истекло.')
	} else if (otp === '222222') {
		throw new Error('Сервер недоступен. Попробуйте позже.')
	} else {
		return { success: false, error: 'Неверный код. Попробуйте ещё раз.' }
	}
}
