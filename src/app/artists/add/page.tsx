import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { UserService } from '@/lib/services/userService'
import { AddArtistForm } from '@/components/forms'
import { PageWrapper, Container } from '@/components/ui'

export default async function Page() {
	// Check authentication and admin role
	const session = await auth.api.getSession({ headers: await headers() })
	if (!session) redirect('/sign-in')

	if (!session?.user) {
		redirect('/auth/signin?callbackUrl=/artists/add')
	}

	console.log('Session user:', JSON.stringify(session.user, null, 2))
	console.log('Looking for user with ID:', session.user.id)

	const user = await UserService.getUserById(session.user.id)
	console.log('Found user:', user)

	if (!user || Array.isArray(user) || user.role !== 'admin') {
		redirect('/?error=access-denied')
	}

	return (
		<PageWrapper pageName='add-artist' classes='py-12'>
			<Container>
				<div className='max-w-4xl mx-auto'>
					<header className='mb-8'>
						<h1 className='heading-display text-secondary mb-4'>
							Add New Artist
						</h1>
						<p className='text-paragraph text-accent-1'>
							Fill out the form below to add a new artist to the London Makers
							directory. All fields marked with * are required.
						</p>
					</header>

					<AddArtistForm
						userId={session.user.id || session.user.id?.toString() || ''}
					/>
				</div>
			</Container>
		</PageWrapper>
	)
}
