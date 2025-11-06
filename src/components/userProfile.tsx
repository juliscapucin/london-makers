'use client'

import Link from 'next/link'

import { deleteArtist } from '@/app/actions'
import { useNotifications } from '@/contexts'

type UserProfileProps = {
	user: {
		name: string | null
		email: string | null
		role: string | null
	}
	brands: {
		_id: string
		businessName: string | null
		images: string[]
	}[]
}

export default function UserProfile({ user, brands }: UserProfileProps) {
	const { showSuccess, showError } = useNotifications()

	const handleDeleteArtist = async (brandId: string) => {
		const confirmed = window.confirm(
			'Are you sure you want to delete this artist? This action cannot be undone.'
		)

		if (confirmed) {
			const result = await deleteArtist(brandId)
			if (!result) return
			if (result.success && result.message) {
				showSuccess(result.message, 'Success', 5000)
			} else if (result.error) {
				showError(result.error, 'Error', 8000)
			}
		}
	}

	return (
		<div>
			<header className='mb-16'>
				<h1 className='heading-display'>Profile</h1>
				<h2>Welcome {user.name ?? 'friend'}</h2>
			</header>
			<div className='w-full flex'>
				{/* LEFT / PROFILE DETAILS */}
				<div className='flex-1/4'>
					<h3 className='heading-headline'>User Information</h3>

					<ul>
						<li>Name: {user.name}</li>
						<li>Email: {user.email}</li>
						<li>Role: {user.role}</li>
					</ul>
				</div>

				{/* RIGHT / BRANDS */}
				<div className='flex-3/4 border-l border-accent-1 ml-16 pl-8'>
					<h3 className='heading-headline'>Your Brands</h3>
					<ul>
						{brands.map((brand) => (
							<li key={brand._id} className='py-4 border-t border-accent-1'>
								<Link
									className='underlined-link heading-title mb-4'
									href={`/artists/${brand._id}`}>
									{brand.businessName}
								</Link>
								<div className='flex gap-8'>
									<Link
										className='btn btn-ghost'
										href={`/artists/${brand._id}/edit`}>
										Edit
									</Link>
									<button
										className='btn btn-ghost'
										onClick={() => handleDeleteArtist(brand._id)}>
										Delete
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}
