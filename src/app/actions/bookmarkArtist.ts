'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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
		const artistId = formData.get('artistId')?.toString()
		const isBookmarked = formData.get('isBookmarked') === 'true' // Current bookmark state

		console.log(user._id?.toString())
		if (!artistId || !user._id) {
			return {
				success: false,
				error: 'Invalid ID',
			}
		}

		const toggleSuccess = await UserService.toggleUserBookmark(
			user._id.toString(),
			artistId,
			isBookmarked
		)

		if (!toggleSuccess) {
			return {
				success: false,
				error: `Failed to ${isBookmarked ? 'remove' : 'add'} bookmark`,
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
