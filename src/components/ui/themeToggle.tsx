'use client'

import { useEffect, useState } from 'react'

import { ButtonToggle } from '@/components/buttons'

type ThemeToggleProps = {
	variant: 'minimal' | 'toggle'
}

export default function ThemeToggle({ variant = 'toggle' }: ThemeToggleProps) {
	const [theme, setTheme] = useState(() => {
		if (typeof window === 'undefined') return 'dark'

		const storedTheme = localStorage.getItem('theme')
		if (storedTheme === 'light' || storedTheme === 'dark') {
			return storedTheme
		}

		const prefersDark = window.matchMedia(
			'(prefers-color-scheme: dark)'
		).matches
		return prefersDark ? 'dark' : 'light'
	})

	const [toggleState, setToggleState] = useState<'on' | 'off'>(() =>
		theme === 'dark' ? 'off' : 'on'
	)

	const handleThemeChange = (newTheme: string) => {
		localStorage.setItem('theme', newTheme)
		setTheme(newTheme)
		setToggleState(newTheme === 'dark' ? 'off' : 'on')
		const documentDiv = document.querySelector('html')
		documentDiv?.setAttribute('data-theme', newTheme)
	}

	// Apply theme to DOM on mount and theme changes
	useEffect(() => {
		const documentDiv = document.querySelector('html')
		documentDiv?.setAttribute('data-theme', theme)
	}, [theme])

	return (
		variant === 'toggle' && (
			<ButtonToggle
				toggleState={toggleState}
				onClick={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
				aria-label='Click to toggle theme between light and dark'
			/>
		)
	)
}
