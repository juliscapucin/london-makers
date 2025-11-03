'use client'

import { useRouter, usePathname } from 'next/navigation'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

import { MenuMobile, ThemeToggle } from '@/components/ui'
import { NavLinkType } from '@/types'
import { useEffect, useRef } from 'react'
import { ButtonLogin } from '@/components/buttons'

type HeaderProps = {
	navLinks: NavLinkType[]
}

export default function Header({ navLinks }: HeaderProps) {
	const router = useRouter()
	const pathname = usePathname()

	const bottomBorderRef = useRef<HTMLDivElement>(null)
	const navLinksRef = useRef<HTMLUListElement>(null)
	const navbarElements = useRef<Array<HTMLButtonElement | HTMLAnchorElement>>(
		[]
	)

	const animateBottomBorder = (path: string | null) => {
		const activeLink = navLinks.find((link) => link.slug === path)
		if (activeLink && navLinksRef.current) {
			const linkElement = navbarElements.current.find(
				(el) => el.textContent === activeLink.label
			)

			if (linkElement) {
				const linkRect = linkElement.getBoundingClientRect()
				const navbarRect = navLinksRef.current.getBoundingClientRect()

				gsap.to(bottomBorderRef.current, {
					width: `${linkRect.width}px`,
					left: `${linkRect.left - navbarRect.left}px`,
					duration: 0.5,
					ease: 'power2.out',
				})
			}
		}
	}

	useEffect(() => {
		if (navLinksRef.current) {
			navbarElements.current = Array.from(
				navLinksRef.current.querySelectorAll('button, a')
			)
		}

		if (!bottomBorderRef.current) return
		animateBottomBorder(pathname)
	}, [])

	// Animate bottom border on route change
	useGSAP(() => {
		if (!bottomBorderRef.current) return
		animateBottomBorder(pathname)
	}, [pathname])

	return (
		<header className='pointer-events-none fixed top-0 right-0 left-0 z-50'>
			<MenuMobile navLinks={navLinks} />
			<nav
				className='pointer-events-auto relative mx-auto h-header w-fit max-w-desktop items-center justify-between gap-32 overflow-clip px-8 py-2 transition-[background-color] duration-800 md:hidden lg:flex'
				onMouseLeave={() => animateBottomBorder(pathname)}>
				{/* NAVLINKS */}
				<ul ref={navLinksRef} className='relative gap-8 lg:flex items-end '>
					{/* START */}
					<button
						onClick={() => router.push('/')}
						onMouseEnter={() => animateBottomBorder('/')}
						disabled={pathname === '/'}>
						Start
					</button>

					{/* LINKS */}
					{navLinks.map(
						(link, index) =>
							link.slug !== '/' && (
								<button
									key={`panel-button-${index}`}
									onClick={() => router.push(link.slug)}
									onMouseEnter={() => animateBottomBorder(link.slug)}>
									{link.label}
								</button>
							)
					)}
					{/* BOTTOM BORDER */}
					<div
						ref={bottomBorderRef}
						className='pointer-events-none absolute left-0 bottom-0 z-50 bg-red-300'
						aria-hidden='true'>
						<div className='h-0.5 bg-secondary'></div>
					</div>
				</ul>

				{/* LOGIN BUTTON */}
				<ButtonLogin />

				{/* THEME SWITCHER */}
				<ThemeToggle variant='toggle' />
			</nav>
		</header>
	)
}
