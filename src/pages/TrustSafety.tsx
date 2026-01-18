import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle,  UserCheck, Home, Lock, Eye, Flag } from "lucide-react";
import { Link } from "react-router-dom";

export default function TrustSafety() {
  const safetyFeatures = [
    {
      icon: UserCheck,
      title: "Verified Users",
      description: "All users can verify their identity through our secure verification process."
    },
    {
      icon: Home,
      title: "Verified Listings",
      description: "We verify property ownership and check that photos match the actual room."
    },
    {
      icon: Lock,
      title: "Secure Messaging",
      description: "All messages are encrypted and monitored for suspicious activity."
    },
    {
      icon: Eye,
      title: "Fraud Detection",
      description: "AI-powered systems detect and remove fraudulent listings in real-time."
    }
  ];

  const tips = [
    "Never pay deposits or rent before viewing a property in person",
    "Be wary of deals that seem too good to be true",
    "Always communicate through our platform to maintain a record",
    "Verify the landlord's identity before signing anything",
    "Report any suspicious behavior immediately"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-emerald-500/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4 bg-emerald-500/10 text-emerald-700 border-emerald-500/20">
              🛡️ Trust & Safety
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Safety is Our <span className="text-emerald-600">Priority</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We've built multiple layers of protection to ensure a safe and trustworthy experience for everyone.
            </p>
          </div>
        </section>

        {/* Safety Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How We Keep You Safe</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {safetyFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-emerald-500/50">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Safety Tips */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Safety Tips</h2>
              <Card className="border-2">
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    {tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Report Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
                <Flag className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Report a Problem</h2>
              <p className="text-muted-foreground mb-6">
                If you encounter suspicious activity, fraud, or any safety concerns, please report it immediately. 
                Our team investigates all reports within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                
                <Button size="lg" variant="outline" className="font-semibold">
                  <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact Support</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Community Guidelines</h2>
              <div className="space-y-4">
                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">Be Honest</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Provide accurate information in your profile and listings. Misrepresentation 
                      undermines trust and may result in account suspension.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">Be Respectful</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Treat all users with respect. Discrimination, harassment, or abusive behavior 
                      will not be tolerated.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">Be Responsive</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Reply to messages promptly and honor your commitments. Good communication 
                      builds trust in our community.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}