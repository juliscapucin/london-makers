import { redirect } from 'next/navigation'

import { getUserSession } from '@/lib/getUserSession'

import { EmptyResults, PageWrapper } from '@/components/ui'
import { ArtistCard } from '@/components'
import { UserService } from '@/lib/services/userService'

export default async function Page() {
	const { userSession, session } = await getUserSession()

	if (!userSession || !session) {
		redirect('/auth/signin')
	}

	const bookmarks = await UserService.getUserBookmarks(userSession.id)

	return bookmarks.length === 0 ? (
		<EmptyResults message='You have no saved artists yet. Browse artists and bookmark your favorites to see them here.' />
	) : (
		<PageWrapper pageName='savedArtists'>
			<h1 className='heading-display'>Saved Artists</h1>

			<ul className='list-disc list-inside mt-6 space-y-4'>
				{bookmarks.map((artist) => (
					<ArtistCard key={artist._id.toString()} artist={artist} />
				))}
			</ul>
		</PageWrapper>
	)
}
