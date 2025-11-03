import { PageWrapper } from '@/components/ui'

type EmptyResultsProps = {
	message: string
	variant?: 'page' | 'inline'
}

export default function EmptyResults({
	message,
	variant = 'page',
}: EmptyResultsProps) {
	// split message into multiple lines if it contains periods
	const lines = message
		.split('. ')
		.filter((line) => line.trim() !== '')
		.map((line, index, array) => (index < array.length - 1 ? line + '.' : line))

	return lines.length > 1 && variant === 'page' ? (
		<PageWrapper
			variant='secondary'
			hasContainer={false}
			classes='flex flex-col items-center justify-center h-svh'
			pageName='empty results'>
			<div>
				<h1 className='heading-headline text-center text-pretty'>{lines[0]}</h1>
				<div className='max-w-prose'>
					{lines.slice(1).map((line, index) => (
						<p key={index} className='mt-4 text-pretty text-center mb-2'>
							{line}
						</p>
					))}
				</div>
			</div>
		</PageWrapper>
	) : (
		<div className='w-full h-full min-h-96 flex items-center justify-center bg-accent-1'>
			<p className='text-center text-pretty'>{message}</p>
		</div>
	)
}
