import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, Star, Home, FileCheck, Camera, Clock, Sparkles } from "lucide-react";
import { VerificationForm } from "@/components/VerificationForm";

export default function Verification() {
  const [showForm, setShowForm] = useState(false);

  const benefits = [
    {
      icon: Star,
      title: "Verified Badge",
      description: "Stand out with a trust badge on all your listings"
    },
    {
      icon: Shield,
      title: "Higher Trust",
      description: "Tenants are 3x more likely to book verified listings"
    },
    {
      icon: Home,
      title: "Priority Placement",
      description: "Verified listings appear higher in search results"
    }
  ];

  const steps = [
    {
      icon: FileCheck,
      title: "Submit Documents",
      description: "Upload proof of ownership or authorization to rent"
    },
    {
      icon: Camera,
      title: "Photo Verification",
      description: "Our team verifies photos match the actual property"
    },
    {
      icon: Clock,
      title: "Quick Review",
      description: "Most verifications completed within 24-48 hours"
    }
  ];

  if (showForm) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-colors px-3 py-1">
                <Sparkles className="w-3 h-3 mr-1 inline-block" />
                Verification
              </Badge>
              <h1 className="text-3xl font-bold mb-2 text-slate-900">Property Verification</h1>
              <p className="text-slate-600">Complete the steps below to verify your property</p>
            </div>
            <VerificationForm />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100 via-white to-transparent opacity-70"></div>
          <div className="container mx-auto px-4 text-center relative">
            <Badge className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 transition-colors px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1 inline-block" />
              Verification
              </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Get <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Verified</span> Today
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
              Build trust with potential tenants and increase your booking rate by becoming a verified owner.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all" onClick={() => setShowForm(true)}>
              Start Verification
            </Button>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Why Get Verified?</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <benefit.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <CardTitle className="text-lg text-slate-900">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600">{benefit.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Verification Process</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-md flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-slate-900">What You'll Need</h2>
              <Card className="border-slate-200 shadow-md">
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    {[
                      "Government-issued ID (passport or driving license)",
                      "Proof of property ownership or rental agreement",
                      "Recent utility bill matching the property address",
                      "Clear photos of all rooms in your listing"
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-slate-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <div className="text-center mt-8">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all" onClick={() => setShowForm(true)}>
                  Start Verification Now
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}