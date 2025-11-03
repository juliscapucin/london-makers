'use client'

import { useRef, useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import gsap from 'gsap'

import { ButtonBurger, ButtonClose } from '@/components/buttons'

import type { NavLink } from '@/types'
import { useGSAP } from '@gsap/react'

type NavLinksProps = {
	navLinks: NavLink[]
}

export default function MenuMobile({ navLinks }: NavLinksProps) {
	const mobileMenuRef = useRef<HTMLDivElement | null>(null)
	const pathname = usePathname()
	const router = useRouter()

	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [slug, setSlug] = useState<string | null>(null)

	const toggleMenu = (slug?: string | null) => {
		setIsMenuOpen((prev) => !prev)
		if (slug) {
			router.push(slug)
		}
	}

	useGSAP(
		() => {
			if (!mobileMenuRef.current) return

			if (isMenuOpen) {
				gsap.to(mobileMenuRef.current, {
					y: '0%',
					duration: 0.5,
					ease: 'power4.out',
					onComplete: () => {
						document.body.style.overflow = 'hidden'
						if (slug) router.push(slug)
					},
				})
			} else {
				document.body.style.overflow = 'unset'
				gsap.to(mobileMenuRef.current, {
					y: '-120%',
					duration: 0.5,
					ease: 'power4.in',
				})
			}
		},
		{ dependencies: [isMenuOpen], scope: mobileMenuRef }
	)

	// Handle escape key
	useEffect(() => {
		if (!isMenuOpen) return
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isMenuOpen) {
				toggleMenu()
			}
		}

		document.addEventListener('keydown', handleEscape)
		return () => document.removeEventListener('keydown', handleEscape)
	}, [isMenuOpen])

	return (
		navLinks && (
			<>
				{/* BURGER BUTTON - Outside header for blend mode */}
				<ButtonBurger
					className='z-50 pointer-events-auto fixed top-0 flex w-full items-center justify-end pr-4 mix-blend-exclusion md:hidden'
					onClick={() => toggleMenu()}
					aria-expanded={isMenuOpen}
					aria-controls='mobile-menu'
					aria-haspopup='dialog'
					aria-label={'Open navigation menu'}
				/>
				<header className='fixed top-2 right-0 left-0 z-50 pointer-events-none block h-dvh md:hidden gutter-stable'>
					{/* EXPANDED MENU */}
					<aside
						className='z-50 pointer-events-auto fixed top-0 min-h-svh w-full bg-secondary transition-transform duration-300'
						ref={mobileMenuRef}
						role='dialog'
						aria-modal='true'
						aria-labelledby='mobile-menu-title'>
						<div className='absolute top-4 right-4 z-100'>
							{/* CLOSE BUTTON */}
							<ButtonClose
								aria-label='Close navigation menu'
								onClick={() => toggleMenu()}
							/>
						</div>

						{/* SCREEN READER TITLE */}
						<h2 id='mobile-menu-title' className='sr-only'>
							Navigation Menu
						</h2>

						{/* NAV LINKS */}
						<nav
							aria-label='Navigation'
							className='flex h-screen flex-col items-center justify-center gap-8'>
							{navLinks.map((link) => {
								const isCurrentPage =
									(link.slug === '/' && pathname === '/') ||
									(link.slug !== '/' && pathname.includes(`${link.slug}`))

								return (
									<div
										className='relative flex w-full justify-center'
										key={link.slug}>
										<button
											className='block font-primary disabled:opacity-40 transition-opacity duration-500'
											onClick={() => toggleMenu(link.slug)}
											disabled={isCurrentPage}
											aria-current={isCurrentPage ? 'location' : undefined}
											tabIndex={isMenuOpen ? 0 : -1}>
											<span className='heading-display text-primary md:text-secondary uppercase'>
												{link.label}
											</span>
										</button>
									</div>
								)
							})}
						</nav>
					</aside>
				</header>
			</>
		)
	)
}
