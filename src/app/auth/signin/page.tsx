import { PageWrapper } from '@/components/ui'
import { ButtonGoogleSignIn } from '@/components/buttons'
import { EmailSignin } from '@/components'

export default function SignInPage() {
	return (
		<PageWrapper
			pageName='signin'
			classes='min-h-screen flex items-center justify-center'>
			<div className='bg-accent-2 p-8 rounded-lg'>
				<div className='space-y-4'>
					<EmailSignin />
					<ButtonGoogleSignIn />

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
		</PageWrapper>
	)
}
