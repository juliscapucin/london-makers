import { Schema, model, models } from 'mongoose'

const userSchema = new Schema(
	{
		username: { type: String, required: [true, 'Username is required'] },
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: [true, 'Email already exists'],
		},
		password: { type: String, required: true },
		image: { type: String },
		bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Artist' }],
	},
	{
		timestamps: true,
	}
)

const User = models.User || model('User', userSchema)

export default User
