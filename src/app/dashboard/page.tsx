import { getUserSession } from '@/lib/getUserSession'
import { redirect } from 'next/navigation'
import { PageWrapper } from '@/components/ui'

export default async function Page() {
	const { session } = await getUserSession()
	if (!session) redirect('/signin')

	return (
		<PageWrapper pageName='dashboard'>
			<h1 className='heading-display'>Dashboard</h1>
			<h2>Welcome {session.user?.name ?? 'friend'}</h2>
		</PageWrapper>
	)
}
