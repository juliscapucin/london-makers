'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { ArtistService } from '@/lib/services/artistService'
import { getUserSession } from '@/lib/getUserSession'
import { connectToDatabase } from '@/lib/services/database'

type ActionState = {
	success: boolean
	error?: string
	artistId?: string
}

type ArtistFormData = {
	owner: string
	businessName: string
	artist_info: {
		name: string
		email: string
		phone?: string
		website?: string
	}
	type: string
	description: string
	location: {
		street: string
		city: string
		state?: string
		zip: string
	}
	employees?: number
	physical_stores?: number
	socials: {
		instagram?: string
		facebook?: string
		bluesky?: string
		tiktok?: string
	}
	rates: Array<{ name: string; price: number }>
	specialties: string[]
	is_featured: boolean
	images: string[]
}

// Helper function to parse form data
function parseFormData(
	formData: FormData,
	userId: string
): { data: ArtistFormData | null; error?: string } {
	try {
		// Parse rates from form data
		const rates: Array<{ name: string; price: number }> = []
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

		// Retrieve required fields
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
			.filter((img) => img) // Remove empty strings

		// Validate required fields
		const requiredFields = [
			{ value: type, field: 'Type' },
			{ value: businessName, field: 'Business name' },
			{ value: description, field: 'Description' },
			{ value: artistName, field: 'Artist name' },
			{ value: email, field: 'Email' },
			{ value: street, field: 'Street address' },
			{ value: city, field: 'City' },
			{ value: zip, field: 'ZIP code' },
		]

		for (const { value, field } of requiredFields) {
			if (!value) {
				return { data: null, error: `${field} is required` }
			}
		}

		if (images.length === 0) {
			return { data: null, error: 'At least one image is required' }
		}

		// Build cleaned data
		const cleanedData: ArtistFormData = {
			owner: userId,
			businessName: businessName!,
			artist_info: {
				name: artistName!,
				email: email!,
				phone: formData.get('phone')?.toString().trim() || undefined,
				website: formData.get('website')?.toString().trim() || undefined,
			},
			type: type!,
			description: description!,
			location: {
				street: street!,
				city: city!,
				state: formData.get('state')?.toString().trim() || undefined,
				zip: zip!,
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

		return { data: cleanedData }
	} catch (error) {
		return {
			data: null,
			error: error instanceof Error ? error.message : 'Error parsing form data',
		}
	}
}

// Combined function for both add and update
export async function saveArtist(
	currentState: ActionState | null,
	formData: FormData
): Promise<ActionState> {
	const { userSession, session } = await getUserSession()

	// Ensure user is authenticated
	if (!userSession || !session) {
		redirect('/auth/signin')
	}

	// Check if we're editing an existing artist
	const artistId = formData.get('artistId')?.toString().trim()
	const isEdit = Boolean(artistId)

	try {
		// Authorization check
		if (isEdit) {
			// For editing, check if user owns the artist
			const artist = await ArtistService.getArtistById(artistId!)
			if (!artist) {
				return {
					success: false,
					error: 'Artist not found',
				}
			}

			if (
				!(await ArtistService.isUserOwnerOfArtist(userSession.id, artistId!)) &&
				userSession.role !== 'admin'
			) {
				return {
					success: false,
					error: "You don't have permission to update this artist",
				}
			}
		} else {
			// For creating, check if user is admin
			if (userSession.role !== 'admin') {
				return {
					success: false,
					error: 'Admin access required',
				}
			}
		}

		// Parse form data
		const { data: cleanedData, error: parseError } = parseFormData(
			formData,
			userSession.id
		)

		if (parseError || !cleanedData) {
			return {
				success: false,
				error: parseError || 'Invalid form data',
			}
		}

		// Ensure database connection
		await connectToDatabase()

		let result
		if (isEdit) {
			// Update existing artist
			result = await ArtistService.updateArtist(artistId!, cleanedData)
		} else {
			// Create new artist
			result = await ArtistService.addArtist(cleanedData)
		}

		if (result) {
			// Revalidate relevant paths
			revalidatePath('/artists')
			revalidatePath(`/artists/${result._id.toString()}`)

			return {
				success: true,
				artistId: result._id.toString(),
			}
		} else {
			return {
				success: false,
				error: `Failed to ${isEdit ? 'update' : 'create'} artist`,
			}
		}
	} catch (error) {
		console.error(`Error ${artistId ? 'updating' : 'creating'} artist:`, error)
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: `Failed to ${artistId ? 'update' : 'create'} artist`,
		}
	}
}
