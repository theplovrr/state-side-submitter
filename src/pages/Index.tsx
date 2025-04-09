import { useState } from "react";
import { Button } from "@/components/ui/button";
import { compareOffers } from "@/utils/compareOffers";
import JobOfferForm from "@/components/JobOfferForm";
import ResultDisplay from "@/components/ResultDisplay";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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

const Index = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultText, setResultText] = useState("");
  const [homeState, setHomeState] = useState("");
  
  const form = useForm();
  
  const [offer1, setOffer1] = useState({
    state: "",
    salary: "",
  });
  
  const [offer2, setOffer2] = useState({
    state: "",
    salary: "",
  });

  const validateOffers = () => {
    if (!homeState) {
      toast({
        title: "Missing information",
        description: "Please select your home state",
        variant: "destructive",
      });
      return false;
    }
    
    const offer1Valid = offer1.state && offer1.salary;
    const offer2Valid = offer2.state && offer2.salary;
    
    if (!offer1Valid && !offer2Valid) {
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
    
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const result = compareOffers(offer1, offer2, homeState);
      setResultText(JSON.stringify(result));
      setStep(2);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleReset = () => {
    setHomeState("");
    setOffer1({
      state: "",
      salary: "",
    });
    
    setOffer2({
      state: "",
      salary: "",
    });
    
    setResultText("");
    setStep(1);
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
              <span className={step === 2 ? "font-bold text-white" : ""}>Step 2: See Your Results</span>
            </div>
            <Progress value={step === 1 ? 50 : 100} className="h-2" />
          </div>
          
          {step === 1 && (
            <div className="max-w-md mx-auto mb-8">
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="homeState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium text-base">Home State</FormLabel>
                      <Select
                        value={homeState}
                        onValueChange={setHomeState}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-700 bg-gray-900 text-white focus:border-white focus:ring-white">
                            <SelectValue placeholder="Select your home state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black border-gray-700 text-white">
                          {states.map((state) => (
                            <SelectItem key={state} value={state} className="focus:bg-gray-800 focus:text-white">
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-400 text-sm">
                        We'll adjust your taxes based on your home state.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </Form>
            </div>
          )}
        </div>

        {step === 1 ? (
          <>
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <JobOfferForm 
                index={1} 
                formData={offer1} 
                setFormData={setOffer1} 
              />
              <JobOfferForm 
                index={2} 
                formData={offer2} 
                setFormData={setOffer2} 
                optional={true}
              />
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleCompare} 
                disabled={isAnalyzing}
                className="bg-white hover:bg-gray-200 text-black py-2 px-10 rounded-md text-base font-medium"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Contracts"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-black border border-gray-800 rounded-lg p-4 mb-8">
              <p className="text-white"><strong>Home State:</strong> {homeState}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {offer1.state && offer1.salary && (
                <JobOfferForm 
                  index={1} 
                  formData={offer1} 
                  setFormData={setOffer1} 
                  disabled={true}
                />
              )}
              {offer2.state && offer2.salary && (
                <JobOfferForm 
                  index={2} 
                  formData={offer2} 
                  setFormData={setOffer2} 
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
