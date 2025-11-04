'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Rate = {
	name: string
	price: number
}

type FormData = {
	businessName: string
	artistName: string
	email: string
	phone: string
	website: string
	type: string
	description: string
	street: string
	city: string
	state: string
	zip: string
	employees: number
	physicalStores: number
	instagram: string
	facebook: string
	bluesky: string
	tiktok: string
	rates: Rate[]
	specialties: string[]
	images: string[]
	isFeatured: boolean
}

export default function AddArtistForm({ userId }: { userId: string }) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const [success, setSuccess] = useState(false)

	const [formData, setFormData] = useState<FormData>({
		businessName: '',
		artistName: '',
		email: '',
		phone: '',
		website: '',
		type: '',
		description: '',
		street: '',
		city: '',
		state: '',
		zip: '',
		employees: 0,
		physicalStores: 0,
		instagram: '',
		facebook: '',
		bluesky: '',
		tiktok: '',
		rates: [{ name: '', price: 0 }],
		specialties: [''],
		images: [''],
		isFeatured: false,
	})

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value, type } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: type === 'number' ? Number(value) : value,
		}))
	}

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, checked } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: checked,
		}))
	}

	const handleRateChange = (
		index: number,
		field: 'name' | 'price',
		value: string
	) => {
		const newRates = [...formData.rates]
		newRates[index] = {
			...newRates[index],
			[field]: field === 'price' ? Number(value) : value,
		}
		setFormData((prev) => ({ ...prev, rates: newRates }))
	}

	const addRate = () => {
		setFormData((prev) => ({
			...prev,
			rates: [...prev.rates, { name: '', price: 0 }],
		}))
	}

	const removeRate = (index: number) => {
		setFormData((prev) => ({
			...prev,
			rates: prev.rates.filter((_, i) => i !== index),
		}))
	}

	const handleArrayChange = (
		field: 'specialties' | 'images',
		index: number,
		value: string
	) => {
		const newArray = [...formData[field]]
		newArray[index] = value
		setFormData((prev) => ({ ...prev, [field]: newArray }))
	}

	const addArrayItem = (field: 'specialties' | 'images') => {
		setFormData((prev) => ({
			...prev,
			[field]: [...prev[field], ''],
		}))
	}

	const removeArrayItem = (field: 'specialties' | 'images', index: number) => {
		setFormData((prev) => ({
			...prev,
			[field]: prev[field].filter((_, i) => i !== index),
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError('')

		try {
			// Filter out empty values
			const cleanedData = {
				owner: userId,
				businessName: formData.businessName,
				artist_info: {
					name: formData.artistName,
					email: formData.email,
					phone: formData.phone || undefined,
					website: formData.website || undefined,
				},
				type: formData.type,
				description: formData.description,
				location: {
					street: formData.street,
					city: formData.city,
					state: formData.state,
					zip: formData.zip,
				},
				employees: formData.employees || undefined,
				physical_stores: formData.physicalStores || undefined,
				socials: {
					instagram: formData.instagram || undefined,
					facebook: formData.facebook || undefined,
					bluesky: formData.bluesky || undefined,
					tiktok: formData.tiktok || undefined,
				},
				rates: formData.rates.filter((rate) => rate.name && rate.price > 0),
				specialties: formData.specialties.filter((spec) => spec.trim()),
				images: formData.images.filter((img) => img.trim()),
				is_featured: formData.isFeatured,
			}

			const response = await fetch('/api/artists', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(cleanedData),
			})

			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.error || 'Failed to create artist')
			}

			setSuccess(true)
			// Reset form or redirect after success
			setTimeout(() => {
				router.push('/admin/artists')
			}, 2000)
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message)
			} else {
				setError('An unknown error occurred')
			}
		} finally {
			setIsLoading(false)
		}
	}

	if (success) {
		return (
			<div className='text-center py-12'>
				<div className='bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto'>
					<h2 className='text-title-medium text-green-800 mb-2'>Success!</h2>
					<p className='text-body text-green-700'>
						Artist has been added successfully.
					</p>
					<p className='text-body-small text-green-600 mt-2'>Redirecting...</p>
				</div>
			</div>
		)
	}

	return (
		<form onSubmit={handleSubmit} className='space-y-8 max-w-4xl'>
			{error && (
				<div className='bg-red-50 border border-red-200 rounded-lg p-4'>
					<p className='text-red-600'>{error}</p>
				</div>
			)}

			{/* Basic Information */}
			<section className='space-y-6'>
				<h2 className='heading-title text-secondary'>Basic Information</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label
							htmlFor='businessName'
							className='block text-label text-secondary mb-1'>
							Business Name *
						</label>
						<input
							type='text'
							id='businessName'
							name='businessName'
							value={formData.businessName}
							onChange={handleInputChange}
							required
							className='form-input w-full'
							placeholder='e.g., Smith Pottery Studio'
						/>
					</div>

					<div>
						<label
							htmlFor='type'
							className='block text-label text-secondary mb-1'>
							Artist Type *
						</label>
						<select
							id='type'
							name='type'
							value={formData.type}
							onChange={handleInputChange}
							required
							className='form-input w-full'>
							<option value=''>Select Type</option>
							<option value='Visual Artist'>Visual Artist</option>
							<option value='Potter'>Potter</option>
							<option value='Photographer'>Photographer</option>
							<option value='Sculptor'>Sculptor</option>
							<option value='Jeweler'>Jeweler</option>
							<option value='Textile Artist'>Textile Artist</option>
							<option value='Woodworker'>Woodworker</option>
							<option value='Glassblower'>Glassblower</option>
							<option value='Mixed Media'>Mixed Media</option>
							<option value='Other'>Other</option>
						</select>
					</div>
				</div>

				<div>
					<label
						htmlFor='description'
						className='block text-label text-secondary mb-1'>
						Description *
					</label>
					<textarea
						id='description'
						name='description'
						value={formData.description}
						onChange={handleInputChange}
						required
						rows={4}
						className='form-input w-full resize-vertical'
						placeholder="Describe the artist's work, style, and background..."
					/>
				</div>
			</section>

			{/* Artist Contact Information */}
			<section className='space-y-6'>
				<h2 className='heading-title text-secondary'>Contact Information</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label
							htmlFor='artistName'
							className='block text-label text-secondary mb-1'>
							Artist Name *
						</label>
						<input
							type='text'
							id='artistName'
							name='artistName'
							value={formData.artistName}
							onChange={handleInputChange}
							required
							className='form-input w-full'
							placeholder='e.g., John Smith'
						/>
					</div>

					<div>
						<label
							htmlFor='email'
							className='block text-label text-secondary mb-1'>
							Email *
						</label>
						<input
							type='email'
							id='email'
							name='email'
							value={formData.email}
							onChange={handleInputChange}
							required
							className='form-input w-full'
							placeholder='artist@example.com'
						/>
					</div>

					<div>
						<label
							htmlFor='phone'
							className='block text-label text-secondary mb-1'>
							Phone
						</label>
						<input
							type='tel'
							id='phone'
							name='phone'
							value={formData.phone}
							onChange={handleInputChange}
							className='form-input w-full'
							placeholder='(555) 123-4567'
						/>
					</div>

					<div>
						<label
							htmlFor='website'
							className='block text-label text-secondary mb-1'>
							Website
						</label>
						<input
							type='url'
							id='website'
							name='website'
							value={formData.website}
							onChange={handleInputChange}
							className='form-input w-full'
							placeholder='https://www.example.com'
						/>
					</div>
				</div>
			</section>

			{/* Location */}
			<section className='space-y-6'>
				<h2 className='heading-title text-secondary'>Studio Location</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					<div className='lg:col-span-2'>
						<label
							htmlFor='street'
							className='block text-label text-secondary mb-1'>
							Street Address *
						</label>
						<input
							type='text'
							id='street'
							name='street'
							value={formData.street}
							onChange={handleInputChange}
							required
							className='form-input w-full'
							placeholder='123 Art Street'
						/>
					</div>

					<div>
						<label
							htmlFor='city'
							className='block text-label text-secondary mb-1'>
							City *
						</label>
						<input
							type='text'
							id='city'
							name='city'
							value={formData.city}
							onChange={handleInputChange}
							required
							className='form-input w-full'
							placeholder='London'
						/>
					</div>

					<div>
						<label
							htmlFor='state'
							className='block text-label text-secondary mb-1'>
							State/Region *
						</label>
						<input
							type='text'
							id='state'
							name='state'
							value={formData.state}
							onChange={handleInputChange}
							required
							className='form-input w-full'
							placeholder='England'
						/>
					</div>

					<div>
						<label
							htmlFor='zip'
							className='block text-label text-secondary mb-1'>
							Postal Code *
						</label>
						<input
							type='text'
							id='zip'
							name='zip'
							value={formData.zip}
							onChange={handleInputChange}
							required
							className='form-input w-full'
							placeholder='SW1A 1AA'
						/>
					</div>
				</div>
			</section>

			{/* Business Details */}
			<section className='space-y-6'>
				<h2 className='heading-title text-secondary'>Business Details</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label
							htmlFor='employees'
							className='block text-label text-secondary mb-1'>
							Number of Employees
						</label>
						<input
							type='number'
							id='employees'
							name='employees'
							value={formData.employees}
							onChange={handleInputChange}
							min='0'
							className='form-input w-full'
							placeholder='0'
						/>
					</div>

					<div>
						<label
							htmlFor='physicalStores'
							className='block text-label text-secondary mb-1'>
							Physical Stores/Galleries
						</label>
						<input
							type='number'
							id='physicalStores'
							name='physicalStores'
							value={formData.physicalStores}
							onChange={handleInputChange}
							min='0'
							className='form-input w-full'
							placeholder='0'
						/>
					</div>
				</div>
			</section>

			{/* Social Media */}
			<section className='space-y-6'>
				<h2 className='heading-title text-secondary'>Social Media</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label
							htmlFor='instagram'
							className='block text-label text-secondary mb-1'>
							Instagram
						</label>
						<input
							type='text'
							id='instagram'
							name='instagram'
							value={formData.instagram}
							onChange={handleInputChange}
							className='form-input w-full'
							placeholder='@username'
						/>
					</div>

					<div>
						<label
							htmlFor='facebook'
							className='block text-label text-secondary mb-1'>
							Facebook
						</label>
						<input
							type='text'
							id='facebook'
							name='facebook'
							value={formData.facebook}
							onChange={handleInputChange}
							className='form-input w-full'
							placeholder='facebook.com/page'
						/>
					</div>

					<div>
						<label
							htmlFor='bluesky'
							className='block text-label text-secondary mb-1'>
							Bluesky
						</label>
						<input
							type='text'
							id='bluesky'
							name='bluesky'
							value={formData.bluesky}
							onChange={handleInputChange}
							className='form-input w-full'
							placeholder='@username.bsky.social'
						/>
					</div>

					<div>
						<label
							htmlFor='tiktok'
							className='block text-label text-secondary mb-1'>
							TikTok
						</label>
						<input
							type='text'
							id='tiktok'
							name='tiktok'
							value={formData.tiktok}
							onChange={handleInputChange}
							className='form-input w-full'
							placeholder='@username'
						/>
					</div>
				</div>
			</section>

			{/* Rates */}
			<section className='space-y-6'>
				<div className='flex items-center justify-between'>
					<h2 className='heading-title text-secondary'>Pricing</h2>
					<button type='button' onClick={addRate} className='btn-ghost-sm'>
						Add Rate
					</button>
				</div>

				<div className='space-y-4'>
					{formData.rates.map((rate, index) => (
						<div key={index} className='flex gap-4 items-end'>
							<div className='flex-1'>
								<label className='block text-label text-secondary mb-1'>
									Service/Product Name
								</label>
								<input
									type='text'
									value={rate.name}
									onChange={(e) =>
										handleRateChange(index, 'name', e.target.value)
									}
									className='form-input w-full'
									placeholder='e.g., Custom Portrait, Workshop Session'
								/>
							</div>
							<div className='w-32'>
								<label className='block text-label text-secondary mb-1'>
									Price (£)
								</label>
								<input
									type='number'
									value={rate.price}
									onChange={(e) =>
										handleRateChange(index, 'price', e.target.value)
									}
									min='0'
									step='0.01'
									className='form-input w-full'
									placeholder='0.00'
								/>
							</div>
							{formData.rates.length > 1 && (
								<button
									type='button'
									onClick={() => removeRate(index)}
									className='btn-ghost-sm text-red-600 hover:bg-red-50 hover:text-red-700'>
									Remove
								</button>
							)}
						</div>
					))}
				</div>
			</section>

			{/* Specialties */}
			<section className='space-y-6'>
				<div className='flex items-center justify-between'>
					<h2 className='heading-title text-secondary'>Specialties</h2>
					<button
						type='button'
						onClick={() => addArrayItem('specialties')}
						className='btn-ghost-sm'>
						Add Specialty
					</button>
				</div>

				<div className='space-y-3'>
					{formData.specialties.map((specialty, index) => (
						<div key={index} className='flex gap-4 items-center'>
							<input
								type='text'
								value={specialty}
								onChange={(e) =>
									handleArrayChange('specialties', index, e.target.value)
								}
								className='form-input flex-1'
								placeholder='e.g., Portrait Photography, Ceramic Bowls'
							/>
							{formData.specialties.length > 1 && (
								<button
									type='button'
									onClick={() => removeArrayItem('specialties', index)}
									className='btn-ghost-sm text-red-600 hover:bg-red-50 hover:text-red-700'>
									Remove
								</button>
							)}
						</div>
					))}
				</div>
			</section>

			{/* Images */}
			<section className='space-y-6'>
				<div className='flex items-center justify-between'>
					<h2 className='heading-title text-secondary'>Images</h2>
					<button
						type='button'
						onClick={() => addArrayItem('images')}
						className='btn-ghost-sm'>
						Add Image URL
					</button>
				</div>

				<div className='space-y-3'>
					{formData.images.map((image, index) => (
						<div key={index} className='flex gap-4 items-center'>
							<input
								type='url'
								value={image}
								onChange={(e) =>
									handleArrayChange('images', index, e.target.value)
								}
								className='form-input flex-1'
								placeholder='https://example.com/image.jpg'
							/>
							{formData.images.length > 1 && (
								<button
									type='button'
									onClick={() => removeArrayItem('images', index)}
									className='btn-ghost-sm text-red-600 hover:bg-red-50 hover:text-red-700'>
									Remove
								</button>
							)}
						</div>
					))}
				</div>
			</section>

			{/* Featured */}
			<section className='space-y-6'>
				<div className='flex items-center gap-3'>
					<input
						type='checkbox'
						id='isFeatured'
						name='isFeatured'
						checked={formData.isFeatured}
						onChange={handleCheckboxChange}
						className='w-4 h-4 text-accent-focus focus:ring-accent-focus border-secondary rounded'
					/>
					<label htmlFor='isFeatured' className='text-label text-secondary'>
						Feature this artist on the homepage
					</label>
				</div>
			</section>

			{/* Submit Button */}
			<div className='flex gap-4 pt-6 border-t'>
				<button
					type='button'
					onClick={() => router.back()}
					className='btn btn-secondary'
					disabled={isLoading}>
					Cancel
				</button>
				<button type='submit' className='btn btn-primary' disabled={isLoading}>
					{isLoading ? (
						<>
							<div className='w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin' />
							Creating Artist...
						</>
					) : (
						'Create Artist'
					)}
				</button>
			</div>
		</form>
	)
}
