// Terms.tsx
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Badge } from '@/components/ui/badge'
export function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Badge className="mb-4" variant="secondary">Legal</Badge>
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 1, 2025</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  By accessing or using RoomieX, you agree to be bound by these Terms of Service. If you do not 
                  agree to these terms, please do not use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground">
                  RoomieX is an online platform that connects people looking for rooms with room owners and 
                  facilitates flatmate matching. We do not own, manage, or control any properties listed on our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                <p className="text-muted-foreground mb-4">To use certain features, you must create an account. You agree to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Prohibited Conduct</h2>
                <p className="text-muted-foreground mb-4">You agree not to:</p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>Post false, misleading, or fraudulent content</li>
                  <li>Harass, threaten, or intimidate other users</li>
                  <li>Use the platform for illegal purposes</li>
                  <li>Attempt to circumvent our fees or payment systems</li>
                  <li>Interfere with the proper functioning of the platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Contact</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms of Service, contact us at legal@roomiex.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}