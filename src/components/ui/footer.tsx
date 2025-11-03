'use client'

import { useRef } from 'react'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

import { ExternalLink, Logo } from '@/components/ui'

import type { NavLinkType } from '@/types'

type FooterProps = {
	navLinks: NavLinkType[]
}

export default function Footer({ navLinks }: FooterProps) {
	const footerContainerRef = useRef<HTMLElement>(null)
	const footerContentRef = useRef<HTMLDivElement>(null)

	useGSAP(() => {
		if (!footerContainerRef.current || !footerContentRef.current) return

		ScrollTrigger.getById('footer')?.kill()

		setTimeout(() => {
			const tl = gsap.timeline({
				scrollTrigger: {
					id: 'footer',
					trigger: footerContainerRef.current,
					start: 'top bottom',
					end: 'center bottom',
					scrub: 0,
					// markers: true,
				},
			})

			tl.fromTo(
				footerContentRef.current,
				{ yPercent: -30 },
				{ yPercent: 0, ease: 'none' },
				0 // start at the same time as previous tween
			)
		}, 500) // Delay to ensure ScrollTrigger is properly reset

		return () => {
			ScrollTrigger.getById('footer')?.kill()
		}
	}, [])

	return (
		<footer
			ref={footerContainerRef}
			className={`relative h-footer pointer-events-auto overflow-clip grid grid-cols-14 bg-secondary text-primary`}>
			{/* CONTENT */}
			<div
				ref={footerContentRef}
				className={`relative w-full px-2 col-start-2 col-end-14 transition-[background-color] duration-800 container mx-auto py-8 flex flex-col`}>
				{/* LOGO */}
				<div className='mt-8 md:mb-8'>
					<Logo classes='heading-display' />
				</div>
				{/* COPYRIGHT */}
				<p className='mb-8 md:mb-0'>
					© {new Date().getFullYear()} All rights reserved
				</p>

				<div className='flex-1 flex flex-col gap-8 md:flex-row w-full items-end justify-between'>
					{/* TERMS */}
					<div>
						<p className='text-paragraph'>
							Images featured in this collection are sourced from Unsplash and
							remain the property of their respective photographers. Please
							review individual licenses on Unsplash before reuse.
						</p>
						<p className='text-paragraph mt-8'>
							Read more about Terms & Conditions, Cookies, and Privacy Policies
							at{' '}
							<ExternalLink href='https://unsplash.com/license'>
								Unsplash.com
							</ExternalLink>{' '}
						</p>
					</div>

					{/* CREDIT */}
					<p className='mt-4 md:mt-0'>
						Crafted by{' '}
						<ExternalLink href='https://juliscapucin.com'>
							Juli Scapucin
						</ExternalLink>
					</p>
				</div>
			</div>
		</footer>
	)
}
