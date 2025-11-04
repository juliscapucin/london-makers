import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
	const session = await auth.api.getSession({ headers: await headers() })
	if (!session) redirect('/sign-in')

	return (
		<main style={{ padding: 24 }}>
			<h1>Welcome {session.user?.name ?? 'friend'}</h1>
			<pre>{JSON.stringify(session, null, 2)}</pre>
		</main>
	)
}
