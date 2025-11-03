import { ArtistType } from '@/types'
import Link from 'next/link'

type ArtistCardProps = {
	artist: ArtistType
}

export default function ArtistCard({ artist }: ArtistCardProps) {
	return (
		<Link href={`/artists/${artist._id}`} className='block border p-4'>
			<h2>{artist.artist_info.name}</h2>
			<p>{artist.type}</p>
		</Link>
	)
}
