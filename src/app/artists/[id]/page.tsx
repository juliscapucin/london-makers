import Artist from '@/models/Artist'
import { connectToDatabase } from '@/config/database'

import { EmptyResults, PageWrapper } from '@/components/ui'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	await connectToDatabase()

	const artist = await Artist.findById((await params).id)

	const artistCount = await Artist.countDocuments({ _id: (await params).id })
	console.log('Documents with this ID:', artistCount)

	if (!artist) {
		return (
			<EmptyResults message='Artist not found. Please check the URL or return to the artists list.' />
		)
	}

	return (
		<PageWrapper pageName='properties'>
			<h1 className='heading-display text-secondary'>{artist.businessName}</h1>
			<p>{artist.description}</p>
		</PageWrapper>
	)
}
