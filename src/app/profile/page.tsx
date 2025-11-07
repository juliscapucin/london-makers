import { redirect } from 'next/navigation'

import { getUserSession } from '@/lib/getUserSession'
import { ArtistService } from '@/lib/services/artistService'
import { PageWrapper } from '@/components/ui'

import { UserProfile } from '@/components'

export default async function Page() {
	const { session, userSession } = await getUserSession()
	if (!session || !userSession) redirect('/auth/signin')

	const brandsData = await ArtistService.getBrandsByUserId(userSession.id)
	const brands = JSON.parse(JSON.stringify(brandsData))
	const parsedUser = JSON.parse(JSON.stringify(userSession))

	return (
		<PageWrapper pageName='profile'>
			<UserProfile user={parsedUser} brands={brands} />
		</PageWrapper>
	)
}
