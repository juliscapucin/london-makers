import { redirect } from 'next/navigation'

import { AddArtistForm } from '@/components/forms'
import { PageWrapper, Container } from '@/components/ui'

import { getUserSession } from '@/lib/getUserSession'

export default async function Page() {
	const { user, session } = await getUserSession()

	if (!user || !session || user.role !== 'admin') {
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
						<p className='text-paragraph text-accent-3'>
							Fill out the form below to add a new artist to the London Makers
							directory. All fields marked with * are required.
						</p>
					</header>

					<AddArtistForm />
				</div>
			</Container>
		</PageWrapper>
	)
}
