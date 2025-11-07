export type ArtistType = {
	_id: string
	owner: string
	businessName: string
	artist_info: {
		name: string
		email: string
		phone?: string
		website?: string
	}
	type: string
	description: string
	location: {
		street: string
		city: string
		state?: string
		zip: string
	}
	employees?: number
	physical_stores?: number
	socials: {
		[key: string]: string | undefined
	}
	rates: Array<{
		name: string
		price: number
	}>
	specialties: string[]
	images: string[]
	is_featured: boolean
	createdAt: string
	updatedAt: string
}
