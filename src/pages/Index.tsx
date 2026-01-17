import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/HeroSection'
import { Footer } from '@/components/Footer'

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        {/* More sections will be added here */}
      </main>
      <Footer />
    </div>
  )
}