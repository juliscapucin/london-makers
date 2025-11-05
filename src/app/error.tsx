'use client'

import Link from 'next/link'

import { PageWrapper } from '@/components/ui'

export default function Error({ error }: { error: Error }) {
	return (
		<PageWrapper
			hasContainer={false}
			classes='flex flex-col items-center justify-center text-center h-svh mr-4'
			pageName='error'>
			<h1 className='heading-display block'>Something went wrong</h1>
			<p className='text-pretty mt-2'>{error.message}. Please try again.</p>
			<div>
				<Link className='underlined-link text-link-lg mt-16' href='/'>
					Start Again
				</Link>
			</div>
		</PageWrapper>
	)
}
