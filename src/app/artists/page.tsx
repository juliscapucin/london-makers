import { ArtistType } from '@/types'

import { ArtistService } from '@/lib/services/artistService'
import { ArtistCard } from '@/components'
import { PageWrapper } from '@/components/ui'

export default async function Page() {
	const artists = await ArtistService.getAllArtists()

	return (
		<PageWrapper pageName='artists'>
			<h1 className='heading-display'>Artists</h1>
			<ul>
				{artists.map((artist: ArtistType) => {
					return (
						<li key={artist._id.toString()} className='mb-6'>
							<ArtistCard artist={artist} />
						</li>
					)
				})}
			</ul>
		</PageWrapper>
	)
}
