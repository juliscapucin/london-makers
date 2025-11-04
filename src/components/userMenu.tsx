'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { authClient } from '@/lib/auth-client'

export default function UserMenu() {
	const { signOut, useSession } = authClient
	const { data: session, isPending } = useSession()
	const [isOpen, setIsOpen] = useState(false)
	const userMenuRef = useRef<HTMLDivElement>(null)

	// Close menu on outside click
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element
			if (!userMenuRef.current?.contains(target)) {
				setIsOpen(false)
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen])

	if (isPending) {
		return <div className='w-8 h-8 bg-accent-2 rounded-full animate-pulse' />
	}

	// If no session, show sign in link
	if (!session) {
		return (
			<Link href='/auth/signin' className='btn btn-ghost'>
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
		<div ref={userMenuRef} className='relative'>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='flex items-center gap-2 p-2 rounded-lg hover:bg-accent-2 transition-colors'>
				<div className='w-8 h-8 overflow-clip relative bg-accent-2 rounded-full flex items-center justify-center'>
					<Image
						src={session.user.image || '/images/Account.png'}
						alt={session.user.name || 'User'}
						className='w-8 h-8 rounded-full'
						width={24}
						height={24}
					/>
				</div>
				<span className='text-sm font-medium'>{session.user.name}</span>
			</button>

			{isOpen && (
				<div className='absolute right-0 mt-2 w-48 bg-accent-2 rounded-lg z-50'>
					<div className='p-2'>
						<Link
							href='/dashboard'
							className='block px-3 py-2 text-sm hover:bg-accent-3 rounded'
							onClick={() => setIsOpen(false)}>
							Dashboard
						</Link>
						<Link
							href='/profile'
							className='block px-3 py-2 text-sm hover:bg-accent-3 rounded'
							onClick={() => setIsOpen(false)}>
							Profile
						</Link>
						<button
							onClick={handleSignOut}
							className='w-full text-left px-3 py-2 text-sm hover:bg-accent-3 rounded'>
							Sign Out
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
