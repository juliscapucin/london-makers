import { IconArrowUpRight } from '../icons'

type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	variant: 'primary' | 'secondary'
	classes?: string
}

export default function ExternalLink({
	variant,
	classes,
	...props
}: ExternalLinkProps) {
	return (
		<a
			className={`inline-flex group gap-2 ${
				variant === 'primary' ? 'text-primary' : 'text-secondary'
			} ${classes}`}
			{...props}
			target='_blank'
			rel='noopener noreferrer'>
			<span className='underlined-link'>{props.children}</span>
			{/* ICON ARROW RIGHT UP */}
			<span className='inline-block overflow-clip h-5'>
				<span className='block pt-1 group-hover:translate-x-full transition-transform duration-300 group-hover:-translate-y-3.5'>
					<span
						className={`block w-4 h-3.5 overflow-clip ${
							variant === 'primary' ? 'text-primary' : 'text-secondary'
						}`}>
						<IconArrowUpRight
							color={
								variant === 'primary' ? 'primary' : 'secondary'
							}></IconArrowUpRight>
					</span>
					<span
						className={`block w-4 h-3.5 overflow-clip -translate-x-full ${
							variant === 'primary' ? 'text-primary' : 'text-secondary'
						}`}>
						<IconArrowUpRight
							color={
								variant === 'primary' ? 'primary' : 'secondary'
							}></IconArrowUpRight>
					</span>
				</span>
			</span>
		</a>
	)
}
