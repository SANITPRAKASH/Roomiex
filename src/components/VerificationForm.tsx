import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Upload, FileText, User, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface VerificationData {
  fullName: string;
  idType: string;
  idNumber: string;
  propertyAddress: string;
  ownershipType: string;
  idDocument: File | null;
  ownershipDocument: File | null;
  utilityBill: File | null;
  propertyPhotos: File[];
  additionalNotes: string;
}

export function VerificationForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<VerificationData>({
    fullName: "",
    idType: "",
    idNumber: "",
    propertyAddress: "",
    ownershipType: "",
    idDocument: null,
    ownershipDocument: null,
    utilityBill: null,
    propertyPhotos: [],
    additionalNotes: ""
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleFileChange = (field: keyof VerificationData, files: FileList | null) => {
    if (!files) return;
    if (field === "propertyPhotos") {
      setData(prev => ({ ...prev, propertyPhotos: Array.from(files) }));
    } else {
      setData(prev => ({ ...prev, [field]: files[0] }));
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.fullName && data.idType && data.idNumber;
      case 2:
        return data.propertyAddress && data.ownershipType;
      case 3:
        return data.idDocument && data.ownershipDocument;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to submit verification");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call - in production, this would upload to storage and save to DB
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Verification request submitted! We'll review within 24-48 hours.");
    navigate("/");
    setIsSubmitting(false);
  };

  const stepTitles = [
    { title: "Personal Info", icon: User },
    { title: "Property Details", icon: FileText },
    { title: "Upload Documents", icon: Upload },
    { title: "Review & Submit", icon: CheckCircle }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {stepTitles.map((s, i) => (
            <div 
              key={i} 
              className={`flex flex-col items-center ${i + 1 <= step ? "text-emerald-600" : "text-slate-400"}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                i + 1 < step ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-md" : 
                i + 1 === step ? "border-2 border-emerald-600 bg-emerald-50" : 
                "border-2 border-slate-200 bg-white"
              }`}>
                {i + 1 < step ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className="text-xs hidden sm:block font-medium">{s.title}</span>
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2 bg-slate-100" />
      </div>

      <Card className="border-slate-200 shadow-md">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
          <CardTitle className="text-slate-900">{stepTitles[step - 1].title}</CardTitle>
          <CardDescription className="text-slate-600">
            {step === 1 && "Enter your personal information for identity verification"}
            {step === 2 && "Provide details about the property you want to verify"}
            {step === 3 && "Upload the required documents"}
            {step === 4 && "Review your information and submit"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-700 font-medium">Full Name (as on ID)</Label>
                <Input 
                  id="fullName" 
                  value={data.fullName}
                  onChange={(e) => setData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter your full legal name"
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idType" className="text-slate-700 font-medium">ID Type</Label>
                <Select value={data.idType} onValueChange={(v) => setData(prev => ({ ...prev, idType: v }))}>
                  <SelectTrigger className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="driving_license">Driving License</SelectItem>
                    <SelectItem value="national_id">National ID Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="idNumber" className="text-slate-700 font-medium">ID Number</Label>
                <Input 
                  id="idNumber" 
                  value={data.idNumber}
                  onChange={(e) => setData(prev => ({ ...prev, idNumber: e.target.value }))}
                  placeholder="Enter your ID number"
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </>
          )}

          {/* Step 2: Property Details */}
          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="propertyAddress" className="text-slate-700 font-medium">Property Address</Label>
                <Textarea 
                  id="propertyAddress" 
                  value={data.propertyAddress}
                  onChange={(e) => setData(prev => ({ ...prev, propertyAddress: e.target.value }))}
                  placeholder="Enter the full property address"
                  rows={3}
                  className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownershipType" className="text-slate-700 font-medium">Ownership Type</Label>
                <Select value={data.ownershipType} onValueChange={(v) => setData(prev => ({ ...prev, ownershipType: v }))}>
                  <SelectTrigger className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500">
                    <SelectValue placeholder="Select ownership type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Property Owner</SelectItem>
                    <SelectItem value="tenant">Tenant (with subletting rights)</SelectItem>
                    <SelectItem value="agent">Property Agent</SelectItem>
                    <SelectItem value="manager">Property Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Step 3: Document Upload */}
          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Government ID</Label>
                <div className="border-2 border-dashed border-slate-200 hover:border-emerald-300 rounded-lg p-6 text-center transition-colors bg-slate-50/50">
                  <Input 
                    type="file" 
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange("idDocument", e.target.files)}
                    className="hidden"
                    id="idDocument"
                  />
                  <label htmlFor="idDocument" className="cursor-pointer">
                    {data.idDocument ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">{data.idDocument.name}</span>
                      </div>
                    ) : (
                      <div className="text-slate-500">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                        <p className="font-medium text-slate-700">Click to upload ID document</p>
                        <p className="text-xs mt-1">PNG, JPG or PDF up to 10MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Proof of Ownership/Authorization</Label>
                <div className="border-2 border-dashed border-slate-200 hover:border-emerald-300 rounded-lg p-6 text-center transition-colors bg-slate-50/50">
                  <Input 
                    type="file" 
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange("ownershipDocument", e.target.files)}
                    className="hidden"
                    id="ownershipDocument"
                  />
                  <label htmlFor="ownershipDocument" className="cursor-pointer">
                    {data.ownershipDocument ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">{data.ownershipDocument.name}</span>
                      </div>
                    ) : (
                      <div className="text-slate-500">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                        <p className="font-medium text-slate-700">Click to upload ownership document</p>
                        <p className="text-xs mt-1">Property deed, rental agreement, etc.</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Utility Bill <span className="text-slate-400 font-normal">(Optional)</span></Label>
                <div className="border-2 border-dashed border-slate-200 hover:border-emerald-300 rounded-lg p-6 text-center transition-colors bg-slate-50/50">
                  <Input 
                    type="file" 
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange("utilityBill", e.target.files)}
                    className="hidden"
                    id="utilityBill"
                  />
                  <label htmlFor="utilityBill" className="cursor-pointer">
                    {data.utilityBill ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">{data.utilityBill.name}</span>
                      </div>
                    ) : (
                      <div className="text-slate-500">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                        <p className="font-medium text-slate-700">Click to upload utility bill</p>
                        <p className="text-xs mt-1">Recent bill matching property address</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Full Name</p>
                    <p className="font-medium text-slate-900">{data.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">ID Type</p>
                    <p className="font-medium text-slate-900 capitalize">{data.idType?.replace("_", " ")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">ID Number</p>
                    <p className="font-medium text-slate-900">{data.idNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Ownership Type</p>
                    <p className="font-medium text-slate-900 capitalize">{data.ownershipType}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Property Address</p>
                  <p className="font-medium text-slate-900">{data.propertyAddress}</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <p className="text-sm text-slate-500 mb-3">Uploaded Documents</p>
                  <div className="space-y-2">
                    {data.idDocument && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-slate-700">ID Document: {data.idDocument.name}</span>
                      </div>
                    )}
                    {data.ownershipDocument && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-slate-700">Ownership Document: {data.ownershipDocument.name}</span>
                      </div>
                    )}
                    {data.utilityBill && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-slate-700">Utility Bill: {data.utilityBill.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes" className="text-slate-700 font-medium">Additional Notes <span className="text-slate-400 font-normal">(Optional)</span></Label>
                  <Textarea 
                    id="additionalNotes" 
                    value={data.additionalNotes}
                    onChange={(e) => setData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    placeholder="Any additional information you'd like to provide"
                    rows={3}
                    className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="border-slate-300 hover:bg-slate-50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}
            
            {step < totalSteps ? (
              <Button 
                onClick={() => setStep(step + 1)} 
                disabled={!canProceed()}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Verification"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}