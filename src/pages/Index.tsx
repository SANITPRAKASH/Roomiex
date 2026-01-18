import { Navbar } from '@/components/Navbar'
import { HeroSection } from '@/components/HeroSection'
import { FeaturedRooms } from '@/components/FeaturedRooms'
import { CompatibilityQuiz } from '@/components/CompatibilityQuiz'
import { HowItWorks } from '@/components/HowItWorks'
import { CTASection } from '@/components/CTASection'
import { Footer } from '@/components/Footer'
import { FeaturesSection } from '@/components/FeatureSection'

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedRooms />
        <FeaturesSection />
        <CompatibilityQuiz />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}