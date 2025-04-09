
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { compareOffers } from "@/utils/compareOffers";
import JobOfferForm from "@/components/JobOfferForm";
import ResultDisplay from "@/components/ResultDisplay";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultText, setResultText] = useState("");
  
  const [offer1, setOffer1] = useState({
    state: "",
    salary: "",
  });
  
  const [offer2, setOffer2] = useState({
    state: "",
    salary: "",
  });

  const validateOffers = () => {
    if (!offer1.state || !offer1.salary) {
      toast({
        title: "Missing information",
        description: "Please complete both fields for Job Offer 1",
        variant: "destructive",
      });
      return false;
    }
    
    if (!offer2.state || !offer2.salary) {
      toast({
        title: "Missing information",
        description: "Please complete both fields for Job Offer 2",
        variant: "destructive",
      });
      return false;
    }
    
    // Make sure the states are different
    if (offer1.state === offer2.state) {
      toast({
        title: "Same state detected",
        description: "Please select different states for the two job offers",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleCompare = () => {
    if (!validateOffers()) return;
    
    setIsAnalyzing(true);
    
    // Simulate processing delay for better UX
    setTimeout(() => {
      const result = compareOffers(offer1, offer2);
      setResultText(result);
      setStep(2);
      setIsAnalyzing(false);
    }, 1500);
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
    
    setResultText("");
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3 text-white">Job Offer Comparison</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Compare weekly salaries between two different states and get a detailed analysis to help with your decision.
          </p>
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
              />
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleCompare} 
                disabled={isAnalyzing}
                className="bg-white hover:bg-gray-200 text-black py-2 px-10 rounded-md text-base font-medium"
              >
                {isAnalyzing ? "Analyzing..." : "Compare Offers"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <JobOfferForm 
                index={1} 
                formData={offer1} 
                setFormData={setOffer1} 
                disabled={true}
              />
              <JobOfferForm 
                index={2} 
                formData={offer2} 
                setFormData={setOffer2} 
                disabled={true}
              />
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
