import mongoose from 'mongoose'

let isConnected = false // track the connection status

export const connectToDatabase = async () => {
	if (isConnected) {
		console.log('Already connected to the database')
		return
	}

	try {
		await mongoose.connect(process.env.MONGODB_URI as string)
		isConnected = true
		console.log('Connected to the database')
	} catch (error) {
		console.error('Error connecting to the database:', error)
	}
}
