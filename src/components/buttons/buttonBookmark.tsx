'use client'

import { useActionState, useEffect } from 'react'

import { ArtistType } from '@/types'
import { IconBookmark } from '@/components/icons'
import { bookmarkArtist } from '@/app/actions/bookmarkArtist'
import { useNotifications } from '@/contexts'

type ButtonBookmarkProps = {
	artist: ArtistType
	isBookmarked?: boolean
	hasSession?: boolean
}

export default function ButtonBookmark({
	artist,
	isBookmarked,
	hasSession,
}: ButtonBookmarkProps) {
	const [state, formAction, isPending] = useActionState(bookmarkArtist, null)
	const { showSuccess, showError } = useNotifications()

	// Handle form state changes for notifications
	useEffect(() => {
		if (state?.success) {
			showSuccess(
				`Bookmark has been ${isBookmarked ? 'added' : 'removed'} successfully!`,
				'Success',
				5000
			)
		}
		if (state?.error) {
			showError(
				state.error,
				`Error ${isBookmarked ? 'Removing' : 'Adding'} Bookmark`,
				8000
			)
		}
	}, [state?.success, state?.error, showSuccess, showError, isBookmarked])

	if (!hasSession) {
		return (
			<button
				className='btn btn-ghost w-full'
				onClick={() => {
					showError(
						'Please sign in to bookmark artists',
						'Authentication Required'
					)
				}}>
				Bookmark Artist{' '}
				<span>
					<IconBookmark isBookmarked={isBookmarked} />
				</span>
			</button>
		)
	}

	return (
		<form action={formAction}>
			{/* Hidden input for artist ID */}
			<input type='hidden' name='artistId' value={artist._id.toString()} />

			<button type='submit' className='btn btn-ghost w-full'>
				{isBookmarked ? 'Remove Bookmark' : 'Bookmark Artist'}{' '}
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
