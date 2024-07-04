'use client'

import { useMutation } from '@tanstack/react-query'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { authService } from '@/services/auth.service'

export function LogoutButton() {
	const router = useRouter()

	const { mutate } = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => authService.logout(),
		onSuccess: () => router.push('/auth')
	})

	return (
		// <div className='absolute top-2 right-2'>
		<div className='absolute  -bottom-20 left-17'>
			<button
				className='flex flex-row-reverse gap-3 opacity-20 hover:opacity-100 transition-opacity duration-300'
				onClick={() => mutate()}
			>
				Выход
				<LogOut size={30} />
			</button>
		</div>
	)
}
