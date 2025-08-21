import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import HeaderFooter from './Components/HeaderFooter';
import './globals.css'

// font selection
const inter = Inter({ subsets: ['latin']});

export const metadata = {
  title: 'CSE3CWA - Assessment 1',
  description: 'Assignment 1 for Subject Cloud Web Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
        <body className={inter.className}>
            <HeaderFooter>
                {children}
            </HeaderFooter>

        </body>
      </html>
  )
}
