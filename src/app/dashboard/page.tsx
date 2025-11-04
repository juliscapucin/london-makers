import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { PageWrapper } from '@/components/ui'

export default async function Dashboard() {
	const session = await auth.api.getSession({ headers: await headers() })
	if (!session) redirect('/sign-in')

	return (
		<PageWrapper pageName='dashboard'>
			<h1>Welcome {session.user?.name ?? 'friend'}</h1>
			{/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
		</PageWrapper>
	)
}
