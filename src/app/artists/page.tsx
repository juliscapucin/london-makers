import { connectToDatabase } from '@/config/database'
import Artist from '@/models/Artist'
import { ArtistType } from '@/types'

import { ArtistCard } from '@/components'
import { PageWrapper } from '@/components/ui'

export default async function Page() {
	await connectToDatabase()

	const artists = await Artist.find({})

	console.log(artists)

	return (
		<PageWrapper pageName='artists'>
			<h1>Artists</h1>
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
