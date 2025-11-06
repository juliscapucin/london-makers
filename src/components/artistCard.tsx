import { ArtistType } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

type ArtistCardProps = {
	artist: ArtistType
}

export default function ArtistCard({ artist }: ArtistCardProps) {
	return (
		<article>
			<Link href={`/artists/${artist._id}`} className='block border p-4'>
				<div className='w-40 h-40 relative overflow-clip bg-accent-1'>
					<Image
						src={
							artist.images?.[0]
								? artist.images[0]
								: '/images/laark-boshoff-ZVbC_JTR1MM-unsplash.jpg'
						}
						alt={artist.businessName}
						fill
					/>
				</div>
				<h2>{artist.businessName}</h2>
				<p>{artist.type}</p>
			</Link>
		</article>
	)
}
