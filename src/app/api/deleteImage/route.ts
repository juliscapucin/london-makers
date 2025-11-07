import { NextRequest } from 'next/server'
import cloudinary from '@/lib/cloudinaryConfig'

export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const publicId = searchParams.get('publicId')

		if (!publicId) {
			console.log('No public ID provided')
			return Response.json({ error: 'No public ID provided' }, { status: 400 })
		}

		// Delete from Cloudinary
		const result = await cloudinary.uploader.destroy(
			`london-makers/artists/${publicId}`,
			{
				resource_type: 'image',
			}
		)

		if (result.result === 'ok' || result.result === 'not found') {
			return Response.json({
				success: true,
				message: 'Image deleted successfully',
				result: result.result,
			})
		} else {
			return Response.json(
				{
					error: 'Failed to delete image from Cloudinary',
				},
				{ status: 500 }
			)
		}
	} catch (error) {
		console.error('Delete error:', error)
		return Response.json({ error: 'Delete failed' }, { status: 500 })
	}
}
