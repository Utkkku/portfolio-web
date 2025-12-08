import dynamic from 'next/dynamic'

// Dynamic import with SSR disabled for HeroSection to avoid server-side issues
const HeroSection = dynamic(() => import('@/components/HeroSection'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-primary">Yükleniyor...</div>
    </div>
  ),
})

// All components SSR disabled to prevent memory issues
const Stats = dynamic(() => import('@/components/Stats'), {
  loading: () => <div className="h-96 bg-dark-bg" />,
  ssr: false,
})

const Skills = dynamic(() => import('@/components/Skills'), {
  loading: () => <div className="h-96 bg-dark-bg" />,
  ssr: false,
})

const Projects = dynamic(() => import('@/components/Projects'), {
  loading: () => <div className="h-96 bg-dark-bg" />,
  ssr: false,
})

const Certifications = dynamic(() => import('@/components/Certifications'), {
  loading: () => <div className="h-96 bg-dark-bg" />,
  ssr: false,
})

const Contact = dynamic(() => import('@/components/Contact'), {
  loading: () => <div className="h-96 bg-dark-bg" />,
  ssr: false,
})

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <Stats />
      <Skills />
      <Projects />
      <Certifications />
      <Contact />
    </main>
  )
}

