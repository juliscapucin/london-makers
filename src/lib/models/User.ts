import { Schema, model, models } from 'mongoose'

const userSchema = new Schema(
	{
		// Better-auth creates these fields automatically
		id: { type: String, required: true, unique: true }, // better-auth uses string IDs
		name: { type: String, required: true }, // better-auth uses 'name', not 'username'
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: [true, 'Email already exists'],
		},
		emailVerified: { type: Boolean, default: false }, // better-auth field
		image: { type: String }, // better-auth compatible

		// Your custom fields
		bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Artist' }],
		role: { type: String, default: 'user' }, // Add role field
	},
	{
		timestamps: true, // This will create createdAt/updatedAt
		collection: 'users', // Make sure it uses the same collection as better-auth
	}
)

const User = models.User || model('User', userSchema)

export default User
