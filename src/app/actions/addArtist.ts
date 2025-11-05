'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import Artist from '@/lib/models/Artist'
import { getUserSession } from '@/lib/getUserSession'
import { connectToDatabase } from '@/lib/services/database'

async function addArtist(formData: FormData) {
	try {
		const { user, session } = await getUserSession()
		if (!user || !session || user.role !== 'admin') {
			redirect('/?error=access-denied')
		}

		console.log('Form Data received:', formData)

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

		// Filter out empty values
		const cleanedData = {
			owner: session.user.id,
			businessName: formData.get('businessName'),
			artist_info: {
				name: formData.get('artistName'),
				email: formData.get('email'),
				phone: formData.get('phone') || undefined,
				website: formData.get('website') || undefined,
			},
			type: formData.get('type'),
			description: formData.get('description'),
			location: {
				street: formData.get('street'),
				city: formData.get('city'),
				state: formData.get('state'),
				zip: formData.get('zip'),
			},
			employees: formData.get('employees') || undefined,
			physical_stores: formData.get('physicalStores') || undefined,
			socials: {
				instagram: formData.get('instagram') || undefined,
				facebook: formData.get('facebook') || undefined,
				bluesky: formData.get('bluesky') || undefined,
				tiktok: formData.get('tiktok') || undefined,
			},
			rates,
			specialties,
			images,
			is_featured: formData.get('isFeatured') === 'on' ? true : false,
		}

		console.log('Cleaned data:', cleanedData)

		// Ensure database connection before saving
		await connectToDatabase()

		// Create the artist
		const newArtist = new Artist(cleanedData)
		await newArtist.save()

		// Revalidate the artists listing page
		// revalidatePath('/artists', 'layout')

		console.log('Artist created successfully:', newArtist._id)
	} catch (error) {
		console.error('Database connection error:', error)
		redirect('/artists')
	}
	redirect(`/dashboard`)
}

export default addArtist
