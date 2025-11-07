'use client'

import { useRef, useEffect, Fragment } from 'react'
import { usePathname } from 'next/navigation'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GSDevTools } from 'gsap/GSDevTools'
gsap.registerPlugin(ScrollSmoother, ScrollTrigger, GSDevTools)

import { navLinks } from '@/data'

import { Footer, Header } from '@/components/ui'
import { useSession } from '@/contexts'
import { SessionType } from '@/types'

type PageWrapperProps = {
	variant?: 'primary' | 'secondary' | 'tertiary' | 'accent'
	classes?: string
	children?: React.ReactNode
	hasContainer?: boolean
	hasFooter?: boolean
	pageName: string
	sessionData?: SessionType
}

export default function PageWrapper({
	children,
	variant = 'primary',
	classes,
	hasContainer = true,
	hasFooter = true,
	pageName,
	sessionData,
}: PageWrapperProps) {
	const pathname = usePathname()
	const { setSession } = useSession()

	const scrollSmootherRef = useRef<ScrollSmoother | null>(null)
	const pageContentRef = useRef<HTMLDivElement | null>(null)
	const pageTransitionRef = useRef<HTMLDivElement | null>(null)

	let pageWrapperStyles = ''

	switch (variant) {
		case 'primary':
			pageWrapperStyles = 'bg-primary text-secondary'
			break
		case 'secondary':
			pageWrapperStyles = 'bg-secondary text-primary'
			break
		case 'tertiary':
			pageWrapperStyles = 'bg-tertiary text-primary'
			break
		case 'accent':
			pageWrapperStyles = 'bg-accent-1 text-primary'
			break
	}

	//* INITIALIZE GSAP SCROLLSMOOTHER *//
	useGSAP(() => {
		// Only run on client side
		if (typeof window === 'undefined') return

		// Cleanup existing ScrollSmoother
		if (scrollSmootherRef.current) {
			scrollSmootherRef.current.kill()
			scrollSmootherRef.current = null
		}

		// Create new ScrollSmoother
		scrollSmootherRef.current = ScrollSmoother.create({
			smooth: 1,
			effects: false,
		})
	}, [pathname])

	// * PAGE TRANSITION ANIMATION *//
	useGSAP(() => {
		if (!pageContentRef.current || !pageTransitionRef.current) return

		gsap.set(pageContentRef.current, { xPercent: -10 })

		// Animate the mask to reveal the content
		gsap.to(pageTransitionRef.current, {
			duration: 0.6,
			xPercent: 100,
			ease: 'power2.out',
		})
		gsap.to(pageContentRef.current, {
			xPercent: 0,
			duration: 0.5,
			ease: 'power2.out',
		})

		// GSDevTools.create()
	}, [pageName, pathname])

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (scrollSmootherRef.current) {
				scrollSmootherRef.current.kill()
				scrollSmootherRef.current = null
			}
		}
	}, [])

	return (
		<Fragment key={pageName}>
			{/* PAGE TRANSITION MASK */}
			<div
				ref={pageTransitionRef}
				className='gsap-page-transition fixed inset-0 bg-secondary z-50'></div>

			{/* HEADER */}
			<Header navLinks={navLinks} />

			{/* GSAP SMOOTHER WRAPPER */}
			<div id='smooth-wrapper' className='z-0 pointer-events-none'>
				{/* GSAP SMOOTHER CONTENT */}
				<div id='smooth-content' className={`z-0 pointer-events-none`}>
					{/* PAGE CONTENT BACKGROUND */}
					<div
						ref={pageContentRef}
						className={`gsap-page-wrapper min-h-screen w-full pointer-events-auto pt-[var(--height-header)] ${
							pageWrapperStyles ? pageWrapperStyles : ''
						}`}>
						{/* PAGE CONTENT CONTAINER */}
						<div
							className={`relative pointer-events-auto ${
								hasContainer ? 'container pb-32 mx-auto' : ''
							}`}>
							{/* MAIN CONTENT */}
							{/* Keep children in column 2 to 13 */}
							<main
								id='main-content' // Add id for skip link
								tabIndex={-1} // Make focusable for skip link
								className={`${classes ? classes : ''}`}>
								{children}
							</main>
						</div>
					</div>

					{/* FOOTER */}
					{hasFooter && <Footer navLinks={navLinks} />}
				</div>
			</div>
		</Fragment>
	)
}
