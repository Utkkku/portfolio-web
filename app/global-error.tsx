'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <html lang="tr">
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backgroundColor: '#0A0A0A',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            backgroundColor: '#1A1A1A',
            border: '1px solid #2A2A2A',
            borderRadius: '1rem',
            padding: '2rem',
            maxWidth: '28rem',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#00FFFF',
              marginBottom: '1rem'
            }}>
              Kritik Hata
            </h2>
            <p style={{
              color: '#9CA3AF',
              marginBottom: '1.5rem'
            }}>
              {error.message || 'Beklenmeyen bir hata oluştu'}
            </p>
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#00FFFF',
                color: '#0A0A0A',
                fontWeight: '600',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}





