'use client'

import { useRouter, usePathname } from 'next/navigation'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import { MenuMobile, ThemeToggle } from '@/components/ui'
import { NavLink as NavLinkType } from '@/types'
import { useEffect, useRef } from 'react'

type HeaderProps = {
	navLinks: NavLinkType[]
}

export default function Header({ navLinks }: HeaderProps) {
	const router = useRouter()
	const pathname = usePathname()

	const bottomBorderRef = useRef<HTMLDivElement>(null)
	const navbarRef = useRef<HTMLElement>(null)
	const navbarElements = useRef<Array<HTMLButtonElement | HTMLAnchorElement>>(
		[]
	)

	const animateBottomBorder = (path: string | null, delay: number) => {
		const activeLink = navLinks.find((link) => link.slug === path)
		if (activeLink && navbarRef.current) {
			const linkElement = navbarElements.current.find(
				(el) => el.textContent === activeLink.label
			)

			if (linkElement) {
				const linkRect = linkElement.getBoundingClientRect()
				const navbarRect = navbarRef.current.getBoundingClientRect()

				gsap.to(bottomBorderRef.current, {
					width: `${linkRect.width}px`,
					left: `${linkRect.left - navbarRect.left}px`,
					duration: 0.5,
					ease: 'power2.out',
					// delay: delay,
				})
			}
		}
	}

	useEffect(() => {
		if (navbarRef.current) {
			navbarElements.current = Array.from(
				navbarRef.current.querySelectorAll('button, a')
			)
		}

		if (!bottomBorderRef.current) return
		animateBottomBorder(pathname, 0)
	}, [])

	// Animate bottom border on route change
	useGSAP(() => {
		if (!bottomBorderRef.current) return
		animateBottomBorder(pathname, 0)
	}, [pathname])

	return (
		<header className='pointer-events-none fixed top-0 right-0 left-0 z-50'>
			<MenuMobile navLinks={navLinks} />
			<nav
				ref={navbarRef}
				className='pointer-events-auto relative mx-auto h-[var(--header-height)] w-fit max-w-[var(--max-width)] items-center justify-between gap-32 overflow-clip rounded-b-2xl bg-accent px-8 py-2 transition-[background-color] duration-800 md:hidden lg:flex'
				onMouseLeave={() => animateBottomBorder(pathname, 0.5)}>
				{/* NAVLINKS */}
				<ul className='gap-8 lg:flex'>
					{/* START */}
					<button
						onClick={() => router.push('/')}
						onMouseEnter={() => animateBottomBorder('/', 0)}
						disabled={pathname === '/'}>
						Start
					</button>

					{navLinks.map(
						(link, index) =>
							link.slug !== '/' && (
								<button
									key={`panel-button-${index}`}
									onClick={() => router.push(link.slug)}
									onMouseEnter={() => animateBottomBorder(link.slug, 0)}>
									{link.label}
								</button>
							)
					)}
					{/* BOTTOM BORDER */}
					<div
						ref={bottomBorderRef}
						className='pointer-events-none absolute bottom-1 left-0 z-50 h-2 w-full'
						aria-hidden='true'>
						<div className='h-[2px] bg-secondary'></div>
					</div>
				</ul>

				{/* THEME SWITCHER */}
				<ThemeToggle variant='toggle' />
			</nav>
		</header>
	)
}
