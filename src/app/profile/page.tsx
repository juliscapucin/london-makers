import { redirect } from 'next/navigation'

import { getUserSession } from '@/lib/getUserSession'
import { ArtistService } from '@/lib/services/artistService'
import { PageWrapper } from '@/components/ui'

import { UserProfile } from '@/components'

export default async function Page() {
	const { session } = await getUserSession()
	if (!session) redirect('/sign-in')

	const brandsData = await ArtistService.getBrandsByUserId(
		session.user?.id || ''
	)
	const brands = JSON.parse(JSON.stringify(brandsData))

	return (
		<PageWrapper pageName='profile'>
			<UserProfile user={session.user} brands={brands} />
		</PageWrapper>
	)
}
