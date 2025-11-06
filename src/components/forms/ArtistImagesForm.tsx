import Image from 'next/image'

type ArtistImagesFormProps = {
	formValues: {
		images: string[]
	}
	addArrayItem: (field: 'images') => void
	removeArrayItem: (field: 'images', index: number) => void
	handleImageChange: (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => void
	uploadingImages: { [key: number]: boolean }
	isPending: boolean
}

export default function ArtistImagesForm({
	formValues,
	addArrayItem,
	removeArrayItem,
	handleImageChange,
	uploadingImages,
	isPending,
}: ArtistImagesFormProps) {
	return (
		<section className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h2 className='heading-title'>Images * (max 5)</h2>
				<button
					type='button'
					className='btn btn-ghost'
					onClick={() => addArrayItem('images')}
					disabled={formValues.images.length >= 5 || isPending}>
					Add Image
				</button>
			</div>

			<p className='text-sm text-gray-600'>
				Upload high-quality images of your work. Supported formats: JPG, PNG,
				WebP. Max size: 1MB per image.
			</p>

			<div className='space-y-4'>
				{formValues.images.map((image, index) => (
					<div key={index} className='border rounded-lg p-4 bg-gray-50'>
						{/* Hidden input to store uploaded image URLs */}
						{image && image.startsWith('http') && (
							<input type='hidden' name='uploadedImages' value={image} />
						)}

						<div className='flex gap-4 items-start'>
							<div className='flex-1 space-y-3'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										Image {index + 1}
									</label>
									<input
										type='file'
										id={`image-${index}`}
										accept='image/jpeg,image/jpg,image/png,image/webp'
										onChange={(e) => handleImageChange(e, index)}
										className='form-input w-full'
										disabled={uploadingImages[index] || isPending}
									/>
								</div>

								{/* Upload progress indicator */}
								{uploadingImages[index] && (
									<div className='flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded'>
										<div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
										Uploading image...
									</div>
								)}

								{/* Show uploaded image preview */}
								{image &&
									image.startsWith('http') &&
									!uploadingImages[index] && (
										<div className='flex items-center gap-3 bg-green-50 p-2 rounded'>
											<Image
												src={image}
												alt={`Upload ${index + 1}`}
												className='w-20 h-20 object-cover rounded border shadow-sm'
												width={80}
												height={80}
											/>
											<div className='flex-1'>
												<div className='flex items-center gap-1 text-sm text-green-700 font-medium'>
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
													Successfully uploaded
												</div>
												<p className='text-xs text-green-600 mt-1 break-all'>
													{image.split('/').pop()}
												</p>
											</div>
										</div>
									)}
							</div>

							{formValues.images.length > 1 && (
								<button
									onClick={() => removeArrayItem('images', index)}
									className='btn btn-ghost'
									type='button'
									disabled={uploadingImages[index] || isPending}>
									Remove
								</button>
							)}
						</div>
					</div>
				))}
			</div>

			<div className='text-sm text-gray-500'>
				{formValues.images.length >= 5 ? (
					<p className='text-amber-600'>Maximum of 5 images reached</p>
				) : (
					<p>
						{5 - formValues.images.length} more image
						{5 - formValues.images.length !== 1 ? 's' : ''} can be added
					</p>
				)}
			</div>
		</section>
	)
}
