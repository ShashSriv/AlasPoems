import type { Metadata } from 'next'
import { Playfair_Display, Quicksand } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
})

const quicksand = Quicksand({ 
  subsets: ['latin'],
  variable: '--font-quicksand'
})

export const metadata: Metadata = {
  title: 'Alas Poems',
  description: 'A Poem Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${quicksand.className} ${playfair.variable} bg-[#FFF5F7] text-[#5D4037]`}>
        <div className="min-h-screen p-4 sm:p-8 max-w-5xl mx-auto selection:bg-[#FFD1DC] selection:text-[#5D4037]">
             <Navbar />
            {children}
        </div>
      </body>
    </html>
  )
}