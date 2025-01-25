import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/components/navbar'
import Sidebar from '@/components/sidebar'
import Footer from '@/components/footer'
import './globals.css'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SamPedro',
  description: 'Your favorite e-commerce destination',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers >

          <div className="flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto min-h-screen max-w-screen-xl mx-auto p-2 ">
                {children}
              </main>
            </div>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

