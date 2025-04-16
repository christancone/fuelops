// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FuelOps',
  description: 'Smart fuel station management system',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = createServerComponentClient({ cookies })

  await supabase.auth.getSession()

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          {/* You can pass `session` via context or props here */}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
