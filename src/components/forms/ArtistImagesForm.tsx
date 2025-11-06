import Image from 'next/image'

type ArtistImagesFormProps = {
	formValues: {
		images: string[]
	}
	addArrayItem: (field: 'images') => void
	deleteImage: (index: number) => void
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
	deleteImage,
	handleImageChange,
	uploadingImages,
	isPending,
}: ArtistImagesFormProps) {
	return (
		<section className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h2 className='heading-title'>Images *</h2>
			</div>

			<p>
				Upload up to 5 high-quality images of your work. Supported formats: JPG,
				PNG, WebP. Max size: 1MB per image.
			</p>

			<div className='space-y-4'>
				{formValues.images.map((image, index) => (
					<div key={index} className='border rounded-lg p-4'>
						{/* Hidden input to store uploaded image URLs */}
						{image && image.startsWith('http') && (
							<input type='hidden' name='uploadedImages' value={image} />
						)}

						<div className='flex gap-4 items-start'>
							<div className='flex-1 space-y-3'>
								{/* Image Upload Field (only show for empty slots) */}
								{!image.startsWith('http') && (
									<div>
										<label htmlFor={`image-${index}`} className='block mb-1'>
											Image {index + 1}
										</label>

										<input
											type='file'
											id={`image-${index}`}
											name={`image-${index}`}
											accept='image/jpeg,image/jpg,image/png,image/webp'
											onChange={(e) => handleImageChange(e, index)}
											className='hidden'
											disabled={uploadingImages[index] || isPending}
										/>

										<label
											htmlFor={`image-${index}`}
											className='btn btn-ghost inline-flex items-center gap-2 cursor-pointer'>
											{uploadingImages[index] ? (
												<>
													<div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin' />
													<span>Uploading...</span>
												</>
											) : (
												<>
													<svg
														className='w-4 h-4'
														fill='none'
														stroke='currentColor'
														viewBox='0 0 24 24'>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
														/>
													</svg>
													<span>Upload Image</span>
												</>
											)}
										</label>
									</div>
								)}

								{/* Upload progress indicator */}
								{uploadingImages[index] && (
									<div className='flex items-center gap-2 p-2'>
										{/* Spinner */}
										<div className='w-4 h-4 border-2 border-tertiary border-t-transparent rounded-full animate-spin' />
										Uploading image...
									</div>
								)}

								{/* Show uploaded image preview */}
								{image &&
									image.startsWith('http') &&
									!uploadingImages[index] && (
										<div className='flex items-center gap-3 p-2'>
											<Image
												src={image}
												alt={`Upload ${index + 1}`}
												className='w-20 h-20 object-cover rounded border shadow-sm'
												width={80}
												height={80}
											/>
											<div className='flex-1'>
												<div className='flex items-center gap-1 text-green-700'>
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
													<p
														aria-label='Uploaded image filename'
														className='mt-1 break-all'>
														{image.split('/').pop()}
													</p>
												</div>
											</div>
										</div>
									)}
							</div>

							{/* Delete button - show for uploaded images or when multiple empty slots exist */}
							{(image.startsWith('http') || formValues.images.length > 1) && (
								<button
									onClick={() => deleteImage(index)}
									className='btn btn-ghost'
									type='button'
									disabled={uploadingImages[index] || isPending}
									title='Delete image'>
									Delete
								</button>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Add more images button */}
			<div className='text-center space-y-3'>
				{formValues.images.length >= 5 ? (
					<p className='text-amber-600 font-medium'>
						Maximum of 5 images reached
					</p>
				) : (
					<div className='space-y-2'>
						<p>
							{5 - formValues.images.length} more image
							{5 - formValues.images.length !== 1 ? 's' : ''} can be added
						</p>

						<button
							type='button'
							className='btn btn-ghost mx-auto flex items-center gap-2'
							onClick={() => addArrayItem('images')}
							disabled={formValues.images.length >= 5 || isPending}>
							<svg
								className='w-4 h-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 4v16m8-8H4'
								/>
							</svg>
							Add Image
						</button>
					</div>
				)}
			</div>
		</section>
	)
}
