'use client'

import {
	createContext,
	useContext,
	useState,
	useCallback,
	ReactNode,
} from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { useRef } from 'react'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
	id: string
	type: NotificationType
	title?: string
	message: string
	duration?: number
	action?: {
		label: string
		onClick: () => void
	}
}

interface NotificationContextType {
	notifications: Notification[]
	addNotification: (notification: Omit<Notification, 'id'>) => string
	removeNotification: (id: string) => void
	clearAllNotifications: () => void
	// Convenience methods
	showSuccess: (message: string, title?: string, duration?: number) => string
	showError: (message: string, title?: string, duration?: number) => string
	showInfo: (message: string, title?: string, duration?: number) => string
	showWarning: (message: string, title?: string, duration?: number) => string
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined
)

export const useNotifications = () => {
	const context = useContext(NotificationContext)
	if (context === undefined) {
		throw new Error(
			'useNotifications must be used within a NotificationProvider'
		)
	}
	return context
}

function NotificationItem({
	notification,
	onRemove,
}: {
	notification: Notification
	onRemove: (id: string) => void
}) {
	const itemRef = useRef<HTMLDivElement>(null)

	const getNotificationStyles = (type: NotificationType) => {
		switch (type) {
			case 'success':
				return {
					container: 'bg-green-50 border-green-200 text-green-800',
				}
			case 'error':
				return {
					container: 'bg-red-50 border-red-200 text-red-800',
				}
			case 'warning':
				return {
					container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
				}
			case 'info':
			default:
				return {
					container: 'bg-blue-50 border-blue-200 text-blue-800',
				}
		}
	}

	const styles = getNotificationStyles(notification.type)

	// REMOVAL ANIMATION
	const handleRemove = () => {
		if (!itemRef.current) return

		gsap.to(itemRef.current, {
			xPercent: 100,
			opacity: 0,
			duration: 0.3,
			ease: 'power2.in',
			onComplete: () => {
				onRemove(notification.id)
			},
		})
	}

	// ENTRANCE ANIMATION + AUTO-REMOVE
	useGSAP(() => {
		if (!itemRef.current) return

		// Entrance animation
		gsap.fromTo(
			itemRef.current,
			{
				xPercent: 100,
				opacity: 0,
			},
			{
				xPercent: 0,
				opacity: 1,
				duration: 0.5,
				ease: 'power2.out',
			}
		)

		// Auto-remove after duration
		if (notification.duration && notification.duration > 0) {
			const timer = setTimeout(() => {
				handleRemove()
			}, notification.duration)

			return () => clearTimeout(timer)
		}
	}, [notification.id])

	return (
		<div
			ref={itemRef}
			className={`border rounded-lg p-4 shadow-lg max-w-md ${styles.container}`}>
			<div className='flex items-start'>
				<div className='ml-3 flex-1'>
					{notification.title && (
						<h3 className='text-sm font-medium mb-1'>{notification.title}</h3>
					)}
					<p className='text-sm'>{notification.message}</p>

					{notification.action && (
						<div className='mt-3'>
							<button
								onClick={notification.action.onClick}
								className='text-sm underline hover:no-underline'>
								{notification.action.label}
							</button>
						</div>
					)}
				</div>

				<div className='ml-4'>
					<button
						onClick={handleRemove}
						className='text-gray-400 hover:text-gray-600 transition-colors'>
						<span>Close</span>
					</button>
				</div>
			</div>
		</div>
	)
}

export function NotificationProvider({ children }: { children: ReactNode }) {
	const [notifications, setNotifications] = useState<Notification[]>([])

	const addNotification = useCallback(
		(notificationData: Omit<Notification, 'id'>) => {
			const id =
				Math.random().toString(36).substring(2) + Date.now().toString(36)
			const notification: Notification = {
				id,
				duration: 15000, // Default 15 seconds
				...notificationData,
			}

			setNotifications((prev) => [...prev, notification])
			return id
		},
		[]
	)

	const removeNotification = useCallback((id: string) => {
		setNotifications((prev) =>
			prev.filter((notification) => notification.id !== id)
		)
	}, [])

	const clearAllNotifications = useCallback(() => {
		setNotifications([])
	}, [])

	// Convenience methods
	const showSuccess = useCallback(
		(message: string, title?: string, duration?: number) => {
			return addNotification({ type: 'success', message, title, duration })
		},
		[addNotification]
	)

	const showError = useCallback(
		(message: string, title?: string, duration?: number) => {
			return addNotification({
				type: 'error',
				message,
				title,
				duration: duration || 8000,
			}) // Errors stay longer
		},
		[addNotification]
	)

	const showInfo = useCallback(
		(message: string, title?: string, duration?: number) => {
			return addNotification({ type: 'info', message, title, duration })
		},
		[addNotification]
	)

	const showWarning = useCallback(
		(message: string, title?: string, duration?: number) => {
			return addNotification({ type: 'warning', message, title, duration })
		},
		[addNotification]
	)

	const contextValue: NotificationContextType = {
		notifications,
		addNotification,
		removeNotification,
		clearAllNotifications,
		showSuccess,
		showError,
		showInfo,
		showWarning,
	}

	return (
		<NotificationContext.Provider value={contextValue}>
			{children}

			{/* Notification Container */}
			<div className='fixed top-4 right-4 z-999 space-y-3 pointer-events-none'>
				{notifications.map((notification) => (
					<div key={notification.id} className='pointer-events-auto'>
						<NotificationItem
							notification={notification}
							onRemove={removeNotification}
						/>
					</div>
				))}
			</div>
		</NotificationContext.Provider>
	)
}
