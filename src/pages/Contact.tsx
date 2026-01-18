import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setLoading(false);
    }, 1000);
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "hello@roomiex.com" },
    { icon: Phone, label: "Phone", value: "+91 8050 4057 97" },
    { icon: MapPin, label: "Address", value: "Basaveshwara Nagar, Bangalore 560079" },
    { icon: Clock, label: "Hours", value: "Mon-Fri 9am-6pm IST" },
  ];

  const faqs = [
    {
      question: "How does RoomieX work?",
      answer:
        "RoomieX connects room seekers with property owners. You can browse verified listings, use our AI-powered matching to find compatible flatmates, and communicate securely through our platform. Simply create an account, complete your profile, and start your search!",
    },
    {
      question: "Is RoomieX free to use?",
      answer:
        "Yes! Browsing rooms and creating a profile is completely free. We only charge a small service fee when you successfully book a room through our platform.",
    },
    {
      question: "How does the AI matching work?",
      answer:
        "Our AI analyzes your preferences, lifestyle habits, work schedule, and interests to match you with compatible flatmates. The compatibility score helps you find people you'll actually enjoy living with, not just a room to rent.",
    },
    {
      question: "Are the listings verified?",
      answer:
        "We verify property owners and encourage listing verification. Verified listings have a badge and our AI Quality Score rates each room based on photos, amenities, and location to help you make informed decisions.",
    },
    {
      question: "Can I schedule a room viewing?",
      answer:
        "Absolutely! Once you find a room you like, you can directly schedule a viewing or even book a trial stay through our platform. All communications remain secure and anonymous until you choose to share your details.",
    },
    {
      question: "What if I need to cancel my booking?",
      answer:
        "You can manage your bookings from your dashboard. Cancellation policies vary by property owner, but we encourage flexible arrangements. Contact the owner through our chat system to discuss any changes.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-20 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              Contact
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have a question or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left Column - Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" rows={5} required />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                  <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4 text-center space-y-2">
                    <p className="font-medium">Thanks for reaching out! 💌</p>
                    <p className="text-sm text-muted-foreground">
                      Our team usually replies within{" "}
                      <span className="font-medium">24 hours</span>. In the
                      meantime, feel free to explore rooms or check your AI
                      match score.
                    </p>
                    <div className="flex justify-center gap-4 pt-2">
                      <Link
                        to="/profile"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Browse Rooms
                      </Link>
                      <span className="text-muted-foreground">•</span>
                      <Link
                        to="/room-scorer"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        AI Room Scorer
                      </Link>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Right Column - Contact Info & FAQ */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="font-semibold">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="border-b border-border last:border-0 pb-4 last:pb-0"
                      >
                        <button
                          onClick={() =>
                            setOpenFaq(openFaq === index ? null : index)
                          }
                          className="w-full flex items-center justify-between text-left group"
                        >
                          <span className="font-medium text-primary  group-hover:text-primary/80 underline transition-colors pr-4">
                            {faq.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                              openFaq === index ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            openFaq === index
                              ? "max-h-96 opacity-100 mt-3"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
