'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [userName, setUserName] = useState('')
  const [playlistUrl, setPlaylistUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true); setError(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, playlistUrl }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat memproses data.')
      }

      router.push(`/sertifikat/${data.certificateId}`)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-4 font-sans text-gray-800">
      
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-lg p-6 md:p-8">
        
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">C</div>
            <span className="text-2xl font-semibold tracking-tight text-gray-900">CertifYT</span>
          </div>
          <h1 className="text-xl font-medium text-gray-900">Generate Sertifikat</h1>
          <p className="text-sm text-gray-500 mt-1">Validasi pembelajaran YouTube Anda secara profesional.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1.5">Nama Penerima</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nama Lengkap Anda"
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wide mb-1.5">URL Playlist</label>
            <input
              type="url"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder="https://www.youtube.com/playlist?list=..."
              className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sedang Menghitung...
              </span>
            ) : (
              'Buat Sertifikat'
            )}
          </button>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-md text-red-600 text-xs text-center">
              {error}
            </div>
          )}
        </form>
      </div>
      
      <div className="mt-6 text-center text-xs text-gray-400">
        &copy; 2025 CertifYT. Tidak terafiliasi dengan Google atau YouTube.
      </div>
    </div>
  )
}