"use client";

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const ErrorContent = () => {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-700 mb-4">
          There was an error during authentication. Please try again.
        </p>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
            <p className="text-red-800 text-sm">
              <strong>Error Details:</strong> {decodeURIComponent(error)}
            </p>
          </div>
        )}
        <div className="space-y-2">
          <Link
            href="/auth/login"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center"
          >
            Back to Login
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 text-center"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}

export default Page
