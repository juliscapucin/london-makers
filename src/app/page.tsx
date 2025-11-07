import { ArtistService } from '@/lib/services/artistService'

import { FeaturedArtists } from '@/components'
import { PageWrapper, Search } from '@/components/ui'
import { getUserSession } from '@/lib/getUserSession'

export default async function Home() {
	const artists = await ArtistService.getHomepageArtists(3)
	const simpleArtists = JSON.parse(JSON.stringify(artists))

	const { session } = await getUserSession()

	return (
		<PageWrapper pageName='home' sessionData={session}>
			<Search />
			<FeaturedArtists artists={simpleArtists} />
		</PageWrapper>
	)
}
