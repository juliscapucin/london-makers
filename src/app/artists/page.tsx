import { connectToDatabase } from '@/lib/services/database'
import Artist from '@/lib/models/Artist'
import { ArtistType } from '@/types'

import { ArtistCard } from '@/components'
import { PageWrapper } from '@/components/ui'

export default async function Page() {
	await connectToDatabase()

	const artists = await Artist.find({})

	return (
		<PageWrapper pageName='artists'>
			<h1 className='heading-display'>Artists</h1>
			<ul>
				{artists.map((artist: ArtistType) => {
					return (
						<li key={artist._id}>
							<ArtistCard artist={artist} />
						</li>
					)
				})}
			</ul>
		</PageWrapper>
	)
}
