'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'

import { DASHBOARD_PAGES } from '@/constants/pages-url.config'

import { IAuthForm } from '@/types/auth.types'

import { authService } from '@/services/auth.service'

export function Auth() {
	//дженерик позврлит указать конкретные поля которые будут в нашей форме
	const { register, handleSubmit, reset } = useForm<IAuthForm>({
		mode: 'onChange'
	})

	const [isLoginForm, setIsLoginForm] = useState(false)
	//перенаправить юзера на другую страницу после успешного входа в систему или регистрации
	const { push } = useRouter()

	const { mutate } = useMutation({
		mutationKey: ['auth'],
		mutationFn: (data: IAuthForm) =>
			authService.main(isLoginForm ? 'login' : 'register', data),
		//после успешного входа в систему/регистрации добавляем onSuccess
		onSuccess() {
			toast.success('Успешный вход в систему!')
			//очищаем форму
			reset()
			//перенаправляем на главную страницу
			push(DASHBOARD_PAGES.HOME)
		}
	})

	const onSubmit: SubmitHandler<IAuthForm> = data => {
		mutate(data)
	}
	// {
	// 	"email": "test@email.ru",
	// 	"password": "123456"
	// }
	return (
		<div className='flex min-h-screen'>
			<form
				className='w-1/3 m-auto shadow bg-sidebar dark:bg-gray-800 rounded-xl p-layout'
				onSubmit={handleSubmit(onSubmit)}
			>
				<Heading title='Вход систему' />
				{/* если хочу сделать валидацию, то посмотреть видео amazon 2.0 */}
				<Field
					id='email'
					label='Почта: '
					placeholder='Введите почту: '
					type='email'
					extra='mb-4'
					{...register('email', {
						required: 'Email is requided'
					})}
				/>
				<Field
					id='password'
					label='Пароль: '
					placeholder='Введите пароль: '
					type='password'
					{...register('password', {
						required: 'Password is requided'
					})}
					extra='mb-6'
				/>
				<div className='flex items-center gap-5 justify-center'>
					<Button onClick={() => setIsLoginForm(true)}>Войти</Button>
					<Button onClick={() => setIsLoginForm(false)}>
						Зарегистрироваться
					</Button>
				</div>
			</form>
		</div>
	)
}
