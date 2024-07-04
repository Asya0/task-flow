'use client'

import { SubmitHandler, useForm } from 'react-hook-form'

import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'

import { TypeUserForm } from '@/types/auth.types'

import { useInitialData } from './useInitialData'
import { useUpdateSettings } from './useUpdateSettings'

export function Settings() {
	const { register, handleSubmit, reset } = useForm<TypeUserForm>({
		mode: 'onChange'
	})

	useInitialData(reset)

	const { isPending, mutate } = useUpdateSettings()

	const onSubmit: SubmitHandler<TypeUserForm> = data => {
		const { password, ...rest } = data

		mutate({
			...rest,
			password: password || undefined
		})
	}

	return (
		<div>
			<form
				className='w-3/4'
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className='grid grid-cols-2 gap-10'>
					<div>
						<Field
							id='email'
							label='Почта: '
							placeholder='Введите почту'
							type='email'
							{...register('email', {
								required: 'Email is required'
							})}
							extra='mb-4'
						/>
						<Field
							id='name'
							label='Имя: '
							placeholder='Введите имя'
							{...register('name')}
							extra='mb-4'
						/>
						<Field
							id='Пароль'
							label='Password: '
							placeholder='Enter password'
							type='password'
							{...register('password')}
							extra='mb-10'
						/>
					</div>
					{/* настройки таймера */}
					<div>
						<Field
							id='workInterval'
							label='Длительность сессии (мин.):'
							placeholder='Введите длительность сессии (мин.)'
							isNumber
							{...register('workInterval', {
								valueAsNumber: true
							})}
							extra='mb-4'
						/>
						<Field
							id='breakInterval'
							label='Длительность перерыва (мин.): '
							placeholder='Введите длительность перерыва (мин.)'
							isNumber
							{...register('breakInterval', {
								valueAsNumber: true
							})}
							extra='mb-4'
						/>
						<Field
							id='intervalsCount'
							label='Количество сессий (макс. 10):'
							placeholder='Введите количество кругов (макс. 10)'
							isNumber
							{...register('intervalsCount', {
								valueAsNumber: true
							})}
							extra='mb-6'
						/>
					</div>
				</div>
				<Button
					type='submit'
					disabled={isPending}
				>
					Сохранить
				</Button>
			</form>
		</div>
	)
}
