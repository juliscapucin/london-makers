import { ImageWithSpinner } from '@/components/ui'
import { ArtistType } from '@/types'

type ArtistCarouselProps = {
	artist: ArtistType
}

export default function ArtistCarousel({ artist }: ArtistCarouselProps) {
	const { images } = artist
	return (
		<div className='relative h-40 w-full flex bg-accent-1'>
			{images.map((image) => (
				<ImageWithSpinner
					key={image}
					imageSrc={{
						url: image,
						alt: artist.businessName,
					}}
					containerClassName='relative h-full w-40'
					imageClassName='w-full h-full object-cover'
					altFallback={artist.businessName}
					sizes='30vw'
					fill
				/>
			))}
		</div>
	)
}
