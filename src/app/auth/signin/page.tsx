import { Container, PageWrapper } from '@/components/ui'
import { ButtonSignIn } from '@/components/buttons'

export default function SignInPage() {
	return (
		<PageWrapper
			pageName='signin'
			classes='min-h-screen flex items-center justify-center'>
			<Container classes='max-w-md'>
				<div className='bg-accent-2 p-8 rounded-lg'>
					<div className='text-center mb-8'>
						<h1 className='heading-title mb-2'>Welcome to London Makers</h1>
						<p>Sign in to discover and connect with local artists</p>
					</div>

					<div className='space-y-4'>
						<ButtonSignIn />

						<div className='text-center'>
							<p>
								By signing in, you agree to our{' '}
								<a href='/terms' className='underlined-link'>
									Terms of Service
								</a>{' '}
								and{' '}
								<a href='/privacy' className='underlined-link'>
									Privacy Policy
								</a>
							</p>
						</div>
					</div>
				</div>
			</Container>
		</PageWrapper>
	)
}
