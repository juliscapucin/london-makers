'use client'

import { createContext, useContext, ReactNode, useState } from 'react'
import { SessionType } from '@/types'

type SessionContextType = {
	session: SessionType
	setSession: (session: SessionType | null) => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const useSession = () => {
	const context = useContext(SessionContext)
	if (context === undefined) {
		throw new Error('useSession must be used within a SessionProvider')
	}
	return context
}

export function SessionProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<SessionType | null>(null)
	const contextValue = {
		session: session || null,
		setSession,
	}

	return (
		<SessionContext.Provider value={contextValue}>
			{children}
		</SessionContext.Provider>
	)
}
