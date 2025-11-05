'use server'

import { revalidatePath } from 'next/cache'

import Artist from '@/lib/models/Artist'
import { getUserSession } from '@/lib/getUserSession'
import { connectToDatabase } from '@/lib/services/database'
import cloudinary from '@/lib/cloudinaryConfig'

type FormValues = {
	businessName: string
	artistName: string
	email: string
	phone: string
	website: string
	type: string
	description: string
	street: string
	city: string
	state: string
	zip: string
	employees: string
	physicalStores: string
	instagram: string
	facebook: string
	bluesky: string
	tiktok: string
	rates: {
		name: string
		price: number
	}[]
	specialties: string[]
	images: string[]
	isFeatured: boolean
}

export type ActionState = {
	success: boolean
	error?: string
	artistId?: string
}

export async function addArtist(
	currentState: ActionState | null,
	formData: FormData
): Promise<ActionState> {
	// Preserve form values for re-population in case of error
	const formValues: FormValues = {
		businessName: formData.get('businessName')?.toString() || '',
		artistName: formData.get('artistName')?.toString() || '',
		email: formData.get('email')?.toString() || '',
		phone: formData.get('phone')?.toString() || '',
		website: formData.get('website')?.toString() || '',
		type: formData.get('type')?.toString() || '',
		description: formData.get('description')?.toString() || '',
		street: formData.get('street')?.toString() || '',
		city: formData.get('city')?.toString() || '',
		state: formData.get('state')?.toString() || '',
		zip: formData.get('zip')?.toString() || '',
		employees: formData.get('employees')?.toString() || '',
		physicalStores: formData.get('physicalStores')?.toString() || '',
		instagram: formData.get('instagram')?.toString() || '',
		facebook: formData.get('facebook')?.toString() || '',
		bluesky: formData.get('bluesky')?.toString() || '',
		tiktok: formData.get('tiktok')?.toString() || '',
		rates: [],
		specialties: formData
			.getAll('specialties')
			.map((s) => s.toString())
			.filter((s) => s.trim()),
		images: [],
		isFeatured: formData.get('isFeatured') === 'on',
	}

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

		// Filter out empty values
		const cleanedData = {
			owner: session.user.id,
			businessName,
			artist_info: {
				name: artistName,
				email,
				phone: formValues.phone || undefined,
				website: formValues.website || undefined,
			},
			type: formValues.type || undefined,
			description: formValues.description || undefined,
			location: {
				street: formValues.street || undefined,
				city: formValues.city || undefined,
				state: formValues.state || undefined,
				zip: formValues.zip || undefined,
			},
			employees: formValues.employees || undefined,
			physical_stores: formValues.physicalStores || undefined,
			socials: {
				instagram: formValues.instagram || undefined,
				facebook: formValues.facebook || undefined,
				bluesky: formValues.bluesky || undefined,
				tiktok: formValues.tiktok || undefined,
			},
			rates,
			specialties,
			is_featured: formValues.isFeatured,
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
					folder: 'artists',
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
