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

			// Try to find by better-auth 'id' first, then by MongoDB '_id' if it's a valid ObjectId
			const query = Types.ObjectId.isValid(id)
				? { $or: [{ id }, { _id: new Types.ObjectId(id) }] }
				: { id }

			const user = await User.findOne(query).lean()

			return user as UserType | null
		} catch (error) {
			console.error('Error fetching user by ID:', error)
			return null
		}
	}

	/**
	 * Get user by email
	 */
	static async getUserByEmail(email: string): Promise<UserType | null> {
		try {
			await connectToDatabase()

			const user = await User.findOne({ email }).lean()

			return user as UserType | null
		} catch (error) {
			console.error('Error fetching user by email:', error)
			return null
		}
	}

	/**
	 * Get user with custom fields from session
	 */
	static async getUserFromSession(
		sessionUser: UserType
	): Promise<UserType | null> {
		try {
			await connectToDatabase()

			// Ensure user exists first
			await this.ensureUserExists(sessionUser)

			// Get user with populated bookmarks
			const user = await User.findOne({
				$or: [{ id: sessionUser.id }, { email: sessionUser.email }],
			})
				.populate('bookmarks')
				.lean()

			return user as UserType | null
		} catch (error) {
			console.error('Error getting user from session:', error)
			return null
		}
	}

	/**
	 * Add bookmark for user
	 */
	static async addBookmark(
		userId: string,
		artistId: string
	): Promise<{ success: boolean; error?: string }> {
		try {
			await connectToDatabase()

			// Validate artistId as ObjectId
			if (!Types.ObjectId.isValid(artistId)) {
				return { success: false, error: 'Invalid artist ID' }
			}

			const result = await User.findOneAndUpdate(
				{
					$or: [
						{ id: userId },
						...(Types.ObjectId.isValid(userId)
							? [{ _id: new Types.ObjectId(userId) }]
							: []),
					],
				},
				{
					$addToSet: { bookmarks: new Types.ObjectId(artistId) }, // Prevents duplicates
				},
				{ new: true }
			)

			if (!result) {
				return { success: false, error: 'User not found' }
			}

			return { success: true }
		} catch (error: unknown) {
			console.error('Error adding bookmark:', error)
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error'
			return { success: false, error: errorMessage }
		}
	}

	/**
	 * Remove bookmark for user
	 */
	static async removeBookmark(
		userId: string,
		artistId: string
	): Promise<{ success: boolean; error?: string }> {
		try {
			await connectToDatabase()

			// Validate artistId as ObjectId
			if (!Types.ObjectId.isValid(artistId)) {
				return { success: false, error: 'Invalid artist ID' }
			}

			const result = await User.findOneAndUpdate(
				{
					$or: [
						{ id: userId },
						...(Types.ObjectId.isValid(userId)
							? [{ _id: new Types.ObjectId(userId) }]
							: []),
					],
				},
				{
					$pull: { bookmarks: new Types.ObjectId(artistId) },
				},
				{ new: true }
			)

			if (!result) {
				return { success: false, error: 'User not found' }
			}

			return { success: true }
		} catch (error: unknown) {
			console.error('Error removing bookmark:', error)
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error'
			return { success: false, error: errorMessage }
		}
	}

	/**
	 * Get user's bookmarked artists
	 */
	// static async getUserBookmarks(userId: string): Promise<any[]> {
	// 	try {
	// 		await connectToDatabase()

	// 		const user = await User.findOne({
	// 			$or: [
	// 				{ id: userId },
	// 				...(Types.ObjectId.isValid(userId)
	// 					? [{ _id: new Types.ObjectId(userId) }]
	// 					: []),
	// 			],
	// 		})
	// 			.populate({
	// 				path: 'bookmarks',
	// 				select: 'businessName artist_info type images _id',
	// 			})
	// 			.lean() as (UserType & { bookmarks: any[] }) | null

	// 		return user?.bookmarks || []
	// 	} catch (error) {
	// 		console.error('Error fetching user bookmarks:', error)
	// 		return []
	// 	}
	// }

	/**
	 * Update user role (admin only)
	 */
	static async updateUserRole(
		userId: string,
		newRole: string,
		adminUserId: string
	): Promise<{ success: boolean; error?: string }> {
		try {
			await connectToDatabase()

			// Check if the admin user has admin role
			const adminUser = (await User.findOne({
				$or: [
					{ id: adminUserId },
					...(Types.ObjectId.isValid(adminUserId)
						? [{ _id: new Types.ObjectId(adminUserId) }]
						: []),
				],
			}).lean()) as UserType | null

			if (!adminUser || adminUser.role !== 'admin') {
				return { success: false, error: 'Admin access required' }
			}

			// Update user role
			const result = await User.findOneAndUpdate(
				{
					$or: [
						{ id: userId },
						...(Types.ObjectId.isValid(userId)
							? [{ _id: new Types.ObjectId(userId) }]
							: []),
					],
				},
				{
					role: newRole,
					updatedAt: new Date(),
				},
				{ new: true }
			)

			if (!result) {
				return { success: false, error: 'User not found' }
			}

			return { success: true }
		} catch (error: unknown) {
			console.error('Error updating user role:', error)
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error'
			return { success: false, error: errorMessage }
		}
	}

	/**
	 * Get all users (admin only)
	 */
	static async getAllUsers(
		adminUserId: string,
		page = 1,
		limit = 20
	): Promise<{ users: UserType[]; total: number; error?: string } | null> {
		try {
			await connectToDatabase()

			// Check admin permissions
			const adminUser = (await User.findOne({
				$or: [
					{ id: adminUserId },
					...(Types.ObjectId.isValid(adminUserId)
						? [{ _id: new Types.ObjectId(adminUserId) }]
						: []),
				],
			}).lean()) as UserType | null

			if (!adminUser || adminUser.role !== 'admin') {
				return { users: [], total: 0, error: 'Admin access required' }
			}

			const skip = (page - 1) * limit

			const [users, total] = await Promise.all([
				User.find({})
					.select('id name email role emailVerified createdAt updatedAt')
					.sort({ createdAt: -1 })
					.skip(skip)
					.limit(limit)
					.lean(),
				User.countDocuments({}),
			])

			return {
				users: users as unknown as UserType[],
				total,
			}
		} catch (error) {
			console.error('Error fetching all users:', error)
			return null
		}
	}

	/**
	 * Delete user (admin only)
	 */
	static async deleteUser(
		userId: string,
		adminUserId: string
	): Promise<{ success: boolean; error?: string }> {
		try {
			await connectToDatabase()

			// Check admin permissions
			const adminUser = (await User.findOne({
				$or: [
					{ id: adminUserId },
					...(Types.ObjectId.isValid(adminUserId)
						? [{ _id: new Types.ObjectId(adminUserId) }]
						: []),
				],
			}).lean()) as UserType | null

			if (!adminUser || adminUser.role !== 'admin') {
				return { success: false, error: 'Admin access required' }
			}

			// Prevent admin from deleting themselves
			if (adminUserId === userId) {
				return { success: false, error: 'Cannot delete your own account' }
			}

			const result = await User.findOneAndDelete({
				$or: [
					{ id: userId },
					...(Types.ObjectId.isValid(userId)
						? [{ _id: new Types.ObjectId(userId) }]
						: []),
				],
			})

			if (!result) {
				return { success: false, error: 'User not found' }
			}

			return { success: true }
		} catch (error: unknown) {
			console.error('Error deleting user:', error)
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error'
			return { success: false, error: errorMessage }
		}
	}

	/**
	 * Check if user has admin role
	 */
	static async isAdmin(userId: string): Promise<boolean> {
		try {
			await connectToDatabase()

			const user = (await User.findOne({
				$or: [
					{ id: userId },
					...(Types.ObjectId.isValid(userId)
						? [{ _id: new Types.ObjectId(userId) }]
						: []),
				],
			}).lean()) as UserType | null

			return user?.role === 'admin' || false
		} catch (error) {
			console.error('Error checking admin status:', error)
			return false
		}
	}

	/**
	 * Get user statistics (admin only)
	 */
	static async getUserStats(adminUserId: string): Promise<{
		totalUsers: number
		adminUsers: number
		regularUsers: number
		recentUsers: number
		usersWithBookmarksCount: number
	} | null> {
		try {
			await connectToDatabase()

			// Check admin permissions
			const isAdminUser = await this.isAdmin(adminUserId)
			if (!isAdminUser) {
				return null
			}

			const [totalUsers, adminUsers, recentUsers, usersWithBookmarksCount] =
				await Promise.all([
					User.countDocuments({}),
					User.countDocuments({ role: 'admin' }),
					User.countDocuments({
						createdAt: {
							$gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
						},
					}),
					User.countDocuments({
						bookmarks: { $exists: true, $not: { $size: 0 } },
					}),
				])

			return {
				totalUsers,
				adminUsers,
				regularUsers: totalUsers - adminUsers,
				recentUsers,
				usersWithBookmarksCount,
			}
		} catch (error) {
			console.error('Error fetching user stats:', error)
			return null
		}
	}

	/**
	 * Search users (admin only)
	 */
	static async searchUsers(
		query: string,
		adminUserId: string,
		limit = 10
	): Promise<UserType[]> {
		try {
			await connectToDatabase()

			// Check admin permissions
			const isAdminUser = await this.isAdmin(adminUserId)
			if (!isAdminUser) {
				return []
			}

			const users = await User.find({
				$or: [
					{ name: { $regex: query, $options: 'i' } },
					{ email: { $regex: query, $options: 'i' } },
				],
			})
				.select('id name email role emailVerified createdAt')
				.limit(limit)
				.lean()

			return users as unknown as UserType[]
		} catch (error) {
			console.error('Error searching users:', error)
			return []
		}
	}
}
