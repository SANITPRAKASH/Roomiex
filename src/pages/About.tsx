import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Users, Zap, Globe, Shield, Sparkles } from 'lucide-react'

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'People First',
      description: 'We believe finding a home should be a joyful experience, not a stressful one.'
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Every listing is verified and every user is accountable.'
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'AI-powered matching and smart tools make room hunting effortless.'
    },
    {
      icon: Globe,
      title: 'Inclusivity',
      description: 'A welcoming platform for everyone, regardless of background.'
    }
  ]

 const team = [
    { name: 'Sanit Prakash', role: 'CEO & Co-founder', bio: 'Bangalore tech entrepreneur' },
    { name: 'Prakash N', role: 'CTO & Co-founder', bio: 'Karnataka-based engineer' },
    { name: 'Kalyani Prakash', role: 'Head of Trust & Safety', bio: '10+ years in Karnataka property' },
    { name: 'Sandy Sprash', role: 'Head of Design', bio: 'Award-winning UX designer' }
  ]
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4" variant="secondary">About Us</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Making Room Hunting <span className="text-gradient">Human Again</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to transform how people find rooms and flatmates. 
              No more endless scrolling, scams, or mismatched living situations.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                RoomieX was born from frustration. Our founders spent months searching for rooms in London, 
                dealing with fake listings, unresponsive landlords, and flatmates who turned out to be 
                completely incompatible.
              </p>
              <p className="text-muted-foreground mb-4">
                We knew there had to be a better way. So we built it. Using AI to match compatible 
                flatmates, verification systems to ensure trust, and trial stays to let you experience 
                a home before committing.
              </p>
              <p className="text-muted-foreground">
                Today, RoomieX has helped thousands of people find their perfect living situation. 
                We're just getting started.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Meet the Team</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <Card key={index}>
                  <CardContent className="pt-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                    <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold">50K+</p>
                <p className="text-primary-foreground/80">Happy Users</p>
              </div>
              <div>
                <p className="text-4xl font-bold">10K+</p>
                <p className="text-primary-foreground/80">Verified Rooms</p>
              </div>
              <div>
                <p className="text-4xl font-bold">95%</p>
                <p className="text-primary-foreground/80">Match Success</p>
              </div>
              <div>
                <p className="text-4xl font-bold">20+</p>
                <p className="text-primary-foreground/80">Cities</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}