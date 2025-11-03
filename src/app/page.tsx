import { FeaturedArtists } from '@/components'
import { PageWrapper, Search } from '@/components/ui'

export default function Home() {
	return (
		<PageWrapper variant='primary' pageName='home'>
			<Search />
			<FeaturedArtists />
		</PageWrapper>
	)
}
