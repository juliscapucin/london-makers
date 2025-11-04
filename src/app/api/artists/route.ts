import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import Artist from '@/lib/models/Artist'
import { UserService } from '@/lib/services/userService'
import mongoose from 'mongoose'

interface ArtistRequestBody {
	businessName: string
	type: string
	description: string
	artist_info: {
		name: string
		email: string
	}
	location: {
		street: string
		city: string
		state: string
		zip: string
	}
	[key: string]: unknown
}

export async function POST(req: Request) {
	try {
		// Check authentication
		const session = await auth.api.getSession({
			headers: req.headers,
		})

		if (!session?.user) {
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 }
			)
		}

		const user = await UserService.getUserById(session.user.id)

		// Check if user has admin role
		if (!user || user.role !== 'admin') {
			return NextResponse.json(
				{ error: 'Admin access required' },
				{ status: 403 }
			)
		}

		// Parse request body
		const artistData: ArtistRequestBody = await req.json()

		// Validate required fields
		const requiredFields = [
			'businessName',
			'artist_info.name',
			'artist_info.email',
			'type',
			'description',
			'location.street',
			'location.city',
			'location.state',
			'location.zip',
		] as const

		for (const field of requiredFields) {
			const fieldParts = field.split('.')
			let value: unknown = artistData

			for (const part of fieldParts) {
				if (typeof value === 'object' && value !== null && part in value) {
					value = (value as Record<string, unknown>)[part]
				} else {
					value = undefined
					break
				}
			}

			if (!value) {
				return NextResponse.json(
					{ error: `Missing required field: ${field}` },
					{ status: 400 }
				)
			}
		}

		// Check if business name already exists
		const existingArtist = await Artist.findOne({
			businessName: { $regex: new RegExp(`^${artistData.businessName}$`, 'i') },
		})

		if (existingArtist) {
			return NextResponse.json(
				{ error: 'Business name already exists' },
				{ status: 409 }
			)
		}

		// Create new artist
		const newArtist = new Artist({
			...artistData,
			owner: session.user.id || session.user.id?.toString(),
		})

		const savedArtist = await newArtist.save()

		return NextResponse.json(
			{
				message: 'Artist created successfully',
				artist: {
					id: savedArtist._id,
					businessName: savedArtist.businessName,
					type: savedArtist.type,
				},
			},
			{ status: 201 }
		)
	} catch (error: unknown) {
		console.error('Error creating artist:', error)

		// Handle duplicate key error
		if (
			typeof error === 'object' &&
			error !== null &&
			'code' in error &&
			(error as { code: number }).code === 11000
		) {
			return NextResponse.json(
				{ error: 'Business name already exists' },
				{ status: 409 }
			)
		}

		// Handle validation errors
		if (error instanceof mongoose.Error.ValidationError) {
			const messages = Object.values(error.errors).map(
				(err: mongoose.Error.ValidatorError | mongoose.Error.CastError) =>
					err.message
			)

			return NextResponse.json(
				{ error: `Validation error: ${messages.join(', ')}` },
				{ status: 400 }
			)
		}

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
