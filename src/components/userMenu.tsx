'use client'

import Image from 'next/image'

import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import { useState } from 'react'

export default function UserMenu() {
	const { signOut, useSession } = authClient
	const { data: session, isPending } = useSession()
	const [isOpen, setIsOpen] = useState(false)

	if (isPending) {
		return <div className='w-8 h-8 bg-accent-2 rounded-full animate-pulse' />
	}

	if (!session) {
		return (
			<Link href='/auth/signin' className='btn-ghost'>
				Sign In
			</Link>
		)
	}

	const handleSignOut = async () => {
		await signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = '/'
				},
			},
		})
	}

	return (
		<div className='relative'>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors'>
				<Image
					src={session.user.image || '/default-avatar.png'}
					alt={session.user.name || 'User'}
					className='w-8 h-8 rounded-full'
					width={32}
					height={32}
				/>
				<span className='text-sm font-medium'>{session.user.name}</span>
			</button>

			{isOpen && (
				<div className='absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
					<div className='p-2'>
						<Link
							href='/dashboard'
							className='block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded'
							onClick={() => setIsOpen(false)}>
							Dashboard
						</Link>
						<Link
							href='/profile'
							className='block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded'
							onClick={() => setIsOpen(false)}>
							Profile
						</Link>
						<hr className='my-1' />
						<button
							onClick={handleSignOut}
							className='w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded'>
							Sign Out
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
