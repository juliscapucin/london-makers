'use client'

import { useRouter } from 'next/navigation'

import { IconChevron } from '../icons'

type ButtonBackProps = {
	label?: string
}

export default function ButtonBack({ label }: ButtonBackProps) {
	const router = useRouter()

	return (
		<button
			className='h-8 mt-4 mb-8 flex gap-4 items-center w-full pb-4 bg-primary z-15'
			onClick={() => router.back()}>
			<IconChevron direction='back' />
			<span className='underlined-link'>Back{label ? ` to ${label}` : ''}</span>
		</button>
	)
}
