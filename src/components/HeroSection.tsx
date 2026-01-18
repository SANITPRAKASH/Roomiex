import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin, Users, Shield, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import heroImage from '@/assets/hero-room.jpg'

export function HeroSection() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [budget, setBudget] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    if (budget) params.set('maxPrice', budget)
    navigate(`/rooms?${params.toString()}`)
  }

  const handleQuickFilter = (filter: string) => {
    navigate(`/rooms?location=${encodeURIComponent(filter)}`)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Modern cozy room" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="default" className="mb-6">
              <Shield className="w-3.5 h-3.5" />
              Verified & Scam-Free Listings
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Find Your Perfect{" "}
            <span className="text-gradient">Room</span>
            <br />
            & Compatible{" "}
            <span className="text-gradient">Flatmates</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Not apartments. Just rooms. PG, shared rooms, co-living spaces — 
            with AI-powered flatmate matching & verified listings.
          </motion.p>

          {/* Search Box */}
          <motion.div 
            className="glass-card p-4 md:p-6 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Enter city, area or landmark..." 
                  className="pl-10 h-12 bg-background/50"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Max ₹ budget" 
                  className="pl-10 h-12 w-full md:w-40 bg-background/50"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button variant="hero" size="lg" className="h-12 px-8 gap-2" onClick={handleSearch}>
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => handleQuickFilter("Metro")}
              >
                <Sparkles className="w-3 h-3" />
                Near Metro
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => handleQuickFilter("Koramangala")}
              >
                Koramangala
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => handleQuickFilter("HSR Layout")}
              >
                HSR Layout
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/20 transition-colors"
                onClick={() => handleQuickFilter("Indiranagar")}
              >
                Indiranagar
              </Badge>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="flex flex-wrap gap-8 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gradient">12,000+</p>
              <p className="text-sm text-muted-foreground">Verified Rooms</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gradient">50,000+</p>
              <p className="text-sm text-muted-foreground">Happy Tenants</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gradient">98%</p>
              <p className="text-sm text-muted-foreground">Match Success</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}