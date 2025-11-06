'use client'

import { useState, useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { saveArtist } from '@/app/actions'
import { useNotifications } from '@/contexts'
import Image from 'next/image'

type FormValues = {
	_id?: string
	businessName: string
	artistName: string
	email: string
	phone: string
	website: string
	type: string
	description: string
	street: string
	city: string
	state?: string
	zip: string
	employees: string
	physicalStores: string
	instagram: string
	facebook: string
	bluesky: string
	tiktok: string
	rates: {
		name: string
		price: number
	}[]
	specialties: string[]
	images: string[]
	isFeatured: boolean
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	label: string
}

function Button({ label, ...props }: ButtonProps) {
	return (
		<button type='button' className='btn btn-ghost' {...props}>
			{label}
		</button>
	)
}

type AddArtistFormProps = {
	isEdit?: boolean
	initialData?: FormValues
}

export default function ArtistForm({
	isEdit = false,
	initialData,
}: AddArtistFormProps) {
	const router = useRouter()
	const { showSuccess, showError, showInfo } = useNotifications()

	const [state, formAction, isPending] = useActionState(saveArtist, null)

	// Add upload states
	const [uploadingImages, setUploadingImages] = useState<{
		[key: number]: boolean
	}>({})
	const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([])

	// This state to keeps track the data in case of error, so user doesn't lose inputs
	// initialData is passed when editing an existing artist
	const [formValues, setFormValues] = useState<FormValues>(
		initialData || {
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
			employees: '',
			physicalStores: '',
			instagram: '',
			facebook: '',
			bluesky: '',
			tiktok: '',
			rates: [{ name: '', price: 0 }],
			specialties: [''],
			images: [''],
			isFeatured: false,
		}
	)

	const uploadImage = async (file: File, index: number) => {
		if (!file || file.size === 0) return

		// Validate file type
		if (!file.type.startsWith('image/')) {
			showError('Please select a valid image file', 'Invalid File Type')
			return
		}

		// Validate file size (e.g., max 1MB)
		if (file.size > 1 * 1024 * 1024) {
			showError('Image size must be less than 1MB', 'File Too Large')
			return
		}

		setUploadingImages((prev) => ({ ...prev, [index]: true }))
		showInfo('Uploading image...', 'Upload in Progress', 8000)

		try {
			const formData = new FormData()
			formData.append('file', file)

			const response = await fetch('/api/uploadImage', {
				method: 'POST',
				body: formData,
			})

			if (!response.ok) {
				throw new Error('Upload failed')
			}

			const data = await response.json()

			// Success
			// Update form values with the uploaded image URL
			if (data.url) {
				setFormValues((prev) => {
					const newImages = [...prev.images]
					newImages[index] = data.url
					return { ...prev, images: newImages }
				})

				showSuccess('Image uploaded successfully!', 'Upload Complete', 8000)
			} else {
				// Failure
				showError(
					'Failed to upload image. Please try again.',
					'Upload Failed',
					8000
				)
			}
		} catch (error) {
			console.error('Upload error:', error)
			showError(
				'Failed to upload image. Please try again.',
				'Upload Failed',
				15000
			)
		} finally {
			setUploadingImages((prev) => ({ ...prev, [index]: false }))
		}
	}

	// Handle file input change
	const handleImageChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		const file = e.target.files?.[0]
		if (file) {
			uploadImage(file, index)
		}
	}

	const addRate = () => {
		setFormValues((prev) => ({
			...prev,
			rates: [...prev.rates, { name: '', price: 0 }],
		}))
	}

	const removeRate = (index: number) => {
		setFormValues((prev) => ({
			...prev,
			rates: prev.rates.filter((_, i) => i !== index),
		}))
	}

	const addArrayItem = (field: 'specialties' | 'images') => {
		setFormValues((prev) => ({
			...prev,
			[field]: [...prev[field], ''],
		}))
	}

	const removeArrayItem = (field: 'specialties' | 'images', index: number) => {
		setFormValues((prev) => ({
			...prev,
			[field]: prev[field].filter((_, i) => i !== index),
		}))
	}

	// Handle form state changes
	useEffect(() => {
		if (state?.success && state?.artistId) {
			showSuccess(
				`Artist has been ${isEdit ? 'updated' : 'added'} successfully!`,
				'Success',
				5000
			)

			// Redirect after a short delay
			setTimeout(() => {
				router.push(`/artists/${state.artistId}`)
			}, 1500)
		}
		if (state?.error) {
			showError(
				state.error,
				`Error ${isEdit ? 'Updating' : 'Creating'} Artist`,
				8000
			)
		}
	}, [
		state?.success,
		state?.error,
		state?.artistId,
		router,
		showSuccess,
		showError,
		isEdit,
	])

	return (
		<form action={formAction} className='space-y-8 max-w-4xl'>
			{/* Add hidden input for artistId when editing */}
			{isEdit && initialData?._id && (
				<input type='hidden' name='artistId' value={initialData._id} />
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
							value={formValues.businessName}
							onChange={(e) =>
								setFormValues((prev) => ({
									...prev,
									businessName: e.target.value,
								}))
							}
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
							value={formValues.type}
							onChange={(e) =>
								setFormValues((prev) => ({
									...prev,
									type: e.target.value,
								}))
							}
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
						value={formValues.description}
						onChange={(e) =>
							setFormValues((prev) => ({
								...prev,
								description: e.target.value,
							}))
						}
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
							value={formValues.artistName}
							onChange={(e) =>
								setFormValues((prev) => ({
									...prev,
									artistName: e.target.value,
								}))
							}
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
							value={formValues.email}
							onChange={(e) =>
								setFormValues((prev) => ({
									...prev,
									email: e.target.value,
								}))
							}
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
							value={formValues.phone}
							onChange={(e) =>
								setFormValues((prev) => ({
									...prev,
									phone: e.target.value,
								}))
							}
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
							value={formValues.website}
							onChange={(e) =>
								setFormValues((prev) => ({
									...prev,
									website: e.target.value,
								}))
							}
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
							value={formValues.street}
							onChange={(e) =>
								setFormValues((prev) => ({
									...prev,
									street: e.target.value,
								}))
							}
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
							value={formValues.city}
							onChange={(e) =>
								setFormValues((prev) => ({
									...prev,
									city: e.target.value,
								}))
							}
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
							value={formValues.zip}
							onChange={(e) =>
								setFormValues((prev) => ({
									...prev,
									zip: e.target.value,
								}))
							}
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
					<Button label='Add Rate' onClick={addRate} />
				</div>

				<div className='space-y-4'>
					{formValues.rates.map((rate, index) => (
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
									value={rate.name}
									onChange={(e) => {
										const newRates = [...formValues.rates]
										newRates[index].name = e.target.value
										setFormValues((prev) => ({
											...prev,
											rates: newRates,
										}))
									}}
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
									value={rate.price}
									onChange={(e) => {
										const newRates = [...formValues.rates]
										newRates[index].price = parseFloat(e.target.value)
										setFormValues((prev) => ({
											...prev,
											rates: newRates,
										}))
									}}
								/>
							</div>
							{formValues.rates.length > 1 && (
								<Button onClick={() => removeRate(index)} label='Remove' />
							)}
						</div>
					))}
				</div>
			</section>

			{/* SPECIALTIES */}
			<section className='space-y-6'>
				<div className='flex items-center justify-between'>
					<h2 className='heading-title'>Specialties</h2>
					<Button
						label='Add Specialty'
						onClick={() => addArrayItem('specialties')}
					/>
				</div>

				<div className='space-y-3'>
					{formValues.specialties.map((specialty, index) => (
						<div key={index} className='flex gap-4 items-center'>
							<input
								type='text'
								name='specialties'
								className='form-input flex-1'
								placeholder='e.g., Portrait Photography, Ceramic Bowls'
								value={specialty}
								onChange={(e) => {
									const newSpecialties = [...formValues.specialties]
									newSpecialties[index] = e.target.value
									setFormValues((prev) => ({
										...prev,
										specialties: newSpecialties,
									}))
								}}
							/>
							{formValues.specialties.length > 1 && (
								<Button
									onClick={() => removeArrayItem('specialties', index)}
									label='Remove'
								/>
							)}
						</div>
					))}
				</div>
			</section>

			{/* IMAGES */}
			<section className='space-y-6'>
				<div className='flex items-center justify-between'>
					<h2 className='heading-title'>Images * (max 5)</h2>
					<Button
						label='Add Image'
						onClick={() => addArrayItem('images')}
						disabled={formValues.images.length >= 5}
					/>
				</div>

				<div className='space-y-3'>
					{formValues.images.map((image, index) => (
						<div key={index} className='flex gap-4 items-center'>
							{/* Hidden input to store uploaded image URLs */}
							<input
								type='hidden'
								name='uploadedImages'
								value={image}
								key={`hidden-image-${index}`}
							/>
							<div className='flex-1 space-y-2'>
								<input
									type='file'
									id={`image-${index}`}
									accept='image/*'
									onChange={(e) => handleImageChange(e, index)}
									className='form-input flex-1'
									disabled={uploadingImages[index] || isPending}
								/>

								{/* Upload progress indicator */}
								{uploadingImages[index] && (
									<div className='flex items-center gap-2 text-sm text-gray-600'>
										<div className='w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin' />
										Uploading...
									</div>
								)}

								{/* Show uploaded image preview */}
								{image &&
									image.startsWith('http') &&
									!uploadingImages[index] && (
										<div className='flex items-center gap-2'>
											<Image
												src={image}
												alt={`Upload ${index + 1}`}
												className='w-16 h-16 object-cover rounded border'
												width={64}
												height={64}
											/>
											<div className='flex items-center gap-1 text-sm text-green-600'>
												<svg
													className='w-4 h-4'
													fill='none'
													stroke='currentColor'
													viewBox='0 0 24 24'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M5 13l4 4L19 7'
													/>
												</svg>
												Uploaded successfully
											</div>
										</div>
									)}
							</div>
							{formValues.images.length > 1 && (
								<Button
									onClick={() => {
										// Remove from uploadedImageUrls as well
										setUploadedImageUrls((prev) =>
											prev.filter((_, i) => i !== index)
										)
										removeArrayItem('images', index)
									}}
									label='Remove'
									disabled={uploadingImages[index] || isPending}
								/>
							)}
						</div>
					))}
				</div>

				{formValues.images.length >= 5 && (
					<p className='text-sm text-gray-600'>Maximum of 5 images allowed</p>
				)}
			</section>
			{/* <section className='space-y-6'>
				<div className='flex items-center justify-between'>
					<h2 className='heading-title'>Images * (max 5)</h2>
					<Button label='Add Image' onClick={() => addArrayItem('images')} />
				</div>

				<div className='space-y-3'>
					{formValues.images.map((image, index) => (
						<div key={index} className='flex gap-4 items-center'>
							<input
								type='file'
								id={`image-${index}`}
								name='images'
								className='form-input flex-1'
								placeholder='https://example.com/image.jpg'
								required
							/>
							{formValues.images.length > 1 && (
								<Button
									onClick={() => removeArrayItem('images', index)}
									label='Remove'
								/>
							)}
						</div>
					))}
				</div>
			</section> */}

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
					disabled={isPending}>
					Cancel
				</button>
				<button
					type='submit'
					className='btn btn-secondary'
					disabled={isPending}>
					{isPending ? (
						<>
							<div className='w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin' />
							{isEdit ? 'Updating' : 'Creating'} {' Artist...'}
						</>
					) : isEdit ? (
						'Update'
					) : (
						'Create'
					)}
					{' Artist'}
				</button>
			</div>
		</form>
	)
}
