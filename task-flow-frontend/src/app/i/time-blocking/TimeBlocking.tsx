'use client'

import { FormProvider, useForm } from 'react-hook-form'

import type { TypeTimeBlockFormState } from '@/types/time-block.types'

import { TimeBlockingList } from './TimeBlockingList'
import { TimeBlockingForm } from './form/TimeBlockingForm'

export function TimeBlocking() {
	const methods = useForm<TypeTimeBlockFormState>()
	return (
		<FormProvider {...methods}>
			<div className='grid grid-cols-3 gap-12'>
				<div className='col-span-2'>
					<TimeBlockingList />
				</div>
				<div className='col-span-1'>
					<TimeBlockingForm />
				</div>
			</div>
		</FormProvider>
	)
}
