'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { addArtist } from '@/app/actions'

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

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
	return (
		<button type='button' className='btn btn-ghost' onClick={onClick}>
			{label}
		</button>
	)
}

function RemoveButton({ onClick }: { onClick: () => void }) {
	return (
		<button type='button' className='btn btn-ghost' onClick={onClick}>
			Remove
		</button>
	)
}

export default function AddArtistForm() {
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

	// SUCCESS MESSAGE
	if (success) {
		return (
			<div className='text-center py-12'>
				<div className='bg-accent-1 rounded-lg p-6 max-w-md mx-auto'>
					<h2 className='heading-display mb-2'>Success!</h2>
					<p className='heading-title'>Artist has been added successfully.</p>
					<p className='mt-2'>Redirecting...</p>
				</div>
			</div>
		)
	}

	return (
		<form action={addArtist} className='space-y-8 max-w-4xl'>
			{/* ERROR MESSAGE */}
			{error && (
				<div className='bg-accent-3 rounded-lg p-4'>
					<p className='heading-display'>{error}</p>
				</div>
			)}

			{/* BASIC INFORMATION */}
			<section className='space-y-6'>
				<h2 className='heading-title'>Basic Information</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label htmlFor='businessName' className='block text-label mb-1'>
							Business Name *
						</label>
						<input
							type='text'
							id='businessName'
							name='businessName'
							required
							className='form-input w-full'
							placeholder='e.g., Smith Pottery Studio'
						/>
					</div>

					<div>
						<label htmlFor='type' className='block text-label mb-1'>
							Artist Type *
						</label>
						<select
							id='type'
							name='type'
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
					<label htmlFor='description' className='block text-label mb-1'>
						Description *
					</label>
					<textarea
						id='description'
						name='description'
						required
						rows={4}
						className='form-input w-full resize-vertical'
						placeholder="Describe the artist's work, style, and background..."
					/>
				</div>
			</section>

			{/* CONTACT INFORMATION */}
			<section className='space-y-6'>
				<h2 className='heading-title'>Contact Information</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label htmlFor='artistName' className='block text-label mb-1'>
							Artist Name *
						</label>
						<input
							type='text'
							id='artistName'
							name='artistName'
							required
							className='form-input w-full'
							placeholder='e.g., John Smith'
						/>
					</div>

					<div>
						<label htmlFor='email' className='block text-label mb-1'>
							Email *
						</label>
						<input
							type='email'
							id='email'
							name='email'
							required
							className='form-input w-full'
							placeholder='artist@example.com'
						/>
					</div>

					<div>
						<label htmlFor='phone' className='block text-label mb-1'>
							Phone
						</label>
						<input
							type='tel'
							id='phone'
							name='phone'
							className='form-input w-full'
							placeholder='(555) 123-4567'
						/>
					</div>

					<div>
						<label htmlFor='website' className='block text-label mb-1'>
							Website
						</label>
						<input
							type='url'
							id='website'
							name='website'
							className='form-input w-full'
							placeholder='https://www.example.com'
						/>
					</div>
				</div>
			</section>

			{/* LOCATION */}
			<section className='space-y-6'>
				<h2 className='heading-title'>Studio Location</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					<div className='lg:col-span-2'>
						<label htmlFor='street' className='block text-label mb-1'>
							Street Address *
						</label>
						<input
							type='text'
							id='street'
							name='street'
							required
							className='form-input w-full'
							placeholder='123 Art Street'
						/>
					</div>

					<div>
						<label htmlFor='city' className='block text-label mb-1'>
							City *
						</label>
						<input
							type='text'
							id='city'
							name='city'
							required
							className='form-input w-full'
							placeholder='London'
						/>
					</div>

					<div>
						<label htmlFor='state' className='block text-label mb-1'>
							State/Region
						</label>
						<input
							type='text'
							id='state'
							name='state'
							className='form-input w-full'
							placeholder='England'
						/>
					</div>

					<div>
						<label htmlFor='zip' className='block text-label mb-1'>
							Postal Code *
						</label>
						<input
							type='text'
							id='zip'
							name='zip'
							required
							className='form-input w-full'
							placeholder='SW1A 1AA'
						/>
					</div>
				</div>
			</section>

			{/* BUSINESS DETAILS */}
			<section className='space-y-6'>
				<h2 className='heading-title'>Business Details</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label htmlFor='employees' className='block text-label mb-1'>
							Number of Employees
						</label>
						<input
							type='number'
							id='employees'
							name='employees'
							min='0'
							className='form-input w-full'
							placeholder='0'
						/>
					</div>

					<div>
						<label htmlFor='physicalStores' className='block text-label mb-1'>
							Physical Stores/Galleries
						</label>
						<input
							type='number'
							id='physicalStores'
							name='physicalStores'
							min='0'
							className='form-input w-full'
							placeholder='0'
						/>
					</div>
				</div>
			</section>

			{/* SOCIAL MEDIA */}
			<section className='space-y-6'>
				<h2 className='heading-title'>Social Media</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label htmlFor='instagram' className='block text-label mb-1'>
							Instagram
						</label>
						<input
							type='text'
							id='instagram'
							name='instagram'
							className='form-input w-full'
							placeholder='@username'
						/>
					</div>

					<div>
						<label htmlFor='facebook' className='block text-label mb-1'>
							Facebook
						</label>
						<input
							type='text'
							id='facebook'
							name='facebook'
							className='form-input w-full'
							placeholder='facebook.com/page'
						/>
					</div>

					<div>
						<label htmlFor='bluesky' className='block text-label mb-1'>
							Bluesky
						</label>
						<input
							type='text'
							id='bluesky'
							name='bluesky'
							className='form-input w-full'
							placeholder='@username.bsky.social'
						/>
					</div>

					<div>
						<label htmlFor='tiktok' className='block text-label mb-1'>
							TikTok
						</label>
						<input
							type='text'
							id='tiktok'
							name='tiktok'
							className='form-input w-full'
							placeholder='@username'
						/>
					</div>
				</div>
			</section>

			{/* RATES */}
			<section className='space-y-6'>
				<div className='flex items-center justify-between'>
					<h2 className='heading-title'>Pricing</h2>
					<AddButton label='Add Rate' onClick={addRate} />
				</div>

				<div className='space-y-4'>
					{formData.rates.map((rate, index) => (
						<div key={index} className='flex gap-4 items-end'>
							<div className='flex-1'>
								<label className='block text-label mb-1' htmlFor='rateName'>
									Service/Product Name
								</label>
								<input
									type='text'
									name='rateName'
									className='form-input w-full'
									placeholder='e.g., Custom Portrait, Workshop Session'
								/>
							</div>
							<div className='w-32'>
								<label htmlFor='ratePrice' className='block text-label mb-1'>
									Price (£)
								</label>
								<input
									type='number'
									name='ratePrice'
									min='0'
									step='0.01'
									className='form-input w-full'
									placeholder='0.00'
								/>
							</div>
							{formData.rates.length > 1 && (
								<RemoveButton onClick={() => removeRate(index)} />
							)}
						</div>
					))}
				</div>
			</section>

			{/* SPECIALTIES */}
			<section className='space-y-6'>
				<div className='flex items-center justify-between'>
					<h2 className='heading-title'>Specialties</h2>
					<AddButton
						label='Add Specialty'
						onClick={() => addArrayItem('specialties')}
					/>
				</div>

				<div className='space-y-3'>
					{formData.specialties.map((specialty, index) => (
						<div key={index} className='flex gap-4 items-center'>
							<input
								type='text'
								name='specialties'
								className='form-input flex-1'
								placeholder='e.g., Portrait Photography, Ceramic Bowls'
							/>
							{formData.specialties.length > 1 && (
								<RemoveButton
									onClick={() => removeArrayItem('specialties', index)}
								/>
							)}
						</div>
					))}
				</div>
			</section>

			{/* IMAGES */}
			<section className='space-y-6'>
				<div className='flex items-center justify-between'>
					<h2 className='heading-title'>Images</h2>
					<AddButton label='Add Image' onClick={() => addArrayItem('images')} />
				</div>

				<div className='space-y-3'>
					{formData.images.map((image, index) => (
						<div key={index} className='flex gap-4 items-center'>
							<input
								type='url'
								name='images'
								className='form-input flex-1'
								placeholder='https://example.com/image.jpg'
							/>
							{formData.images.length > 1 && (
								<RemoveButton
									onClick={() => removeArrayItem('images', index)}
								/>
							)}
						</div>
					))}
				</div>
			</section>

			{/* FEATURED */}
			<section className='space-y-6'>
				<div className='flex items-center gap-3'>
					<input
						type='checkbox'
						id='isFeatured'
						name='isFeatured'
						className='w-4 h-4 text-accent-focus focus:ring-accent-focus border-secondary rounded'
					/>
					<label htmlFor='isFeatured' className='text-label'>
						Feature this artist on the homepage
					</label>
				</div>
			</section>

			{/* SUBMIT BUTTON */}
			<div className='flex gap-4 justify-center pt-8 border-t'>
				<button
					type='button'
					onClick={() => router.back()}
					className='btn btn-ghost'
					disabled={isLoading}>
					Cancel
				</button>
				<button
					type='submit'
					className='btn btn-secondary'
					disabled={isLoading}>
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
