import { connectToDatabase } from './database'
import Artist from '@/lib/models/Artist'
import { ArtistType } from '@/types'

export class ArtistService {
	/**
	 * Get featured artists for the homepage
	 */
	static async getFeaturedArtists(limit = 3): Promise<ArtistType[]> {
		try {
			await connectToDatabase()

			const artists = await Artist.find({ is_featured: true })
				.select('businessName artist_info type images _id createdAt updatedAt')
				.sort({ createdAt: -1 })
				.limit(limit)
				.lean()

			return artists as unknown as ArtistType[]
		} catch (error) {
			console.error('Error fetching featured artists:', error)
			return []
		}
	}

	/**
	 * Get recent artists as fallback when no featured artists exist
	 */
	static async getRecentArtists(limit = 3): Promise<ArtistType[]> {
		try {
			await connectToDatabase()

			const artists = await Artist.find({})
				.select('businessName artist_info type images _id createdAt updatedAt')
				.sort({ createdAt: -1 })
				.limit(limit)
				.lean()

			return artists as unknown as ArtistType[]
		} catch (error) {
			console.error('Error fetching recent artists:', error)
			return []
		}
	}

	/**
	 * Get artists for homepage - featured first, then recent as fallback
	 */
	static async getHomepageArtists(limit = 3): Promise<ArtistType[]> {
		try {
			const featuredArtists = await this.getFeaturedArtists(limit)

			// If we have enough featured artists, return them
			if (featuredArtists.length >= limit) {
				return featuredArtists
			}

			// Otherwise, get recent artists to fill the gap
			const recentArtists = await this.getRecentArtists(
				limit - featuredArtists.length
			)

			// Combine and remove duplicates
			const allArtists = [...featuredArtists, ...recentArtists]
			const uniqueArtists = allArtists.filter(
				(artist, index, self) =>
					index ===
					self.findIndex((a) => a._id.toString() === artist._id.toString())
			)

			return uniqueArtists.slice(0, limit)
		} catch (error) {
			console.error('Error fetching homepage artists:', error)
			return []
		}
	}

	/**
	 * Get artist by ID
	 */
	static async getArtistById(id: string): Promise<ArtistType | null> {
		try {
			await connectToDatabase()
			return (await Artist.findById(id).lean()) as ArtistType | null
		} catch (error) {
			console.error('Error fetching artist:', error)
			return null
		}
	}

	/**
	 * Get brands by user ID
	 */
	static async getBrandsByUserId(userId: string): Promise<ArtistType[]> {
		try {
			await connectToDatabase()
			return (await Artist.find({
				owner: userId,
			}).lean()) as unknown as ArtistType[]
		} catch (error) {
			console.error('Error fetching brands by user ID:', error)
			return []
		}
	}

	/**
	 * Delete artist by ID
	 */
	static async deleteArtist(artistId: string): Promise<void> {
		try {
			await connectToDatabase()
			await Artist.findByIdAndDelete(artistId)
		} catch (error) {
			console.error('Error deleting artist:', error)
			throw new Error('Failed to delete artist')
		}
	}
}
