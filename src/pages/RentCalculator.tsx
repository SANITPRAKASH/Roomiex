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
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Calculator,
  IndianRupee,
  Lightbulb,
  Wifi,
  Droplets,
} from "lucide-react";
import { motion } from "framer-motion";

export default function RentCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [includeBills, setIncludeBills] = useState(true);
  const [location, setLocation] = useState("bangalore");

  const maxAffordableRent = Math.round(monthlyIncome * 0.35);
  const estimatedBills = includeBills ? 0 : 3500;
  const totalMonthly = maxAffordableRent + estimatedBills;

  const locationMultipliers: Record<string, number> = {
    koramangala: 1.3,
    indiranagar: 1.3,
    "hsr-layout": 1.2,
    whitefield: 1.2,
    "jp-nagar": 1.1,
    malleshwaram: 1.1,
    rajajinagar: 1.0,
    mysuru: 0.8,
    mangaluru: 0.85,
    hubballi: 0.75,
    other: 0.6,
  };

  const adjustedRent = Math.round(
    maxAffordableRent * (locationMultipliers[location] || 1),
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12 pt-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Rent <span className="text-gradient">Calculator</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find out how much rent you can comfortably afford based on your
              income and preferences.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Calculator Inputs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="card-elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    Your Details
                  </CardTitle>
                  <CardDescription>
                    Enter your income and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">
                      Monthly Income (after tax)
                    </Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={monthlyIncome}
                        onChange={(e) =>
                          setMonthlyIncome(Number(e.target.value))
                        }
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm text-muted-foreground">
                      Income: ₹{monthlyIncome.toLocaleString("en-IN")}/month
                    </Label>
                    <Slider
                      value={[monthlyIncome]}
                      onValueChange={([val]) => setMonthlyIncome(val)}
                      min={15000}
                      max={200000}
                      step={5000}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Location</Label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full h-12 px-3 rounded-md border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="koramangala">
                        Koramangala, Bangalore
                      </option>
                      <option value="indiranagar">
                        Indiranagar, Bangalore
                      </option>
                      <option value="hsr-layout">HSR Layout, Bangalore</option>
                      <option value="whitefield">Whitefield, Bangalore</option>
                      <option value="jp-nagar">JP Nagar, Bangalore</option>
                      <option value="malleshwaram">
                        Malleshwaram, Bangalore
                      </option>
                      <option value="rajajinagar">
                        Rajajinagar, Bangalore
                      </option>
                      <option value="mysuru">Mysuru</option>
                      <option value="mangaluru">Mangaluru</option>
                      <option value="hubballi">Hubballi–Dharwad</option>
                        <option value="other">Other Cities</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div className="space-y-0.5">
                      <Label className="text-base font-semibold">
                        Bills Included
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Looking for all-inclusive rent?
                      </p>
                    </div>
                    <Switch
                      checked={includeBills}
                      onCheckedChange={setIncludeBills}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Results */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 card-elevated">
                  <CardHeader>
                    <CardTitle>Your Budget</CardTitle>
                    <CardDescription>
                      Based on the 35% rule for comfortable living
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                      ₹{maxAffordableRent.toLocaleString("en-IN")}/mo
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Maximum recommended rent (35% of income)
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="card-elevated">
                  <CardHeader>
                    <CardTitle>Location Adjusted</CardTitle>
                    <CardDescription>
                      Average rent in{" "}
                      {location.charAt(0).toUpperCase() + location.slice(1)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-2">
                      ₹{adjustedRent.toLocaleString("en-IN")}/month
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Typical room rent in your selected area
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {!includeBills && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Card className="card-elevated">
                    <CardHeader>
                      <CardTitle>Estimated Bills</CardTitle>
                      <CardDescription>
                        Average monthly utility costs
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          <span>Electricity</span>
                        </div>
                        <span className="font-medium">~₹1,500/mo</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Wifi className="w-4 h-4 text-blue-500" />
                          <span>Internet</span>
                        </div>
                        <span className="font-medium">~₹1,000/mo</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-cyan-500" />
                          <span>Water & Maintenance</span>
                        </div>
                        <span className="font-medium">~₹1,000/mo</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between font-bold text-lg">
                        <span>Total Monthly Cost</span>
                        <span className="text-primary">
                          ₹{totalMonthly.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <motion.div
            className="max-w-5xl mx-auto mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>💡 Pro Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Keep rent under 35% of income for financial stability
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Factor in commute costs when choosing location</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>All-inclusive rent simplifies budgeting</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Save 3-6 months rent as emergency fund</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
