'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { ArtistService } from '@/lib/services/artistService'
import { getUserSession } from '@/lib/getUserSession'
import { connectToDatabase } from '@/lib/services/database'
import cloudinary from '@/lib/cloudinaryConfig'

export type ActionState = {
	success: boolean
	error?: string
	artistId?: string
}

export async function updateArtist(
	currentState: ActionState | null,
	formData: FormData
): Promise<ActionState> {
	const { user, session } = await getUserSession()

	// Ensure user is authenticated
	if (!user || !session) {
		redirect('/auth/sign-in')
	}

	try {
		const userId = session.user.id
		const artistId = formData.get('artistId')?.toString().trim()

		if (!artistId) {
			return {
				success: false,
				error: 'Artist not found',
			}
		}
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
				error: "You don't have permission to update this artist",
			}
		}

		// Parse rates from form data
		const rates: Array<{ name: string; price: number }> = []

		// Get rates
		const rateNames = formData.getAll('rateName')
		const ratePrices = formData.getAll('ratePrice')

		for (let i = 0; i < rateNames.length; i++) {
			const name = rateNames[i]?.toString().trim()
			const priceStr = ratePrices[i]?.toString().trim()
			const price = priceStr ? parseFloat(priceStr) : NaN

			if (name && !isNaN(price)) {
				rates.push({ name, price })
			}
		}

		// Get arrays
		const specialties = formData
			.getAll('specialties')
			.map((s) => s.toString())
			.filter((s) => s.trim())

		// Validate required fields
		const type = formData.get('type')?.toString().trim()
		const description = formData.get('description')?.toString().trim()
		const businessName = formData.get('businessName')?.toString().trim()
		const artistName = formData.get('artistName')?.toString().trim()
		const email = formData.get('email')?.toString().trim()
		const street = formData.get('street')?.toString().trim()
		const city = formData.get('city')?.toString().trim()
		const zip = formData.get('zip')?.toString().trim()
		const images = formData
			.getAll('uploadedImages')
			.map((img) => img.toString().trim())

		console.log(images)

		if (
			!type ||
			!businessName ||
			!description ||
			!artistName ||
			!email ||
			!street ||
			!city ||
			!zip
		) {
			return {
				success: false,
				error: 'One or more required fields are missing',
			}
		}

		if (images.length === 0) {
			return {
				success: false,
				error: 'At least one image is required',
			}
		}

		// Build cleaned data
		const cleanedData = {
			owner: session.user.id,
			businessName,
			artist_info: {
				name: artistName,
				email,
				phone: formData.get('phone')?.toString().trim() || undefined,
				website: formData.get('website')?.toString().trim() || undefined,
			},
			type,
			description,
			location: {
				street,
				city,
				state: formData.get('state')?.toString().trim() || undefined,
				zip,
			},
			employees:
				Number(formData.get('employees')?.toString().trim()) || undefined,
			physical_stores:
				Number(formData.get('physicalStores')?.toString().trim()) || undefined,
			socials: {
				instagram: formData.get('instagram')?.toString().trim() || undefined,
				facebook: formData.get('facebook')?.toString().trim() || undefined,
				bluesky: formData.get('bluesky')?.toString().trim() || undefined,
				tiktok: formData.get('tiktok')?.toString().trim() || undefined,
			},
			rates,
			specialties,
			is_featured: formData.get('isFeatured') === 'on',
			images,
		}

		// Ensure database connection before saving
		await connectToDatabase()

		// Update the artist
		const updatedArtist = await ArtistService.updateArtist(
			artistId,
			cleanedData
		)

		if (updatedArtist) {
			revalidatePath(`/artists/${updatedArtist._id.toString()}`)
			return { success: true, artistId: updatedArtist._id.toString() }
		} else {
			return {
				success: false,
				error: 'Failed to update artist',
			}
		}
	} catch (error) {
		console.error('Error creating artist:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to create artist',
		}
	}
}
