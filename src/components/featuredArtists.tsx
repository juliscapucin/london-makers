import { ArtistCard } from '@/components'

export default function FeaturedArtists() {
	return (
		<section className='my-12'>
			<h1 className='heading-headline mb-4'>Featured Artists</h1>
			<ul className='flex w-full justify-between'>
				{[1, 2, 3].map((artist) => (
					<li key={artist} className='w-[32%]'>
						<ArtistCard />
					</li>
				))}
			</ul>
		</section>
	)
}
