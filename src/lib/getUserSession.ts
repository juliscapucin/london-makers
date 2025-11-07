import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { connectToDatabase } from './services/database'

export const getUserSession = async () => {
	await connectToDatabase()
	// Check authentication and admin role
	const session = await auth.api.getSession({ headers: await headers() })

	const userSession = session?.user

	return { userSession, session }
}
