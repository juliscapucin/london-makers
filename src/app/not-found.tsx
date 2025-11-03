import Link from 'next/link'

import { PageWrapper } from '@/components/ui'

export default function NotFound() {
	return (
		<PageWrapper
			hasContainer={false}
			variant='secondary'
			classes='flex flex-col items-center justify-center text-center h-svh mr-4'
			pageName='not found'>
			<h1 className='heading-display block'>{`[404 -> Not Found]`}</h1>
			<p className='text-pretty mt-2'>
				The page you are looking for does not exist.
			</p>
			<div>
				<span className='text-link-lg mr-2'>{`[->]`}</span>
				<Link className='underlined-link text-link-lg mt-16' href='/'>
					Start Again
				</Link>
			</div>
		</PageWrapper>
	)
}
