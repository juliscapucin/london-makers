'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { ArtistService } from '@/lib/services/artistService'
import { getUserSession } from '@/lib/getUserSession'
import { UserService } from '@/lib/services/userService'

type ActionState = {
	success: boolean
	error?: string
}

export async function bookmarkArtist(
	bookmarkArtistcurrentState: ActionState | null,
	formData: FormData
): Promise<ActionState> {
	try {
		const { user, session } = await getUserSession()
		if (!user || !session) {
			redirect('/auth/sign-in')
		}
		const userId = session.user.id
		const artistId = formData.get('artistId')?.toString()
		const isBookmarked = formData.get('isBookmarked') === 'true' // Current bookmark state

		if (!artistId) {
			return {
				success: false,
				error: 'Invalid artist ID',
			}
		}

		// If unbookmarking, remove the bookmark
		if (isBookmarked) {
			const removeSuccess = await UserService.removeUserBookmark(
				userId,
				artistId || ''
			)

			if (!removeSuccess) {
				return {
					success: false,
					error: 'Failed to remove bookmark',
				}
			}

			revalidatePath('/artists/saved')
			revalidatePath(`/artists/${artistId}`)
			return { success: true }
		}

		// If bookmarking, add the bookmark
		const bookmarkSuccess = await UserService.addUserBookmark(userId, artistId)

		if (!bookmarkSuccess) {
			return {
				success: false,
				error: 'Failed to bookmark artist',
			}
		}

		revalidatePath('/artists/saved')
		revalidatePath(`/artists/${artistId}`)
		return { success: true }
	} catch (error) {
		console.error('Error bookmarking artist:', error)
		return {
			success: false,
			error: 'An error occurred while bookmarking the artist',
		}
	}
}
