'use client'

import { useActionState, useEffect } from 'react'

import { ArtistType } from '@/types'
import { IconBookmark } from '@/components/icons'
import { bookmarkArtist } from '@/app/actions/bookmarkArtist'
import { useNotifications } from '@/contexts'

type ButtonBookmarkProps = {
	artist: ArtistType
	isBookmarked?: boolean
}

export default function ButtonBookmark({
	artist,
	isBookmarked,
}: ButtonBookmarkProps) {
	const [state, formAction, isPending] = useActionState(bookmarkArtist, null)
	const { showSuccess, showError } = useNotifications()

	console.log('is bookmarked: ', isBookmarked)

	// Handle form state changes
	useEffect(() => {
		if (state?.success) {
			showSuccess(
				`Artist has been ${
					isBookmarked ? 'bookmarked' : 'unbookmarked'
				} successfully!`,
				'Success',
				5000
			)
		}
		if (state?.error) {
			showError(state.error, `Error Bookmarking Artist`, 8000)
		}
	}, [state?.success, state?.error, showSuccess, showError, isBookmarked])

	return (
		<form action={formAction}>
			{/* Hidden input for artist ID */}
			<input type='hidden' name='artistId' value={artist._id.toString()} />
			<input
				type='hidden'
				name='isBookmarked'
				value={isBookmarked ? 'true' : 'false'}
			/>
			<button type='submit' className='btn btn-ghost w-full'>
				Bookmark Artist{' '}
				{isPending ? (
					<div className='spinner' />
				) : (
					<span>
						<IconBookmark isBookmarked={isBookmarked} />
					</span>
				)}
			</button>
		</form>
	)
}
