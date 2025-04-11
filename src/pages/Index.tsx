import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { compareOffers } from "@/utils/compareOffers";
import JobOfferForm from "@/components/JobOfferForm";
import ResultDisplay from "@/components/ResultDisplay";
import EmailCaptureForm from "@/components/EmailCaptureForm";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { X, FileDown } from "lucide-react";
import ComparisonToggle from "@/components/ComparisonToggle";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [isExporting, setIsExporting] = useState(false);
  
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
    
    setStep(2);
  };

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const validOffers = [];
      if (offer1.state && offer1.salary) validOffers.push(offer1);
      if (offer2.state && offer2.salary && visibleOffers >= 2) validOffers.push(offer2);
      if (offer3.state && offer3.salary && visibleOffers >= 3) validOffers.push(offer3);
      
      const result = compareOffers(validOffers, "", email);
      setResultText(JSON.stringify(result));
      setStep(3);
      setIsAnalyzing(false);
    }, 2000);
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
      setOffer2({
        state: "",
        salary: "",
      });
      setVisibleOffers(1);
    } else if (index === 3) {
      setOffer3({
        state: "",
        salary: "",
      });
      setVisibleOffers(2);
    }
  };

  const hasValidOffer = () => {
    return (offer1.state && offer1.salary) || 
           (offer2.state && offer2.salary && visibleOffers >= 2) || 
           (offer3.state && offer3.salary && visibleOffers >= 3);
  };

  const getPlaceholderText = () => {
    return compareMode === "cities" 
      ? "Type to search U.S. cities..." 
      : "Type to search U.S. states...";
  };

  const handleDownloadPDF = async () => {
    try {
      setIsExporting(true);
      toast({
        title: "Generating your PDF report...",
        duration: 2000,
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      const pdf = new jsPDF('p', 'mm', 'a4');
      
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Travel Nurse Contract Comparison Report", 20, 20);
      
      const img = new Image();
      img.src = "/lovable-uploads/90d7f47e-c8a6-4248-ab41-5ef50eb89b7c.png";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      pdf.addImage(img, 'PNG', 20, 25, 40, 15);
      
      const reportElement = document.getElementById('report-content');
      if (!reportElement) {
        throw new Error("Report element not found");
      }
      
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#FFFFFF"
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 45, pdfWidth - 20, pdfHeight);
      
      const today = new Date().toLocaleDateString();
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Report generated on ${today}`, 20, 285);
      pdf.text("Provided by Plovrr - Travel Nurse Take-Home Pay & Tax Estimator", 20, 290);
      
      pdf.save("travel-nurse-contract-report.pdf");
      
      toast({
        title: "PDF Report Downloaded",
        description: "Your detailed contract report has been downloaded",
        duration: 3000,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error generating PDF",
        description: "There was an error creating your PDF report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        {step === 1 && (
          <>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <img src="/lovable-uploads/90d7f47e-c8a6-4248-ab41-5ef50eb89b7c.png" alt="Plovrr Logo" className="h-12" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-black">
                Travel Nurse Take-Home Pay & Tax Estimator
              </h1>
              
              <p className="text-gray-600 max-w-2xl mx-auto mb-4 font-medium">
                See your real earnings after taxes, stipends, and cost of living — before you sign your next contract.
              </p>
            </div>

            <div className="space-y-8 mb-10">
              <div className="mb-6">
                <div className="text-center mb-2">
                  <h3 className="text-black mb-2 font-medium">Comparison Type</h3>
                </div>
                <ComparisonToggle 
                  checked={compareMode === "cities"}
                  onCheckedChange={handleModeChange}
                />
                <p className="text-gray-600 text-sm mt-2 text-center">
                  Switch between comparing contracts by state or by city.
                </p>
              </div>
            
              <JobOfferForm 
                index={1} 
                formData={offer1} 
                setFormData={setOffer1}
                placeholderText={getPlaceholderText()}
                compareMode={compareMode}
              />
              
              {visibleOffers >= 2 && (
                <div className="relative">
                  <JobOfferForm 
                    index={2} 
                    formData={offer2} 
                    setFormData={setOffer2}
                    placeholderText={getPlaceholderText()}
                    compareMode={compareMode}
                  />
                  <button 
                    onClick={() => removeOffer(2)}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
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
                    compareMode={compareMode}
                  />
                  <button 
                    onClick={() => removeOffer(3)}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
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
                    className="border border-gray-300 hover:bg-gray-50 text-black"
                  >
                    + Add Another Contract Destination (Compare up to 3)
                  </Button>
                </div>
              )}
              
              {visibleOffers === 3 && (
                <div className="text-center text-gray-600 text-sm">
                  You're all set! Compare up to 3 destinations below.
                </div>
              )}
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={handleCompare} 
                disabled={isAnalyzing || !hasValidOffer()}
                className="bg-white hover:bg-gray-50 text-black border border-black py-2 px-10 rounded-md text-base font-medium"
              >
                Compare Destinations
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="py-4">
            <div className="flex justify-center mb-6">
              <img src="/lovable-uploads/90d7f47e-c8a6-4248-ab41-5ef50eb89b7c.png" alt="Plovrr Logo" className="h-12" />
            </div>
            <EmailCaptureForm 
              onSubmit={handleEmailSubmit} 
              isLoading={isAnalyzing} 
            />
          </div>
        )}
        
        {step === 3 && (
          <>
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <img src="/lovable-uploads/90d7f47e-c8a6-4248-ab41-5ef50eb89b7c.png" alt="Plovrr Logo" className="h-12" />
              </div>
            </div>
            
            <ResultDisplay resultText={resultText} />
            
            <div className="flex justify-center mt-6 gap-4">
              <Button 
                onClick={handleReset}
                variant="outline"
                className="border border-gray-300 hover:bg-gray-50 text-black"
              >
                Start New Comparison
              </Button>
              
              <Button 
                onClick={handleDownloadPDF}
                variant="outline"
                className="border border-gray-300 hover:bg-gray-50 text-black"
                disabled={isExporting}
              >
                <FileDown className="mr-2 h-4 w-4" />
                {isExporting ? "Generating PDF..." : "Download Detailed Report"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
