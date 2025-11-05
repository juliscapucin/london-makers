'use server'

import { revalidatePath } from 'next/cache'

import Artist from '@/lib/models/Artist'
import { getUserSession } from '@/lib/getUserSession'
import { connectToDatabase } from '@/lib/services/database'

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
			return { success: false, error: 'Admin access required' }
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

		const images = formData
			.getAll('images')
			.map((i) => i.toString())
			.filter((i) => i.trim())

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
			businessName: formData.get('businessName'),
			artist_info: {
				name: artistName,
				email,
				phone: formData.get('phone') || undefined,
				website: formData.get('website') || undefined,
			},
			type: formData.get('type')?.toString().trim(),
			description: formData.get('description')?.toString().trim(),
			location: {
				street: formData.get('street')?.toString().trim(),
				city: formData.get('city')?.toString().trim(),
				state: formData.get('state')?.toString().trim(),
				zip: formData.get('zip')?.toString().trim(),
			},
			employees: formData.get('employees')
				? Number(formData.get('employees'))
				: undefined,
			physical_stores: formData.get('physicalStores')
				? Number(formData.get('physicalStores'))
				: undefined,
			socials: {
				instagram: formData.get('instagram')?.toString().trim() || undefined,
				facebook: formData.get('facebook')?.toString().trim() || undefined,
				bluesky: formData.get('bluesky')?.toString().trim() || undefined,
				tiktok: formData.get('tiktok')?.toString().trim() || undefined,
			},
			rates,
			specialties,
			images,
			is_featured: formData.get('isFeatured') === 'on',
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
