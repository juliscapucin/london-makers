import { ArtistService } from '@/lib/services/artistService'
import { Container, EmptyResults, PageWrapper } from '@/components/ui'
import ImageWithSpinner from '@/components/ui/imageWithSpinner'

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	const artist = await ArtistService.getArtistById(id)

	if (!artist) {
		return (
			<EmptyResults message='Artist not found. Please check the URL or return to the artists list.' />
		)
	}

	return (
		<PageWrapper pageName='artist-detail' hasContainer={false}>
			<div className='flex'>
				{[1, 2, 3].map((index) => (
					<ImageWithSpinner
						key={index}
						imageSrc={{
							url: '/images/laark-boshoff-ZVbC_JTR1MM-unsplash.jpg',
							alt: artist.businessName,
							width: 800,
							height: 600,
						}}
						className={`relative w-screen h-screen ${
							index === 1 || index === 3 ? 'hidden 3xl:block' : ''
						}`}
						imageClassName='w-full h-full object-cover object-center'
						altFallback={artist.businessName}
						sizes='100vw'
						fill
					/>
				))}
			</div>
			<Container classes='pt-8'>
				<h1 className='heading-display text-secondary'>
					{artist.businessName}
				</h1>
				<p>{artist.description}</p>
			</Container>
		</PageWrapper>
	)
}
