// app/unauthorized/page.tsx
'use client'

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-2">🚫 Access Denied</h1>
      <p className="text-gray-700">You are not authorized to view this page.</p>
    </div>
  )
}
