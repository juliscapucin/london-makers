'use client'

import { authClient } from '@/lib/auth-client'
const { signIn, signUp } = authClient

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type FormMode = 'signin' | 'signup'

export default function EmailSignin() {
	const [mode, setMode] = useState<FormMode>('signin')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [name, setName] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setIsLoading(true)

		try {
			if (mode === 'signup') {
				// Validation for signup
				if (password !== confirmPassword) {
					throw new Error('Passwords do not match')
				}
				if (password.length < 6) {
					throw new Error('Password must be at least 6 characters')
				}
				if (!name.trim()) {
					throw new Error('Name is required')
				}

				// Sign up new user
				await signUp.email({
					email,
					password,
					name: name.trim(),
				})

				// Redirect after successful signup
				router.push('/dashboard')
			} else {
				// Sign in existing user
				await signIn.email({
					email,
					password,
				})

				// Redirect after successful login
				router.push('/dashboard')
			}
		} catch (error: unknown) {
			console.error('Auth error:', error)
			setError(
				error instanceof Error
					? error.message
					: 'An error occurred. Please try again.'
			)
		} finally {
			setIsLoading(false)
		}
	}

	const toggleMode = () => {
		setMode(mode === 'signin' ? 'signup' : 'signin')
		setError('')
		setEmail('')
		setPassword('')
		setConfirmPassword('')
		setName('')
	}

	return (
		<>
			{/* Header */}
			<header className='text-center mb-6'>
				<h2 className='heading-headline mb-2'>
					{mode === 'signin' ? 'Welcome Back' : 'Create Account'}
				</h2>
				<p>
					{mode === 'signin'
						? 'Sign in to your account'
						: 'Join the London Makers community'}
				</p>
			</header>

			{error && (
				<div className='mb-4 p-3'>
					<p className='text-sm text-red-600'>{error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className='space-y-4'>
				{mode === 'signup' && (
					<div>
						<label htmlFor='name' className='block mb-1'>
							Full Name
						</label>
						<input
							id='name'
							type='text'
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder='Enter your full name'
							required={mode === 'signup'}
							disabled={isLoading}
							className='form-input w-full'
						/>
					</div>
				)}

				<div>
					<label htmlFor='email' className='block mb-1'>
						Email Address
					</label>
					<input
						id='email'
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='Enter your email'
						required
						disabled={isLoading}
						className='form-input w-full'
					/>
				</div>

				<div>
					<label
						htmlFor='password'
						className='block text-sm font-medium text-gray-700 mb-1'>
						Password
					</label>
					<input
						id='password'
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder={
							mode === 'signup'
								? 'Create a password (min. 6 characters)'
								: 'Enter your password'
						}
						required
						disabled={isLoading}
						minLength={mode === 'signup' ? 6 : undefined}
						className='form-input w-full'
					/>
				</div>

				{mode === 'signup' && (
					<div>
						<label
							htmlFor='confirmPassword'
							className='block text-sm font-medium text-gray-700 mb-1'>
							Confirm Password
						</label>
						<input
							id='confirmPassword'
							type='password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder='Confirm your password'
							required={mode === 'signup'}
							disabled={isLoading}
							className='form-input w-full'
						/>
					</div>
				)}

				<button
					type='submit'
					disabled={isLoading}
					className='btn btn-secondary focus:outline-none mx-auto'>
					{isLoading ? (
						//* LOADING SPINNER *//
						<div className='flex items-center justify-center gap-2'>
							<div className='w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin' />
							{mode === 'signin' ? 'Signing in...' : 'Creating account...'}
						</div>
					) : mode === 'signin' ? (
						'Sign In'
					) : (
						'Create Account'
					)}
				</button>
			</form>

			<div className='mt-6 text-center'>
				<p>
					{mode === 'signin'
						? "Don't have an account?"
						: 'Already have an account?'}{' '}
					<button
						onClick={toggleMode}
						disabled={isLoading}
						className='underlined-link'>
						{mode === 'signin' ? 'Sign up' : 'Sign in'}
					</button>
				</p>
			</div>

			{mode === 'signin' && (
				<div className='mt-4 text-center'>
					<button
						onClick={() => {
							// TODO: Implement forgot password
							alert('Forgot password functionality coming soon!')
						}}
						disabled={isLoading}
						className='underlined-link'>
						Forgot your password?
					</button>
				</div>
			)}
		</>
	)
}
