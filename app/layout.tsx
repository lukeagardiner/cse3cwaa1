import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import HeaderFooter from './Components/HeaderFooter';
import {ThemeProvider} from "@/app/contexts/ThemeContext";
import './globals.css'
import RouteTacker from "./RouteTracker";
import Breadcrumbs from "./Components/Breadcrumbs";

// font selection
const inter = Inter({ subsets: ['latin']});

export const metadata: Metadata = {
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
            <ThemeProvider>
                {/* Cookies */}
                <RouteTacker />
                <HeaderFooter>
                    {children}
                </HeaderFooter>
            </ThemeProvider>
        </body>
      </html>
  )
}
