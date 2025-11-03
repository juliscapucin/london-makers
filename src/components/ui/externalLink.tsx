import { IconArrowUpRight } from '../icons'

type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
	classes?: string
}

export default function ExternalLink({ classes, ...props }: ExternalLinkProps) {
	return (
		<a
			className={`relative inline-flex items-center group gap-2 w-fit ${classes}`}
			{...props}
			target='_blank'
			rel='noopener noreferrer'>
			{/* LABEL */}
			<span className='underlined-link'>{props.children}</span>
			{/* ARROW ANIMATION */}
			<span className='relative inline-block overflow-hidden w-4 h-4 '>
				{/* First arrow - moves out */}
				<span className='absolute inset-0 transition-transform duration-300 ease-out group-hover:translate-x-4 group-hover:-translate-y-4'>
					<IconArrowUpRight />
				</span>
				{/* Second arrow - moves in */}
				<span className='absolute inset-0 -translate-x-4 translate-y-4 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0'>
					<IconArrowUpRight />
				</span>
			</span>
		</a>
	)
}
