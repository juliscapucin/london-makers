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
	 * Sync better-auth user with custom User model
	 */
	static async ensureUserExists(authUser: UserType): Promise<UserType | null> {
		try {
			await connectToDatabase()

			// Create fallback name if not provided
			const fallbackName =
				authUser.name?.trim() ||
				(authUser.email ? authUser.email.split('@')[0] : 'User')

			// Find or create user in custom model
			const user = await User.findOneAndUpdate(
				{
					$or: [{ id: authUser.id }, { email: authUser.email }],
				},
				{
					$setOnInsert: {
						id: authUser.id,
						email: authUser.email,
						name: fallbackName,
						image: authUser.image || '',
						emailVerified: Boolean(authUser.emailVerified),
						bookmarks: [],
						role: 'user',
					},
					$set: {
						// Keep these synced on every login
						name: fallbackName,
						image: authUser.image || '',
						emailVerified: Boolean(authUser.emailVerified),
						updatedAt: new Date(),
					},
				},
				{
					upsert: true,
					new: true,
					setDefaultsOnInsert: true,
				}
			).lean()

			return user as unknown as UserType
		} catch (error) {
			console.error('Error ensuring user exists:', error)
			return null
		}
	}

	/**
	 * Get user by ID (handles both better-auth string IDs and MongoDB ObjectIds)
	 */
	static async getUserById(id: string): Promise<UserType | null> {
		try {
			await connectToDatabase()

			const user = await User.findOne({ _id: id }).lean<UserType>().exec()

			return user ?? null
		} catch (error) {
			console.error('Error fetching user by ID:', error)
			return null
		}
	}

	/**
	 * Toggle artist in user's bookmarks (add if not present, remove if present)
	 */
	static async toggleUserBookmark(
		userId: string,
		artistId: string,
		isBookmarked: boolean
	): Promise<boolean> {
		try {
			await connectToDatabase()

			const userQuery = {
				$or: [
					{ id: userId },
					...(Types.ObjectId.isValid(userId)
						? [{ _id: new Types.ObjectId(userId) }]
						: []),
				],
			}

			let result
			if (isBookmarked) {
				// Remove bookmark
				result = await User.updateOne(userQuery, {
					$pull: { bookmarks: artistId },
				}).exec()
			} else {
				// Add bookmark
				result = await User.updateOne(userQuery, {
					$addToSet: { bookmarks: artistId },
				}).exec()
			}

			return true
		} catch (error) {
			console.error('Error toggling user bookmark:', error)
			return false
		}
	}
}
