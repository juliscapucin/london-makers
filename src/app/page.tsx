import { ArtistService } from '@/lib/services/artistService'

import { FeaturedArtists } from '@/components'
import { PageWrapper, Search } from '@/components/ui'

export default async function Home() {
	const artists = await ArtistService.getHomepageArtists(3)

	return (
		<PageWrapper pageName='home'>
			<Search />
			<FeaturedArtists artists={artists} />
		</PageWrapper>
	)
}
