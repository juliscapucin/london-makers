import { ArtistService } from '@/lib/services/artistService'

import { FeaturedArtists } from '@/components'
import { PageWrapper, Search } from '@/components/ui'
import { getUserSession } from '@/lib/getUserSession'

export default async function Home() {
	const artists = await ArtistService.getHomepageArtists(3)
	const simpleArtists = JSON.parse(JSON.stringify(artists))

	const { session } = await getUserSession()

	return (
		<>
			<div className='bg-primary min-h-screen w-full text-secondary flex items-center justify-center flex-col'>
				<h1 className='heading-display'>Smalls London</h1>
				<p className='text-body mt-4'>Website coming soon</p>
			</div>
			{/* <PageWrapper pageName='home' sessionData={session}>
				<Search />
				<FeaturedArtists artists={simpleArtists} />
			</PageWrapper> */}
		</>
	)
}
;``
