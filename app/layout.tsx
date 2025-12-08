import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Layout from '@/components/Layout'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { APP_CONFIG } from '@/lib/constants'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.title,
    template: `%s | ${APP_CONFIG.title}`,
  },
  description: APP_CONFIG.description,
  keywords: ['yazılım mühendisi', 'developer', 'portfolio', 'web development', 'full stack developer', 'Next.js', 'React', 'TypeScript', 'Utku Göçer'],
  authors: [{ name: APP_CONFIG.author }],
  creator: APP_CONFIG.author,
  metadataBase: new URL(APP_CONFIG.url),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: APP_CONFIG.url,
    title: APP_CONFIG.title,
    description: APP_CONFIG.description,
    siteName: APP_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_CONFIG.title,
    description: APP_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <LanguageProvider>
          <Layout>
            {children}
          </Layout>
        </LanguageProvider>
      </body>
    </html>
  )
}

