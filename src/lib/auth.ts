// src/lib/auth.ts
import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db() // default DB from URI

export const auth = betterAuth({
	database: mongodbAdapter(db, { client }), // enables transactions where supported
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			// optional quality-of-life tweaks:
			// accessType: "offline",
			// prompt: "select_account consent",
		},
	},
	plugins: [nextCookies()], // auto-sets cookies in Next server actions/route handlers
})
