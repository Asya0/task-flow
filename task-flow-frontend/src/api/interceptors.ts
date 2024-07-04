import axios, { type CreateAxiosDefaults } from 'axios'

// import { error } from 'console'
import { errorCatch } from './error'
import {
	getAccessToken,
	removeFromStorage
} from '@/services/auth-token.service'
import { authService } from '@/services/auth.service'

const options: CreateAxiosDefaults = {
	baseURL: 'http://localhost:3000/api', //будет вязаться к каждому запросу
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true //указываем, что работаем с серверными куками
}

//будет работать без авторизации, используем только в логине и в регистраци
const axiosClassic = axios.create(options)

const axiosWithAuth = axios.create(options)

axiosWithAuth.interceptors.request.use(config => {
	const accessToken = getAccessToken()

	if (config?.headers && accessToken)
		config.headers.Authorization = `Bearer ${accessToken}`

	return config
})

//обработка ошибки
axiosWithAuth.interceptors.response.use(
	config => config,
	async error => {
		const originalRequest = error.config

		if (
			//401 - что-то не так с авторизацией
			(error?.response?.status === 401 ||
				errorCatch(error) === 'jwt expired' ||
				//jwt должен быть прокинут
				errorCatch(error) === 'jwt must be provided') &&
			error.config &&
			!error.config._isRetry
		) {
			originalRequest._isRetry = true
			try {
				await authService.getNewTokens()
				return axiosWithAuth.request(originalRequest)
			} catch (error) {
				if (errorCatch(error) === 'jwt expired') removeFromStorage()
			}
		}
		throw error
	}
)

export { axiosClassic, axiosWithAuth }
