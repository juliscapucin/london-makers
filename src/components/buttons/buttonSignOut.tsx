'use client'

import { authClient } from '@/lib/auth-client'
import { useState } from 'react'

export default function SignInButton() {
	const { signOut } = authClient

	const handleGoogleSignOut = async () => {
		try {
			await signOut()
		} catch (error) {
			console.error('Sign out error:', error)
		}
	}

	return (
		<button onClick={handleGoogleSignOut} className='btn-ghost'>
			Sign Out
		</button>
	)
}
