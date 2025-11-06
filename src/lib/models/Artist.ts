import { Schema, model, models } from 'mongoose'

const artistSchema = new Schema(
	{
		owner: {
			type: String, // better-auth uses string IDs
			ref: 'User',
			required: true,
		},
		businessName: {
			type: String,
			required: true,
			unique: [true, 'Business name already exists'],
		},
		artist_info: {
			name: { type: String, required: true },
			email: { type: String, required: true },
			phone: { type: String, required: false },
			website: { type: String, required: false },
		},
		type: { type: String, required: true },
		description: { type: String, required: true },
		location: {
			street: { type: String, required: true },
			city: { type: String, required: true },
			state: { type: String, required: false },
			zip: { type: String, required: true },
		},
		employees: { type: Number, required: false },
		physical_stores: { type: Number, required: false },
		socials: {
			instagram: { type: String, required: false },
			facebook: { type: String, required: false },
			bluesky: { type: String, required: false },
			tiktok: { type: String, required: false },
		},
		rates: [
			{
				name: { type: String, required: true },
				price: { type: Number, required: true },
			},
		],
		specialties: [{ type: String }],
		images: { type: [String], required: true },
		is_featured: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
)

const Artist = models.Artist || model('Artist', artistSchema)

export default Artist
