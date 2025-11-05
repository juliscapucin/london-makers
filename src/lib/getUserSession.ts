import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { UserService } from '@/lib/services/userService'
import { connectToDatabase } from './services/database'

export const getUserSession = async () => {
	await connectToDatabase()
	// Check authentication and admin role
	const session = await auth.api.getSession({ headers: await headers() })
	if (!session || !session.user) redirect('auth/sign-in')

	const user = await UserService.getUserById(session.user.id)

	return { user, session }
}
