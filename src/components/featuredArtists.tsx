import { ArtistCard } from '@/components'

import { ArtistType } from '@/types'

type FeaturedArtistsProps = {
	artists?: ArtistType[]
}

export default function FeaturedArtists({ artists }: FeaturedArtistsProps) {
	return (
		<section className='my-12'>
			<h1 className='heading-headline mb-4'>Featured Artists</h1>
			<ul className='flex w-full justify-between'>
				{artists?.map((artist) => (
					<li key={artist._id} className='w-[32%]'>
						<ArtistCard artist={artist} />
					</li>
				))}
			</ul>
		</section>
	)
}
