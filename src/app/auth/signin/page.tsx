import { PageWrapper } from '@/components/ui'
import { ButtonGoogleSignIn } from '@/components/buttons'
import { EmailSignin } from '@/components'

export default function SignInPage() {
	return (
		<PageWrapper pageName='signin'>
			<div className='max-w-lg mx-auto'>
				<div className='space-y-4'>
					<EmailSignin />
					<span className='heading-title text-center mx-auto block'>OR</span>
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
