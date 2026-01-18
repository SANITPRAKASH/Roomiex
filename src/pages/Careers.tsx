import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Coffee,
  Heart,
  Zap,
  Users,
  Upload,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export default function Careers() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const perks = [
    {
      icon: Coffee,
      title: "Flexible Working",
      description: "Work from anywhere or our office spaces",
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health coverage for you and family",
    },
    {
      icon: Zap,
      title: "Learning Budget",
      description: "Annual budget for courses and conferences",
    },
    {
      icon: Users,
      title: "Team Events",
      description: "Monthly team activities and annual retreats",
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        setSelectedFile(file);
      } else {
        toast.error("Please upload a PDF file");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !selectedFile) {
      toast.error("Please fill all fields and upload your resume");
      return;
    }

    setIsSubmitting(true);

    // Simulate upload
    setTimeout(() => {
      toast.success("Application submitted successfully!", {
        description: "We'll review your application and get back to you soon.",
      });
      setName("");
      setEmail("");
      setSelectedFile(null);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 text-center">
            <Badge className="mb-4" variant="secondary">
              Join Our Team
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Build the Future with{" "}
              <span className="text-gradient">RoomieX</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Help us transform how people find rooms and flatmates. We're
              looking for passionate individuals who want to make a difference.
            </p>
          </div>
        </section>

        {/* Why Join */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Join Us?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {perks.map((perk, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <perk.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{perk.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {perk.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Resume Upload */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Apply Now</h2>
                <p className="text-muted-foreground">
                  Share your resume with us.  If there’s a fit, we’ll reach out.
                  
                </p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="resume">Resume (PDF)</Label>
                      <div className="relative">
                        <Input
                          id="resume"
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="resume"
                          className="flex items-center justify-center gap-2 w-full p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                        >
                          {selectedFile ? (
                            <div className="flex items-center gap-3 text-foreground">
                              <FileText className="w-8 h-8 text-primary" />
                              <div className="text-left">
                                <p className="font-medium">
                                  {selectedFile.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                              <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm font-medium">
                                Click to upload your resume
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                PDF files only
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
