import { redirect } from 'next/navigation'

import { ArtistForm } from '@/components/forms'
import { PageWrapper } from '@/components/ui'

import { getUserSession } from '@/lib/getUserSession'
import { ArtistService } from '@/lib/services/artistService'
import { notFound } from 'next/navigation'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const { user, session } = await getUserSession()

	if (!user || !session) {
		redirect('/auth/signin')
	}

	const artistData = JSON.parse(
		JSON.stringify(await ArtistService.getArtistById(id))
	)

	if (!artistData) {
		return notFound()
	}

	// convert artistData to match FormValues structure if necessary
	const initialData = {
		_id: artistData._id,
		businessName: artistData.businessName || '',
		type: artistData.type || '',
		artistName: artistData.artist_info?.name || '',
		email: artistData.artist_info?.email || '',
		phone: artistData.artist_info?.phone || '',
		website: artistData.artist_info?.website || '',
		description: artistData.description || '',
		street: artistData.location?.street || '',
		city: artistData.location?.city || '',
		state: artistData.location?.state || '',
		zip: artistData.location?.zip || '',
		employees: artistData.employees || '',
		physicalStores: artistData.physical_stores || '',
		instagram: artistData.socials?.instagram || '',
		facebook: artistData.socials?.facebook || '',
		bluesky: artistData.socials?.bluesky || '',
		tiktok: artistData.socials?.tiktok || '',
		rates: artistData.rates || [{ name: '', price: 0 }],
		specialties: artistData.specialties || [''],
		images: artistData.images || [],
		isFeatured: artistData.isFeatured || false,
	}

	return (
		<PageWrapper pageName='edit-artist' classes='py-12'>
			<div className='max-w-4xl mx-auto'>
				<header className='mb-8'>
					<h1 className='heading-display text-secondary mb-4'>Edit Artist</h1>
					<p className='text-paragraph text-accent-3'>
						Edit the form below to update the artist information in the London
						Makers directory. All fields marked with * are required.
					</p>
				</header>

				<ArtistForm isEdit={true} initialData={initialData} />
			</div>
		</PageWrapper>
	)
}
