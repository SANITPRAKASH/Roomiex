import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  X,
  ChevronRight,
  ChevronLeft,
  MapPin,
  DollarSign,
  Home,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { uploadMultipleImagesToS3 } from "@/lib/s3";
import { analyzeRoomWithAI, type RoomAnalysis } from "@/lib/ai";
import { toast } from "sonner";

const AMENITIES = [
  "WiFi",
  "AC",
  "Furnished",
  "Parking",
  "Balcony",
  "Kitchen",
  "Washing Machine",
  "Gym",
  "Power Backup",
];

const ROOM_TYPES = ["Private Room", "Shared Room", "PG", "Studio"];
const MINIMUM_STAYS = [
  "No minimum",
  "1 month",
  "3 months",
  "6 months",
  "12 months",
];

const steps = [
  { id: 1, title: "Photos", icon: ImageIcon },
  { id: 2, title: "Details", icon: Home },
  { id: 3, title: "Pricing", icon: DollarSign },
  { id: 4, title: "AI Score", icon: Sparkles },
];

interface CategoryScoreCardProps {
  label: string;
  score: number;
  feedback: string;
}

function CategoryScoreCard({ label, score, feedback }: CategoryScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-secondary dark:text-secondary";
    if (score >= 7) return "text-primary";
    return "text-red-500";
  };

  return (
    <div className="bg-muted/40 rounded-xl p-5 hover:bg-muted/60 transition-all group cursor-pointer border border-transparent hover:border-primary/20">
      <div className="mb-3">
        <h4 className="text-sm font-medium text-muted-foreground tracking-wide mb-1">
          {label}
        </h4>
        <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
          {score}
          <span className="text-lg text-muted-foreground">/10</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-100 transition-all duration-500 overflow-hidden">
        {feedback}
      </p>
      <p className="text-xs text-muted-foreground/60 mt-2 italic">
        Hover to see feedback
      </p>
    </div>
  );
}

export default function ListRoom() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    billsIncluded: false,
    roomType: "Private Room",
    availableFrom: "",
    minimumStay: "No minimum",
    amenities: [] as string[],
    photos: [] as File[],
    photoPreviews: [] as string[],
    aiScore: null as number | null,
    aiAnalysis: null as RoomAnalysis | null,
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.photos.length > 6) {
      toast.error("Maximum 6 photos allowed", {
        description: "You can upload up to 6 photos per listing",
      });
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
      photoPreviews: [...prev.photoPreviews, ...newPreviews],
    }));
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(formData.photoPreviews[index]);
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
      photoPreviews: prev.photoPreviews.filter((_, i) => i !== index),
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const analyzeRoom = async () => {
    if (formData.photos.length === 0) {
      toast.warning("Please upload at least one photo", {
        description: "A photo is required for AI analysis",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeRoomWithAI(formData.photos[0]);
      setFormData((prev) => ({
        ...prev,
        aiScore: analysis.overallScore,
        aiAnalysis: analysis,
      }));
      toast.success("Room analyzed successfully!", {
        description: `Quality score: ${analysis.overallScore.toFixed(1)}/10`,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze room", {
        description: "Please try again or contact support",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const publishListing = async () => {
    if (!user) {
      toast.error("Please sign in to publish your listing", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/auth"),
        },
      });
      return;
    }

    setIsPublishing(true);
    try {
      // Upload photos to S3
      const photoUrls = await uploadMultipleImagesToS3(
        formData.photos,
        "rooms"
      );

      // Convert room type to DB format
      const roomTypeMap: Record<string, string> = {
        "Private Room": "private",
        "Shared Room": "shared",
        PG: "pg",
        Studio: "private",
      };

      const { error } = await supabase.from("room_listings").insert({
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: Number(formData.price),
        bills_included: formData.billsIncluded,
        room_type: roomTypeMap[formData.roomType] || "private",
        available_from: formData.availableFrom || null,
        minimum_stay: formData.minimumStay,
        amenities: formData.amenities,
        photos: photoUrls,
        ai_score: formData.aiScore,
        ai_analysis: formData.aiAnalysis as any,
        status: "published",
      });

      if (error) throw error;

      setIsPublished(true);
      toast.success("Room listed successfully!", {
        description: "Your listing is now live and visible to renters",
      });
    } catch (error) {
      console.error("Publish error:", error);
      toast.error("Failed to publish listing", {
        description: "Please try again or contact support",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.photos.length > 0;
      case 2:
        return formData.title && formData.location;
      case 3:
        return formData.price && parseFloat(formData.price) > 0;
      case 4:
        return formData.aiScore !== null;
      default:
        return false;
    }
  };

  if (isPublished) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="container mx-auto max-w-2xl text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Room Listed Successfully!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your room is now live and visible to potential flatmates.
            </p>
            <Button onClick={() => navigate("/profile")}>
              View My Listings
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">List Your Room</h1>
            <p className="text-muted-foreground">
              Fill in the details and get an AI quality score
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                    currentStep >= step.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span
                  className={`ml-2 text-sm font-medium hidden sm:block ${
                    currentStep >= step.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 mx-2 ${
                      currentStep > step.id ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Photos */}
            {currentStep === 1 && (
              <motion.div
                key="photos"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Add Photos</h2>
                  <p className="text-muted-foreground">
                    Upload up to 6 photos. The first photo will be analyzed by AI.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {formData.photoPreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <img
                        src={preview}
                        alt={`Room ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <Badge
                          className="absolute bottom-2 left-2"
                          variant="secondary"
                        >
                          Main Photo
                        </Badge>
                      )}
                    </div>
                  ))}

                  {formData.photos.length < 6 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        Add Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Room Details</h2>
                  <p className="text-muted-foreground">Tell us about your room</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Cozy room in Koramangala"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your room..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="location"
                        className="pl-10"
                        placeholder="e.g., Koramangala, Bangalore"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Room Type</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {ROOM_TYPES.map((type) => (
                        <Button
                          key={type}
                          type="button"
                          variant={
                            formData.roomType === type ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, roomType: type }))
                          }
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Amenities</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {AMENITIES.map((amenity) => (
                        <Button
                          key={amenity}
                          type="button"
                          variant={
                            formData.amenities.includes(amenity)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => toggleAmenity(amenity)}
                        >
                          {amenity}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Pricing */}
            {currentStep === 3 && (
              <motion.div
                key="pricing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">Set Your Price</h2>
                  <p className="text-muted-foreground">
                    Monthly rent and availability
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="price">Monthly Rent (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="12000"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="available">Available From</Label>
                    <Input
                      id="available"
                      type="date"
                      value={formData.availableFrom}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          availableFrom: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label>Minimum Stay</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {MINIMUM_STAYS.map((stay) => (
                        <Button
                          key={stay}
                          type="button"
                          variant={
                            formData.minimumStay === stay ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              minimumStay: stay,
                            }))
                          }
                        >
                          {stay}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: AI Score */}
            {currentStep === 4 && (
              <motion.div
                key="ai-score"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    Get AI Quality Score
                  </h2>
                  <p className="text-muted-foreground">
                    Our AI will analyze your room photos and provide a quality score.
                  </p>
                </div>

                {formData.aiScore === null ? (
                  <div className="text-center py-12">
                    <div className="w-48 h-48 rounded-2xl overflow-hidden mx-auto mb-8 shadow-lg">
                      <img
                        src={formData.photoPreviews[0]}
                        alt="Room"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      onClick={analyzeRoom}
                      disabled={isAnalyzing}
                      size="lg"
                      className="min-w-[200px]"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Analyze Room
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-6">
                      <div className="relative">
                        <svg className="w-48 h-48 transform -rotate-90">
                          <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="none"
                            className="text-muted/30"
                          />
                          <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="10"
                            fill="none"
                            strokeDasharray={`${(formData.aiScore / 10) * 553} 553`}
                            strokeLinecap="round"
                            className="text-primary transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-6xl font-bold text-foreground">
                              {formData.aiScore.toFixed(1)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="max-w-md text-center md:text-left">
                        <h3 className="text-2xl text-neutral-700 font-bold mb-2">
                          Quality Score
                        </h3>
                        <p className="text-lg font-medium mb-3">
                          {formData.aiScore >= 9
                            ? "Excellent"
                            : formData.aiScore >= 8
                              ? "Very Good"
                              : formData.aiScore >= 7
                                ? "Good"
                                : "Needs Improvement"}
                        </p>
                        <p className="text-muted-foreground leading-relaxed">
                          {formData.aiAnalysis?.summary}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <CategoryScoreCard
                        label="Lighting"
                        score={formData.aiAnalysis?.lighting.score || 0}
                        feedback={formData.aiAnalysis?.lighting.feedback || ""}
                      />
                      <CategoryScoreCard
                        label="Cleanliness"
                        score={formData.aiAnalysis?.cleanliness.score || 0}
                        feedback={formData.aiAnalysis?.cleanliness.feedback || ""}
                      />
                      <CategoryScoreCard
                        label="Space"
                        score={formData.aiAnalysis?.space.score || 0}
                        feedback={formData.aiAnalysis?.space.feedback || ""}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <CategoryScoreCard
                        label="Ventilation"
                        score={formData.aiAnalysis?.ventilation.score || 0}
                        feedback={formData.aiAnalysis?.ventilation.feedback || ""}
                      />
                      <CategoryScoreCard
                        label="Furnishing"
                        score={formData.aiAnalysis?.furnishing.score || 0}
                        feedback={formData.aiAnalysis?.furnishing.feedback || ""}
                      />
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={publishListing}
                        disabled={isPublishing}
                        size="lg"
                        className="w-full h-14 text-lg"
                      >
                        {isPublishing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          "Publish Listing"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {currentStep < 4 && (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}