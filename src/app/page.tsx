import { connectToDatabase } from '@/config/database'
import Artist from '@/models/Artist'

import { FeaturedArtists } from '@/components'
import { PageWrapper, Search } from '@/components/ui'

export default async function Home() {
	await connectToDatabase()

	const artists = await Artist.find({}).sort({ createdAt: -1 }).limit(3)
	return (
		<PageWrapper pageName='home'>
			<Search />
			<FeaturedArtists artists={artists} />
		</PageWrapper>
	)
}
