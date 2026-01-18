import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, Shield, MapPin, Clock, 
  Sparkles, FileText, MessageSquare, Calculator 
} from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Users,
    title: 'Flatmate Compatibility',
    description: 'AI matches you with flatmates based on sleep schedule, cleanliness, work style & social preferences',
    badge: 'Killer Feature',
    color: 'from-primary to-primary-glow'
  },
  {
    icon: Shield,
    title: 'Scam-Proof Listings',
    description: 'Owner verification, live video tours, AI-detected fake photos. Only genuine rooms listed.',
    badge: 'Trust First',
    color: 'from-trust to-secondary'
  },
  {
    icon: MapPin,
    title: 'Commute-Aware Search',
    description: "Enter your office/college location. We'll show rooms ranked by actual commute time.",
    badge: 'Smart',
    color: 'from-secondary to-trust'
  },
  {
    icon: Clock,
    title: 'Trial Stays',
    description: 'Try before you commit. 7-14 day trial stays to ensure the room is right for you.',
    badge: 'Flexible',
    color: 'from-primary to-secondary'
  },
  {
    icon: MessageSquare,
    title: 'Anonymous Flat Chat',
    description: "Chat with existing flatmates before booking. No phone numbers exchanged until you're ready.",
    badge: 'Safe',
    color: 'from-trust to-primary'
  },
  {
    icon: Calculator,
    title: 'Smart Rent Splitter',
    description: 'Auto-calculate fair rent based on room size, bathroom, balcony & AC. No more drama.',
    badge: 'Fair',
    color: 'from-secondary to-primary'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3" />
            Why Choose RoomieX
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Not Just Another{" "}
            <span className="text-gradient">Rental Platform</span>
          </h2>
          <p className="text-muted-foreground">
            We solve real problems that other platforms ignore. From scam detection to flatmate matching, 
            every feature is designed to make your room hunt stress-free.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="glass-card p-6 hover:shadow-card transition-all duration-300 hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-soft`}>
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <Badge variant="secondary" className="mb-3">{feature.badge}</Badge>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          
        </motion.div>
      </div>
    </section>
  )
}