import { ArtistService } from '@/lib/services/artistService'
import { EmptyResults, PageWrapper } from '@/components/ui'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const artist = await ArtistService.getArtistById(id)

	if (!artist) {
		return (
			<EmptyResults message='Artist not found. Please check the URL or return to the artists list.' />
		)
	}

	return (
		<PageWrapper pageName='artist-detail'>
			<h1 className='heading-display text-secondary'>{artist.businessName}</h1>
			<p>{artist.description}</p>
		</PageWrapper>
	)
}
