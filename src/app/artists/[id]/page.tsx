import { ArtistService } from '@/lib/services/artistService'
import {
	Container,
	EmptyResults,
	ExternalLink,
	ImageWithSpinner,
	PageWrapper,
} from '@/components/ui'
import { ArtistCarousel } from '@/components'
import { ButtonBack } from '@/components/buttons'

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
		<PageWrapper pageName='artist-detail' classes='pb-32' hasContainer={false}>
			{/* IMAGES */}
			{artist.images && artist.images.length > 0 ? (
				<div className='flex'>
					{artist.images.map((image, index) => (
						<ImageWithSpinner
							key={index}
							imageSrc={{
								url: image,
								alt: artist.businessName,
								width: 800,
								height: 600,
							}}
							containerClassName={`relative w-screen h-screen ${
								index === 1 || index === 3 ? 'hidden 3xl:block' : ''
							}`}
							imageClassName='w-full h-full object-cover object-center'
							altFallback={artist.businessName}
							sizes='100vw'
							fill
						/>
					))}
				</div>
			) : (
				<EmptyResults message='No images found for this artist.' />
			)}
			<Container classes='pt-8 grid grid-cols-12 gap-8'>
				{/* MAIN CONTENT / LEFT COLUMN */}
				<div className='col-span-12 md:col-span-9'>
					<ButtonBack label='artists' />

					{/* HEADER */}
					<header className='space-y-4'>
						<h1 className='heading-display'>{artist.businessName}</h1>
						<div className='flex flex-wrap items-center gap-4'>
							<span className='pill-button bg-accent-2'>{artist.type}</span>
							{artist.is_featured && (
								<span className='pill-button bg-tertiary text-primary'>
									Featured Artist
								</span>
							)}
						</div>
					</header>

					{/* DESCRIPTION */}
					<section className='prose prose-lg max-w-none mt-8'>
						<p className='text-lg leading-relaxed'>{artist.description}</p>
					</section>

					<div className='space-y-32 mt-32'>
						{/* SPECIALTIES */}
						{artist.specialties && artist.specialties.length > 0 && (
							<section className='space-y-4'>
								<h2 className='heading-headline'>Specialties</h2>
								<div className='flex flex-wrap gap-2'>
									{artist.specialties.map((specialty, index) => (
										<span
											key={index}
											className='pill-button border border-secondary'>
											{specialty}
										</span>
									))}
								</div>
							</section>
						)}

						{/* PRICING */}
						{artist.rates && artist.rates.length > 0 && (
							<section className='space-y-4'>
								<h2 className='heading-headline'>Pricing</h2>
								<div className='flex gap-4'>
									{artist.rates.map((rate, index) => (
										<div
											key={index}
											className='flex-1 p-4 border border-accent-1 rounded-lg bg-accent-2/50'>
											<h3 className='text-label'>
												{rate.name.replace('_', ' ')}
											</h3>
											<p className='text-link-lg text-tertiary font-bold'>
												${rate.price}
											</p>
										</div>
									))}
								</div>
							</section>
						)}

						{/* CONTACT INFORMATION */}
						<section className='space-y-4'>
							<h2 className='heading-headline'>Contact</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								{/* Artist Info */}
								<div className='space-y-3'>
									<h3 className='heading-title'>Artist Details</h3>
									<div className='space-y-2'>
										<p>{artist.artist_info.name}</p>
										<p>
											<a
												href={`mailto:${artist.artist_info.email}`}
												className='underlined-link'>
												{artist.artist_info.email}
											</a>
										</p>
										{artist.artist_info.phone && (
											<p>
												<a
													href={`tel:${artist.artist_info.phone}`}
													className='underlined-link'>
													{artist.artist_info.phone}
												</a>
											</p>
										)}
										{artist.artist_info.website && (
											<p>
												<a
													href={`https://${artist.artist_info.website}`}
													target='_blank'
													rel='noopener noreferrer'
													className='underlined-link'>
													{artist.artist_info.website}
												</a>
											</p>
										)}
									</div>
								</div>

								{/* Location & Business Info */}
								<div className='space-y-3'>
									<h3 className='heading-title'>Location & Studio</h3>
									<div className='space-y-2'>
										<address className='not-italic'>
											{artist.location.street}
											<br />
											{artist.location.city}, {artist.location.state || ''}{' '}
											{artist.location.zip}
										</address>
										{artist.employees && (
											<p>Team Size: {artist.employees} people</p>
										)}
										{artist.physical_stores && (
											<p>Store Locations: {artist.physical_stores}</p>
										)}
									</div>
								</div>
							</div>
						</section>

						{/* SOCIAL MEDIA */}
						{(artist.socials?.instagram ||
							artist.socials?.facebook ||
							artist.socials?.bluesky ||
							artist.socials?.tiktok) && (
							<section className='space-y-4 space-x-4'>
								<h2 className='heading-title'>Follow</h2>

								{Object.entries(artist.socials).map(([platform, url]) => {
									return url ? (
										<ExternalLink
											key={platform}
											href={url}
											target='_blank'
											rel='noopener noreferrer'>
											{platform.charAt(0).toUpperCase() + platform.slice(1)}
										</ExternalLink>
									) : null
								})}
							</section>
						)}
					</div>
					{/* ARTIST CAROUSEL */}
					<ArtistCarousel artist={artist} />
				</div>

				{/* SIDEBAR / RIGHT COLUMN */}
				<aside className='bg-accent-1 col-span-3'>
					<h2 className='heading-subtitle'>Related Artists</h2>
					{/* TODO: Implement related artists list */}
				</aside>
			</Container>
		</PageWrapper>
	)
}
