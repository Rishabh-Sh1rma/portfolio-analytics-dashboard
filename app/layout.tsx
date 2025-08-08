import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// Assuming you have a ThemeProvider component from Shadcn/UI or similar
// import { ThemeProvider } from "@/components/theme-provider" 

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Portfolio Analytics Dashboard',
  description: 'Comprehensive portfolio tracking and analytics platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body className={`${inter.className} min-h-screen`}>
          {children}
      </body>
    </html>
  )
}