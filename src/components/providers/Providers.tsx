'use client'

import { AppStore, makeStore } from '@/lib/store'
import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'
import { ReactNode, useRef } from 'react'
import { Provider } from 'react-redux'
import ThemeInit from '../ThemeInit'
import { Toaster } from '../ui/sonner'

function Providers({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null)

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <Provider store={storeRef.current}>
        <ThemeInit />
        <Toaster position="top-center" />
        {/* <ParticlesContainer /> */}
        <NextTopLoader
          color="#F7E360"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #F7E360,0 0 5px #F7E360"
          zIndex={1600}
          showAtBottom={false}
        />
        {children}
      </Provider>
    </ThemeProvider>
  )
}

export default Providers
