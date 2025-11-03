type ContainerProps = {
	classes?: string
	children: React.ReactNode
}

export default function Container({ children, classes = '' }: ContainerProps) {
	return <div className={`container mx-auto px-4 ${classes}`}>{children}</div>
}
