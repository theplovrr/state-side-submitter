
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { compareOffers } from "@/utils/compareOffers";
import JobOfferForm from "@/components/JobOfferForm";
import ResultDisplay from "@/components/ResultDisplay";
import EmailCaptureForm from "@/components/EmailCaptureForm";
import { useToast } from "@/components/ui/use-toast";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormDescription
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import TypeaheadInput from "@/components/TypeaheadInput";
import { X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
  "New Hampshire", "New Jersey", "New Mexico", "New York", 
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
  "West Virginia", "Wisconsin", "Wyoming"
];

// Example cities for autocomplete
const majorCities = [
  "New York City", "Los Angeles", "Chicago", "Houston", "Phoenix", 
  "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
  "Austin", "Jacksonville", "Fort Worth", "Columbus", "Indianapolis",
  "Charlotte", "San Francisco", "Seattle", "Denver", "Washington DC",
  "Boston", "El Paso", "Nashville", "Detroit", "Portland",
  "Las Vegas", "Oklahoma City", "Memphis", "Louisville", "Baltimore",
  "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento",
  "Kansas City", "Long Beach", "Mesa", "Atlanta", "Colorado Springs",
  "Raleigh", "Omaha", "Miami", "Tampa", "Minneapolis",
  "New Orleans", "Cleveland", "Honolulu", "Arlington", "Bakersfield"
];

// Combined locations with type indicators
const locations = [
  ...states.map(state => ({ name: state, type: "state" })),
  ...majorCities.map(city => ({ name: city, type: "city" }))
];

const Index = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultText, setResultText] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [visibleOffers, setVisibleOffers] = useState(1); // Track number of visible offers
  const [compareMode, setCompareMode] = useState("states"); // "states" or "cities"
  
  const form = useForm();
  
  const [offer1, setOffer1] = useState({
    state: "",
    salary: "",
  });
  
  const [offer2, setOffer2] = useState({
    state: "",
    salary: "",
  });
  
  const [offer3, setOffer3] = useState({
    state: "",
    salary: "",
  });

  const handleModeChange = (checked: boolean) => {
    const newMode = checked ? "cities" : "states";
    setCompareMode(newMode);
    
    // Optional: clear inputs when changing modes to avoid confusion
    setOffer1({
      state: "",
      salary: "",
    });
    
    setOffer2({
      state: "",
      salary: "",
    });
    
    setOffer3({
      state: "",
      salary: "",
    });
  };

  const validateOffers = () => {
    const validOffers = [offer1, offer2, offer3].slice(0, visibleOffers).filter(
      offer => offer.state && offer.salary
    );
    
    if (validOffers.length === 0) {
      toast({
        title: "Missing information",
        description: "Please complete at least one travel contract destination",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleCompare = () => {
    if (!validateOffers()) return;
    
    // Move to email capture step
    setStep(2);
  };

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      // Gather all valid offers
      const validOffers = [];
      if (offer1.state && offer1.salary) validOffers.push(offer1);
      if (offer2.state && offer2.salary && visibleOffers >= 2) validOffers.push(offer2);
      if (offer3.state && offer3.salary && visibleOffers >= 3) validOffers.push(offer3);
      
      // Use empty string for homeState since we're not collecting it in the MVP
      const result = compareOffers(validOffers, "", email);
      setResultText(JSON.stringify(result));
      setStep(3);
      setIsAnalyzing(false);
    }, 2000); // 2 second delay for better UX
  };

  const handleReset = () => {
    setOffer1({
      state: "",
      salary: "",
    });
    
    setOffer2({
      state: "",
      salary: "",
    });
    
    setOffer3({
      state: "",
      salary: "",
    });
    
    setVisibleOffers(1);
    setResultText("");
    setUserEmail("");
    setStep(1);
    setCompareMode("states");
  };

  const addAnotherOffer = () => {
    if (visibleOffers < 3) {
      setVisibleOffers(visibleOffers + 1);
    }
  };

  const removeOffer = (index: number) => {
    if (index === 2) {
      // Reset offer 2
      setOffer2({
        state: "",
        salary: "",
      });
      setVisibleOffers(1);
    } else if (index === 3) {
      // Reset offer 3
      setOffer3({
        state: "",
        salary: "",
      });
      setVisibleOffers(2);
    }
  };

  const getProgressValue = () => {
    if (step === 1) return 33;
    if (step === 2) return 66;
    return 100;
  };

  // Check if any offer has valid data
  const hasValidOffer = () => {
    return (offer1.state && offer1.salary) || 
           (offer2.state && offer2.salary && visibleOffers >= 2) || 
           (offer3.state && offer3.salary && visibleOffers >= 3);
  };

  // Get the appropriate placeholder text based on the compare mode
  const getPlaceholderText = () => {
    return compareMode === "states" 
      ? "Type to search U.S. states..." 
      : "Type to search U.S. cities...";
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <img src="/plovrr-logo.png" alt="Plovrr Logo" className="h-16" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-white">
            Plovrr: Travel Nurse Take-Home Pay & Tax Estimator
          </h1>
          
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            See your real earnings after taxes, stipends, and cost of living — before you sign your next contract.
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span className={step === 1 ? "font-bold text-white" : ""}>Step 1: Enter Contracts</span>
              <span className={step === 2 ? "font-bold text-white" : ""}>Step 2: Verify Email</span>
              <span className={step === 3 ? "font-bold text-white" : ""}>Step 3: See Results</span>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
          </div>
        </div>

        {step === 1 && (
          <>
            <div className="space-y-8 mb-10">
              {/* Toggle switch for compare mode */}
              <div className="flex flex-col items-center space-y-2 mb-6">
                <div className="text-center">
                  <h3 className="text-white mb-2">Comparison Type</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${compareMode === 'states' ? 'text-white font-medium' : 'text-gray-400'}`}>
                      Compare States
                    </span>
                    <Switch 
                      checked={compareMode === "cities"}
                      onCheckedChange={handleModeChange}
                      className="mx-2"
                    />
                    <span className={`text-sm ${compareMode === 'cities' ? 'text-white font-medium' : 'text-gray-400'}`}>
                      Compare Cities
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    Switch between comparing contracts by state or by city.
                  </p>
                </div>
              </div>
            
              <JobOfferForm 
                index={1} 
                formData={offer1} 
                setFormData={setOffer1}
                placeholderText={getPlaceholderText()}
              />
              
              {visibleOffers >= 2 && (
                <div className="relative">
                  <JobOfferForm 
                    index={2} 
                    formData={offer2} 
                    setFormData={setOffer2}
                    placeholderText={getPlaceholderText()} 
                  />
                  <button 
                    onClick={() => removeOffer(2)}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    aria-label="Remove destination 2"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              
              {visibleOffers >= 3 && (
                <div className="relative">
                  <JobOfferForm 
                    index={3} 
                    formData={offer3} 
                    setFormData={setOffer3}
                    placeholderText={getPlaceholderText()}
                  />
                  <button 
                    onClick={() => removeOffer(3)}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    aria-label="Remove destination 3"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              
              {visibleOffers < 3 && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={addAnotherOffer}
                    className="border-gray-700 hover:bg-gray-800 text-white"
                  >
                    + Add Another Contract Destination (Compare up to 3)
                  </Button>
                </div>
              )}
              
              {visibleOffers === 3 && (
                <div className="text-center text-gray-400 text-sm">
                  You're all set! Compare up to 3 destinations below.
                </div>
              )}
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleCompare} 
                disabled={isAnalyzing || !hasValidOffer()}
                className="bg-white hover:bg-gray-200 text-black py-2 px-10 rounded-md text-base font-medium"
              >
                Compare Destinations
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <EmailCaptureForm 
            onSubmit={handleEmailSubmit} 
            isLoading={isAnalyzing} 
          />
        )}
        
        {step === 3 && (
          <>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {offer1.state && offer1.salary && (
                <JobOfferForm 
                  index={1} 
                  formData={offer1} 
                  setFormData={setOffer1} 
                  disabled={true}
                />
              )}
              {offer2.state && offer2.salary && visibleOffers >= 2 && (
                <JobOfferForm 
                  index={2} 
                  formData={offer2} 
                  setFormData={setOffer2} 
                  disabled={true}
                />
              )}
              {offer3.state && offer3.salary && visibleOffers >= 3 && (
                <JobOfferForm 
                  index={3} 
                  formData={offer3} 
                  setFormData={setOffer3} 
                  disabled={true}
                />
              )}
            </div>
            
            <ResultDisplay resultText={resultText} />
            
            <div className="flex justify-center mt-8">
              <Button 
                onClick={handleReset}
                variant="outline"
                className="border-gray-700 hover:bg-gray-800 text-white"
              >
                Start New Comparison
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
