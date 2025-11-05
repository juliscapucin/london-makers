import { getUserSession } from '@/lib/getUserSession'
import { redirect } from 'next/navigation'
import { PageWrapper } from '@/components/ui'

export default async function Profile() {
	const { session } = await getUserSession()
	if (!session) redirect('/sign-in')

	return (
		<PageWrapper pageName='profile'>
			<h1 className='heading-display'>Profile</h1>
			<h2>Welcome {session.user?.name ?? 'friend'}</h2>
			{/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
		</PageWrapper>
	)
}
