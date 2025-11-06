import { NextRequest } from 'next/server'
import cloudinary from '@/lib/cloudinaryConfig'

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData()
		const file = formData.get('file') as File

		if (!file) {
			return Response.json({ error: 'No file provided' }, { status: 400 })
		}

		// Validate file
		if (!file.type.startsWith('image/')) {
			return Response.json({ error: 'Invalid file type' }, { status: 400 })
		}

		if (file.size > 5 * 1024 * 1024) {
			// 5MB limit
			return Response.json({ error: 'File too large' }, { status: 400 })
		}

		// Convert to buffer
		const bytes = await file.arrayBuffer()
		const buffer = Buffer.from(bytes)

		// Upload to Cloudinary
		const result = await cloudinary.uploader.upload(
			`data:${file.type};base64,${buffer.toString('base64')}`,
			{
				folder: 'london-makers/artists',
				resource_type: 'image',
			}
		)

		return Response.json({
			url: result.secure_url,
			public_id: result.public_id,
		})
	} catch (error) {
		console.error('Upload error:', error)
		return Response.json({ error: 'Upload failed' }, { status: 500 })
	}
}
