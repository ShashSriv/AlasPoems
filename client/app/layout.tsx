import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <div className="min-h-screen p-8 max-w-4xl mx-auto">
             <nav className="mb-8 flex gap-6 text-lg border-b pb-4">
                <a href="/" className="hover:text-blue-600 transition font-medium">Home</a>
                <a href="/about" className="hover:text-blue-600 transition font-medium">About</a>
             </nav>
            {children}
        </div>
      </body>
    </html>
  )
}