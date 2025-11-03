import { IconClose } from '@/components/icons'

type ButtonCloseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	classes?: string
}

export default function ButtonClose({ classes, ...props }: ButtonCloseProps) {
	return (
		<button className={`group relative h-12 w-12 ${classes || ''}`} {...props}>
			<div className='transform-rotate duration-300 group-hover:rotate-90'>
				<IconClose />
			</div>
		</button>
	)
}
