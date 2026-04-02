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

export const loginUser = async (phone: string): Promise<ILoginResponse> => {
	await new Promise(resolve => setTimeout(resolve, 1000))

	if (phone === '+71111111111') {
		throw new Error('Сервер недоступен. Попробуйте позже.')
	}
	if (phone === '+72222222222') {
		return { success: false, error: 'Неверное имя пользователя или пароль.' }
	}
	if (phone === '+73333333333') {
		return { success: false, error: 'Пользователь заблокирован.' }
	}
	if (phone === '+74444444444') {
		return { success: false, error: 'Слишком много запросов, подождите.' }
	}

	return {
		success: true,
		requiresOTP: true,
	}
}

export const verifyOTP = async (otp: string): Promise<IVerifyOTPResponse> => {
	await new Promise(resolve => setTimeout(resolve, 1000))
	if (otp === '1111') {
		return { success: true, token: 'mock_token_131311' }
	} else if (otp === '2222') {
		throw new Error('Время действия кода истекло.')
	} else if (otp === '3333') {
		throw new Error('Сервер недоступен. Попробуйте позже.')
	} else {
		return { success: false, error: 'Неверный код. Попробуйте ещё раз.' }
	}
}
