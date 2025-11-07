import { connectToDatabase } from '@/lib/services/database'
import User from '@/lib/models/User'
import { Types } from 'mongoose'

export type UserType = {
	_id?: Types.ObjectId
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

			const user = await User.findOne({ id: userId }).lean<UserType>().exec()

			return user ?? null
		} catch (error) {
			console.error('Error fetching user by ID:', error)
			return null
		}
	}

	/**
	 * Toggle artist in user's bookmarks (add if not present, remove if present)
	 */
	// static async toggleUserBookmark(
	// 	userId: string,
	// 	artistId: string,
	// 	isBookmarked: boolean
	// ): Promise<boolean> {
	// 	try {
	// 		await connectToDatabase()

	// 		const userQuery = {
	// 			$or: [
	// 				{ id: userId },
	// 				...(Types.ObjectId.isValid(userId)
	// 					? [{ _id: new Types.ObjectId(userId) }]
	// 					: []),
	// 			],
	// 		}

	// 		if (isBookmarked) {
	// 			// Remove bookmark
	// 			await User.updateOne(userQuery, {
	// 				$pull: { bookmarks: artistId },
	// 			}).exec()
	// 		} else {
	// 			// Add bookmark
	// 			await User.updateOne(userQuery, {
	// 				$addToSet: { bookmarks: artistId },
	// 			}).exec()
	// 		}

	// 		return true
	// 	} catch (error) {
	// 		console.error('Error toggling user bookmark:', error)
	// 		return false
	// 	}
	// }

	/**
	 * Toggle artist in user's bookmarks - determines current state from database
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
}
