import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

const steps = [
  {
    step: '01',
    title: 'Tell Us Your Vibe',
    description: 'Quick lifestyle quiz to understand your preferences, work schedule, and living habits.',
    gradient: 'from-primary to-primary-glow'
  },
  {
    step: '02', 
    title: 'Browse Matched Rooms',
    description: 'See rooms ranked by compatibility score. Filter by commute, budget, and amenities.',
    gradient: 'from-secondary to-trust'
  },
  {
    step: '03',
    title: 'Chat & Visit',
    description: 'Anonymous chat with flatmates. Schedule visits for verified rooms with live video tours.',
    gradient: 'from-trust to-secondary'
  },
  {
    step: '04',
    title: 'Trial Stay or Move In',
    description: 'Try a 7-day stay first, or move in directly. E-sign rental agreements digitally.',
    gradient: 'from-primary to-secondary'
  }
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="mb-4">Simple Process</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-gradient">RoomieX</span> Works
          </h2>
          <p className="text-muted-foreground">
            From finding your room to moving in — we've simplified every step.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-border to-transparent -z-10" />
              )}

              <div className="card-elevated p-6 h-full hover:shadow-elevated transition-all duration-300">
                {/* Step Number */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-4 shadow-soft`}>
                  <span className="text-lg font-bold text-primary-foreground">{step.step}</span>
                </div>

                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}