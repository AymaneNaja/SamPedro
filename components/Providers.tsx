'use client'
import { store } from '@/redux/store'
import React from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from './theme-provider'
import { SessionProvider } from 'next-auth/react'

type Props = { children: React.ReactNode }

function Providers({ children }: Props) {
    return (
        <Provider store={store}>
            <SessionProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >{children}</ThemeProvider></SessionProvider>

        </Provider>
    )
}

export default Providers