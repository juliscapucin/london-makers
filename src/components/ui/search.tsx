export default function Search() {
	return (
		<div className='bg-accent-1 h-header'>
			<label htmlFor='artist-search' className='sr-only'>
				Search for artists
			</label>
			<input
				id='artist-search'
				type='text'
				placeholder='Search artists by name, type, or specialty...'
				aria-label='Search for artists'
				className='w-full p-4'
			/>
		</div>
	)
}
