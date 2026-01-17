import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { RoomQualityScorer } from '@/components/RoomQualityScorer'

export default function RoomScorer() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <RoomQualityScorer />
        </div>
      </main>
      <Footer />
    </div>
  )
}