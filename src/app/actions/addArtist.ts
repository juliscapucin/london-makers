'use server'

import { revalidatePath } from 'next/cache'

import Artist from '@/lib/models/Artist'
import { getUserSession } from '@/lib/getUserSession'
import { connectToDatabase } from '@/lib/services/database'
import cloudinary from '@/lib/cloudinaryConfig'

export type ActionState = {
	success: boolean
	error?: string
	artistId?: string
}

export async function addArtist(
	currentState: ActionState | null,
	formData: FormData
): Promise<ActionState> {
	try {
		const { user, session } = await getUserSession()
		if (!user || !session || user.role !== 'admin') {
			return {
				success: false,
				error: 'Admin access required',
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
		const businessName = formData.get('businessName')?.toString().trim()
		const artistName = formData.get('artistName')?.toString().trim()
		const email = formData.get('email')?.toString().trim()

		if (!businessName || !artistName || !email) {
			return {
				success: false,
				error: 'One or more required fields are missing',
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
			type: formData.get('type')?.toString().trim() || undefined,
			description: formData.get('description')?.toString().trim() || undefined,
			location: {
				street: formData.get('street')?.toString().trim() || undefined,
				city: formData.get('city')?.toString().trim() || undefined,
				state: formData.get('state')?.toString().trim() || undefined,
				zip: formData.get('zip')?.toString().trim() || undefined,
			},
			employees: formData.get('employees')?.toString().trim() || undefined,
			physical_stores:
				formData.get('physicalStores')?.toString().trim() || undefined,
			socials: {
				instagram: formData.get('instagram')?.toString().trim() || undefined,
				facebook: formData.get('facebook')?.toString().trim() || undefined,
				bluesky: formData.get('bluesky')?.toString().trim() || undefined,
				tiktok: formData.get('tiktok')?.toString().trim() || undefined,
			},
			rates,
			specialties,
			is_featured: formData.get('isFeatured') === 'on',
			images: [] as string[], // Will be populated after upload
		}

		// Handle + populate image uploads
		const images = formData.getAll('images')
		for (const image of images) {
			if (image instanceof File && image.size > 0) {
				const imageBuffer = await image.arrayBuffer()
				const imageArray = new Uint8Array(imageBuffer)
				const imageData = Buffer.from(imageArray)

				const imageType = image.type || 'image/jpeg' // Default to jpeg if type is missing

				// Convert to base64 data URI
				const base64Image = `data:${imageType};base64,${imageData.toString(
					'base64'
				)}`

				// Upload to Cloudinary
				const uploadResult = await cloudinary.uploader.upload(base64Image, {
					folder: 'london-makers/artists',
					use_filename: true,
					unique_filename: true,
					resource_type: 'image',
				})

				// Add the secure URL to images array
				if (uploadResult && uploadResult.secure_url) {
					cleanedData.images.push(uploadResult.secure_url)
				}
			}
		}

		// Ensure database connection before saving
		await connectToDatabase()

		// Create the artist
		const newArtist = new Artist(cleanedData)
		await newArtist.save()

		// Revalidate the artists page
		revalidatePath('/artists')

		return { success: true, artistId: newArtist._id.toString() }
	} catch (error) {
		console.error('Error creating artist:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to create artist',
		}
	}
}
