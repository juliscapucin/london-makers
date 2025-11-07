import { redirect } from 'next/navigation'

import { getUserSession } from '@/lib/getUserSession'

import { ArtistForm } from '@/components/forms'
import { PageWrapper, Container } from '@/components/ui'

export default async function Page() {
	const { userSession, session } = await getUserSession()

	if (!userSession || !session) {
		redirect('/auth/signin')
	}

	return (
		<PageWrapper pageName='add-artist' classes='py-12' sessionData={session}>
			<Container>
				<div className='max-w-4xl mx-auto'>
					<header className='mb-8'>
						<h1 className='heading-display text-secondary mb-4'>
							Add New Artist
						</h1>
						<p className='text-paragraph text-accent-3'>
							Fill out the form below to add a new artist to the London Makers
							directory. All fields marked with * are required.
						</p>
					</header>

					<ArtistForm />
				</div>
			</Container>
		</PageWrapper>
	)
}
