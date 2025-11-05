'use client'

import { useState } from 'react'
import Image from 'next/image'
import { EmptyResults } from '@/components/ui'

// Extracted Spinner component for better separation
function LoadingSpinner({ className = '', bgColor = 'bg-accent-3' }) {
	return (
		<div
			className={`absolute inset-0 z-10 grid place-items-center ${bgColor} ${className}`}
			role='status'
			aria-label='Loading image'>
			<div className='relative aspect-square w-[10%] min-w-12 motion-safe:animate-spin'>
				<div className='border-secondary absolute inset-0 rounded-full border border-r-accent-1' />
				<div className='border-secondary/20 absolute z-10 inset-0 rounded-full border' />
			</div>
			<span className='sr-only'>Loading</span>
		</div>
	)
}

type ImageWithSpinnerProps = {
	imageSrc: {
		url: string
		alt?: string
		width?: number
		height?: number
	}
	sizes: string
	containerClassName?: string
	imageClassName?: string
	spinnerClassName?: string
	bgColor?: string
	quality?: number
	priority?: boolean
	showSpinner?: boolean
	altFallback?: string
	fill?: boolean
	id?: string
}

export default function ImageWithSpinner({
	imageSrc,
	sizes,
	containerClassName = '',
	imageClassName = '',
	spinnerClassName = '',
	bgColor = 'bg-accent-3',
	quality = 75,
	priority = false,
	showSpinner = true,
	altFallback = '',
	fill = false,
	id,
}: ImageWithSpinnerProps) {
	const [isLoading, setIsLoading] = useState(true)
	const [hasError, setHasError] = useState(false)

	const { alt, width, height, url } = imageSrc

	const handleLoad = () => setIsLoading(false)
	const handleError = () => {
		setHasError(true)
		setIsLoading(false)
	}

	return (
		<div
			className={containerClassName}
			id={id}
			role='img'
			aria-busy={isLoading}
			aria-live='polite'>
			{/* Loading Spinner */}
			{showSpinner && isLoading && !hasError && (
				<LoadingSpinner className={spinnerClassName} bgColor={bgColor} />
			)}

			{/* Image or Error */}
			{hasError ? (
				<EmptyResults message='Failed to load image' variant='inline' />
			) : (
				<Image
					className={imageClassName}
					src={url}
					alt={alt || altFallback || 'Image'}
					sizes={sizes}
					quality={quality}
					width={fill ? undefined : width}
					height={fill ? undefined : height}
					fill={fill}
					onLoad={handleLoad}
					onError={handleError}
					priority={priority}
				/>
			)}
		</div>
	)
}
