'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-white">
      <header className="max-w-7xl mx-auto p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">FuelOps</h1>
        <button
          onClick={() => router.push('/login')}
          className="px-5 py-2 border border-white text-white hover:bg-white hover:text-black transition-colors duration-200 rounded-md"
        >
          Login
        </button>
      </header>

      <main className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-16">
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-5xl font-extrabold leading-tight">
            Revolutionize Your Fuel Station Management
          </h2>
          <p className="text-lg text-slate-300">
            FuelOps is your smart companion for modern fuel station operations.
            Manage fuel, track sales, handle employees, generate reports — all in one seamless dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              className="text-lg px-8 py-6"
              onClick={() => router.push('/register-station')}
            >
              Register Your Fuel Business  test test
            </Button>
            <Button
              variant="secondary"
              className="text-lg px-8 py-6"
              onClick={() => router.push('/login')}
            >
              Log In
            </Button>
          </div>
        </div>

        <div className="lg:w-1/2 mt-10 lg:mt-0 relative">
          <Image
            src="/dashboard-preview.png"
            alt="FuelOps Dashboard Preview"
            width={640}
            height={400}
            className="rounded-xl shadow-2xl border border-slate-700"
          />
        </div>
      </main>

      <footer className="text-center py-6 text-slate-400">
        &copy; {new Date().getFullYear()} FuelOps. All rights reserved.
      </footer>
    </div>
  )
}