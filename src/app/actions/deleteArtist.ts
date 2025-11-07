'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { getUserSession } from '@/lib/getUserSession'
import cloudinary from '@/lib/cloudinaryConfig'
import { ArtistService } from '@/lib/services/artistService'

export async function deleteArtist(artistId: string) {
	try {
		const { user, session } = await getUserSession()
		if (!user || !session) {
			redirect('/auth/signin')
		}
		const userId = session.user.id
		const artist = await ArtistService.getArtistById(artistId)

		if (!artist) {
			return {
				success: false,
				error: 'Artist not found',
			}
		}

		// Ensure the artist belongs to the user
		if (!(await ArtistService.isUserOwnerOfArtist(userId, artistId))) {
			return {
				success: false,
				error: "You don't have permission to delete this artist",
			}
		}

		// Delete associated images from Cloudinary
		const deletePromises = artist.images.map((imageUrl) => {
			// Extract public ID from the URL
			const segments = imageUrl.split('/')
			const publicIdWithExtension = segments[segments.length - 1] // Get the last segment
			const publicId = publicIdWithExtension.split('.')[0] // Remove file extension
			return cloudinary.uploader.destroy(`/london-makers/artists/${publicId}`)
		})

		await Promise.all(deletePromises)

		// Delete the artist from the database
		await ArtistService.deleteArtist(artistId)
		revalidatePath('/profile')
		return { success: true, message: 'Artist deleted successfully' }
	} catch (error) {
		console.error('Error deleting artist images from Cloudinary:', error)
	}

	revalidatePath('/profile')
}
