import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export function CTASection() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email')
      return
    }

    // Option 1: Navigate to signup page with email pre-filled
    navigate(`/auth?email=${encodeURIComponent(email)}`)
    
    // Option 2: Show success message and save email
    // toast.success('Welcome! Redirecting to sign up...')
    // setTimeout(() => navigate('/auth'), 1000)
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="w-3 h-3" />
            Get Started Free
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Find Your{" "}
            <span className="text-gradient">Perfect Room</span>?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join 50,000+ happy tenants who found their ideal room and compatible flatmates through RoomieX.
          </p>

          {/* Email Signup Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="h-12 bg-background/50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" variant="hero" size="lg" className="gap-2 shrink-0">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            Free to browse. No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}