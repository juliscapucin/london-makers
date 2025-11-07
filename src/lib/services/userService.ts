import { connectToDatabase } from '@/lib/services/database'
import User from '@/lib/models/User'
import { Types } from 'mongoose'
import { ArtistType } from '@/types'

export type UserType = {
	_id: Types.ObjectId
	id: string
	name: string
	email: string
	emailVerified: boolean
	image?: string
	bookmarks: Types.ObjectId[]
	role: string
	createdAt: Date
	updatedAt: Date
}

export class UserService {
	/**
	 * Get user by ID (handles both better-auth string IDs and MongoDB ObjectIds)
	 */
	static async getUserById(userId: string): Promise<UserType | null> {
		try {
			await connectToDatabase()

			const user = await User.findOne({ id: userId }).lean<UserType>()

			return user ?? null
		} catch (error) {
			console.error('Error fetching user by ID:', error)
			return null
		}
	}

	/**
	 * Toggle artist in user's bookmarks
	 */
	static async toggleUserBookmark(
		userId: string,
		artistId: string
	): Promise<boolean> {
		try {
			await connectToDatabase()

			// Find the user to check current bookmark state
			const user = await User.findById(userId)

			if (!user) {
				console.error('User not found with ID:', userId)
				return false
			}

			// Check if artist is currently bookmarked
			const isCurrentlyBookmarked: boolean = user.bookmarks?.some(
				(bookmark: Types.ObjectId) => bookmark.toString() === artistId
			)

			if (isCurrentlyBookmarked) {
				// Remove bookmark
				const result = await User.updateOne(
					{ _id: user._id },
					{ $pull: { bookmarks: artistId } }
				)
				return result.modifiedCount > 0
			} else {
				// Add bookmark
				const result = await User.updateOne(
					{ _id: user._id },
					{ $addToSet: { bookmarks: artistId } }
				)
				return result.modifiedCount > 0
			}
		} catch (error) {
			console.error('Error toggling user bookmark:', error)
			return false
		}
	}

	/**
	 * Get user's bookmarks
	 */
	static async getUserBookmarks(userId: string): Promise<ArtistType[]> {
		try {
			await connectToDatabase()

			const user = await User.findById(userId).populate('bookmarks')

			return user?.bookmarks || []
		} catch (error) {
			console.error('Error fetching user bookmarks:', error)
			return []
		}
	}
}
