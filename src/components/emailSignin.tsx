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
		<div>
			<div className='text-center mb-6'>
				<h2 className='text-2xl font-bold text-gray-900 mb-2'>
					{mode === 'signin' ? 'Welcome Back' : 'Create Account'}
				</h2>
				<p>
					{mode === 'signin'
						? 'Sign in to your account'
						: 'Join the London Makers community'}
				</p>
			</div>

			{error && (
				<div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
					<p className='text-sm text-red-600'>{error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className='space-y-4'>
				{mode === 'signup' && (
					<div>
						<label
							htmlFor='name'
							className='block text-sm font-medium text-gray-700 mb-1'>
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
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
						/>
					</div>
				)}

				<div>
					<label
						htmlFor='email'
						className='block text-sm font-medium text-gray-700 mb-1'>
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
						className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
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
						className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
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
							className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
						/>
					</div>
				)}

				<button
					type='submit'
					disabled={isLoading}
					className='btn btn-ghost focus:outline-none mx-auto'>
					{isLoading ? (
						<div className='flex items-center justify-center gap-2'>
							<div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
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
				<p className='text-sm text-gray-600'>
					{mode === 'signin'
						? "Don't have an account?"
						: 'Already have an account?'}{' '}
					<button
						onClick={toggleMode}
						disabled={isLoading}
						className='font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline disabled:opacity-50'>
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
						className='text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:underline disabled:opacity-50'>
						Forgot your password?
					</button>
				</div>
			)}
		</div>
	)
}
