
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, HelpCircle, ChevronDown, ChevronUp, DollarSign, Home, Calculator, Briefcase, Building, MapPin, Wallet, BadgePercent, BadgeDollarSign, BadgeInfo } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const ResultDisplay = ({ resultText }) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  // Log resultText to debug API structure
  console.log("ResultText received:", resultText);

  // Parse the result text into structured data with safe handling
  const parseResult = () => {
    if (!resultText) {
      console.log("No result text provided");
      return null;
    }
    
    try {
      const parsed = JSON.parse(resultText);
      console.log("Successfully parsed result:", parsed);
      return parsed;
    } catch (e) {
      console.error("Error parsing result:", e);
      return null;
    }
  };

  const result = parseResult();

  // Get the winning offer (if any) with safe handling
  const getWinningOffer = () => {
    if (!result || !result.offers || !Array.isArray(result.offers) || result.offers.length === 0) return null;
    return result.offers.find(offer => offer && offer.isWinner);
  };

  const winningOffer = getWinningOffer();

  // Format the detailed breakdown text for better readability
  const formatDetailedBreakdown = () => {
    if (!result || !result.offers || !Array.isArray(result.offers)) {
      return "No detailed information available.";
    }

    // Create a formatted text report similar to the screenshot
    let report = "CONTRACT ANALYSIS REPORT\n\n";
    
    // Add winner declaration
    if (winningOffer) {
      report += `WINNER: ${winningOffer.state} - $${winningOffer.estimatedTakeHome.toLocaleString()} weekly take-home\n\n`;
    }
    
    // Add comparison summary
    report += "COMPARISON SUMMARY:\n";
    result.offers.forEach((offer, index) => {
      if (!offer) return;
      
      const salary = offer.weeklySalary || 0;
      const taxes = parseInt((offer.totalTaxes || "$0").replace(/[^0-9.-]+/g, "")) / 52 || 0;
      const takeHome = offer.estimatedTakeHome || 0;
      const winnerLabel = offer.isWinner ? " (BEST OFFER)" : "";
      
      report += `${index + 1}. ${offer.state}: $${salary.toLocaleString()} weekly salary, $${Math.round(taxes).toLocaleString()} taxes, $${takeHome.toLocaleString()} take-home${winnerLabel}\n`;
    });
    
    report += "\nDETAILED BREAKDOWN:\n\n";
    
    // Add detailed breakdown for each offer
    result.offers.forEach((offer, index) => {
      if (!offer) return;
      
      const salary = offer.weeklySalary || 0;
      const costOfLiving = offer.costOfLiving || "Medium";
      const taxSafe = offer.irsStipendSafe || "No";
      
      // Calculate tax breakdown
      const totalTaxAmount = parseInt((offer.totalTaxes || "$0").replace(/[^0-9.-]+/g, "")) || 0;
      const weeklyTaxes = Math.round(totalTaxAmount / 52);
      const federalTax = Math.round(totalTaxAmount * 0.6 / 52);
      const stateTax = Math.round(totalTaxAmount * 0.35 / 52);
      const cityTax = Math.round(totalTaxAmount * 0.05 / 52);
      
      // Calculate monthly expenses based on cost of living
      const monthlyHousing = costOfLiving === "Low" ? 1200 : costOfLiving === "Medium" ? 1800 : 2600;
      const monthlyExpenses = costOfLiving === "Low" ? 800 : costOfLiving === "Medium" ? 1200 : 1800;
      
      // Calculate contract summary
      const grossIncomeForThreeMonths = salary * 13;
      const taxesForThreeMonths = Math.round(totalTaxAmount / 4);
      
      report += `CONTRACT ${index + 1}: ${offer.state.toUpperCase()}\n`;
      report += "----------------------------------------------\n";
      report += `Weekly Salary: $${salary.toLocaleString()}\n`;
      report += `Weekly Taxable Income: $${Math.round(salary * 0.6).toLocaleString()}\n`;
      report += `Weekly Tax-Free Stipends: $${Math.round(salary * 0.4).toLocaleString()}\n`;
      report += `IRS Stipend Safe: ${taxSafe}\n\n`;
      
      report += `Cost of Living: ${costOfLiving}\n`;
      report += `Est. Monthly Housing: $${monthlyHousing.toLocaleString()}\n`;
      report += `Est. Monthly Expenses: $${monthlyExpenses.toLocaleString()}\n\n`;
      
      report += "Taxes (Weekly):\n";
      report += `- Federal: $${federalTax.toLocaleString()}\n`;
      report += `- State: $${stateTax.toLocaleString()}\n`;
      report += `- City: $${cityTax.toLocaleString()}\n`;
      report += `- TOTAL: $${weeklyTaxes.toLocaleString()}\n\n`;
      
      report += "13-Week Contract Summary:\n";
      report += `- Gross Income: $${grossIncomeForThreeMonths.toLocaleString()}\n`;
      report += `- Est. Taxes: $${taxesForThreeMonths.toLocaleString()}\n`;
      report += `- Est. Take-Home: $${(offer.estimatedTakeHome * 13).toLocaleString()}\n\n`;
    });
    
    return report;
  };

  // Loading state skeleton
  const renderLoadingSkeleton = () => (
    <Card className="w-full shadow-sm bg-white text-black border border-gray-200 rounded-xl mb-4">
      <CardHeader className="bg-white border-b border-gray-200 p-4">
        <Skeleton className="h-8 w-64" />
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
        </div>
      </CardContent>
    </Card>
  );

  // If we're parsing or loading, show skeleton
  if (resultText && !result) {
    return renderLoadingSkeleton();
  }

  // If we have structured data
  if (result) {
    // Additional safeguards: Check for required keys
    if (!result.offers || !Array.isArray(result.offers)) {
      return (
        <Card className="w-full shadow-sm bg-white text-black border border-gray-200 rounded-xl mb-4">
          <CardHeader className="bg-white border-b border-gray-200 p-4">
            <CardTitle className="text-xl font-bold text-black">
              Contract Comparison Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="p-6 text-center">
              <p>Unable to display offers. The data format appears to be incorrect.</p>
              <pre className="mt-4 text-xs text-left bg-gray-100 p-2 rounded overflow-auto max-h-[200px]">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <>
        {winningOffer && (
          <div className="flex flex-col items-center justify-center mb-6 animate-fade-in">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-2">
              Your Top Contract: {winningOffer.state}
            </h2>
            <div className="flex items-center justify-center">
              <Badge className="bg-yellow-500 text-black flex items-center px-3 py-1.5 text-sm">
                <Trophy className="h-4 w-4 mr-1" /> Winner!
              </Badge>
            </div>
          </div>
        )}

        <Card className="w-full shadow-sm bg-white text-black border border-gray-200 rounded-xl mb-4" id="report-content">
          <CardHeader className="bg-white border-b border-gray-200 p-4">
            <CardTitle className="text-xl font-bold text-black">
              Summary Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="border-collapse w-full">
              <TableHeader className="bg-gray-100">
                <TableRow className="border-gray-200">
                  <TableHead className="text-black">Destination</TableHead>
                  <TableHead className="text-black"><div className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-gray-600" /> Weekly Pay</div></TableHead>
                  <TableHead className="text-black"><div className="flex items-center gap-1"><BadgeInfo className="h-4 w-4 text-gray-600" /> IRS Stipend Safe?</div></TableHead>
                  <TableHead className="text-black"><div className="flex items-center gap-1"><Home className="h-4 w-4 text-gray-600" /> Cost of Living</div></TableHead>
                  <TableHead className="text-black">
                    <div className="flex items-center gap-1">
                      <BadgeDollarSign className="h-4 w-4 text-gray-600" /> Est. Taxes (Deducted Weekly)*
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-gray-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[250px] text-xs">
                            Estimates based on available tax data.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="text-black"><div className="flex items-center gap-1"><Wallet className="h-4 w-4 text-gray-600" /> Est. Take-Home (Weekly)</div></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.offers.map((offer, index) => {
                  // Safely handle missing data with defaults
                  const safeOffer = {
                    state: offer?.state || "Unknown Location",
                    weeklySalary: offer?.weeklySalary || 0,
                    irsStipendSafe: offer?.irsStipendSafe || "No",
                    costOfLiving: offer?.costOfLiving || "Medium",
                    totalTaxes: offer?.totalTaxes || "$0",
                    estimatedTakeHome: offer?.estimatedTakeHome || 0,
                    isWinner: !!offer?.isWinner
                  };
                  
                  // Calculate weekly taxes (annual taxes divided by 52)
                  const weeklyTaxes = parseInt(safeOffer.totalTaxes.replace(/[^0-9.-]+/g, "")) / 52 || 0;
                  
                  return (
                    <TableRow key={`offer-${index}`} isWinner={safeOffer.isWinner}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-600" />
                          {safeOffer.state}
                          {safeOffer.isWinner && (
                            <Badge className="bg-yellow-500 text-black">
                              <Trophy className="h-3 w-3 mr-1" /> Winner!
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>${safeOffer.weeklySalary.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={safeOffer.irsStipendSafe === "Yes" ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}>
                          {safeOffer.irsStipendSafe}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          safeOffer.costOfLiving === "Low" ? "bg-green-100 text-green-800 border-green-200" : 
                          safeOffer.costOfLiving === "Medium" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : 
                          "bg-red-100 text-red-800 border-red-200"
                        }>
                          {safeOffer.costOfLiving}
                        </Badge>
                      </TableCell>
                      <TableCell>${Math.round(weeklyTaxes).toLocaleString()}</TableCell>
                      <TableCell className={`font-bold ${safeOffer.isWinner ? 'text-green-600' : ''}`}>
                        ${safeOffer.estimatedTakeHome.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="p-4 text-xs text-gray-500">
              * Estimates based on available tax data.
            </div>
            
            <div className="flex justify-center gap-4 p-4 border-t border-gray-200">
              <Collapsible 
                open={showDetailedBreakdown}
                onOpenChange={setShowDetailedBreakdown}
                className="w-full"
              >
                <div className="flex justify-center">
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                    >
                      {showDetailedBreakdown ? (
                        <>
                          <ChevronUp className="h-4 w-4" /> 
                          Hide Detailed Breakdown
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" /> 
                          Show Detailed Breakdown
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                
                <CollapsibleContent className="animate-accordion-down mt-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto">
                    <div className="font-sans text-sm space-y-6">
                      {result.offers.map((offer, index) => {
                        if (!offer) return null;
                        
                        const salary = offer.weeklySalary || 0;
                        const costOfLiving = offer.costOfLiving || "Medium";
                        const taxSafe = offer.irsStipendSafe || "No";
                        
                        // Calculate tax breakdown
                        const totalTaxAmount = parseInt((offer.totalTaxes || "$0").replace(/[^0-9.-]+/g, "")) || 0;
                        const weeklyTaxes = Math.round(totalTaxAmount / 52);
                        const federalTax = Math.round(totalTaxAmount * 0.6 / 52);
                        const stateTax = Math.round(totalTaxAmount * 0.35 / 52);
                        const cityTax = Math.round(totalTaxAmount * 0.05 / 52);
                        
                        // Calculate monthly expenses based on cost of living
                        const monthlyHousing = costOfLiving === "Low" ? 1200 : costOfLiving === "Medium" ? 1800 : 2600;
                        const monthlyExpenses = costOfLiving === "Low" ? 800 : costOfLiving === "Medium" ? 1200 : 1800;
                        
                        // Calculate contract summary
                        const grossIncomeForThreeMonths = salary * 13;
                        const taxesForThreeMonths = Math.round(totalTaxAmount / 4);
                        const takeHomeForThreeMonths = offer.estimatedTakeHome * 13;
                        
                        return (
                          <div key={`detail-${index}`} className="pb-4 border-b border-gray-200 last:border-0">
                            <h3 className="font-bold text-lg mb-3 flex items-center">
                              <MapPin className="h-5 w-5 mr-2" />
                              CONTRACT: {offer.state.toUpperCase()}
                              {offer.isWinner && (
                                <Badge className="ml-2 bg-yellow-500 text-black">
                                  <Trophy className="h-3 w-3 mr-1" /> Winner!
                                </Badge>
                              )}
                            </h3>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-semibold flex items-center"><DollarSign className="h-4 w-4 mr-1" /> Salary Information</h4>
                                  <ul className="ml-6 space-y-1">
                                    <li className="flex justify-between">
                                      <span>Weekly Salary:</span>
                                      <span className="font-mono">${salary.toLocaleString()}</span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span>Weekly Taxable Income:</span>
                                      <span className="font-mono">${Math.round(salary * 0.6).toLocaleString()}</span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span>Weekly Tax-Free Stipends:</span>
                                      <span className="font-mono">${Math.round(salary * 0.4).toLocaleString()}</span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span>IRS Stipend Safe:</span>
                                      <span>
                                        <Badge className={taxSafe === "Yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                          {taxSafe}
                                        </Badge>
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold flex items-center"><Home className="h-4 w-4 mr-1" /> Cost of Living</h4>
                                  <ul className="ml-6 space-y-1">
                                    <li className="flex justify-between">
                                      <span>Rating:</span>
                                      <Badge className={
                                        costOfLiving === "Low" ? "bg-green-100 text-green-800" : 
                                        costOfLiving === "Medium" ? "bg-yellow-100 text-yellow-800" : 
                                        "bg-red-100 text-red-800"
                                      }>
                                        {costOfLiving}
                                      </Badge>
                                    </li>
                                    <li className="flex justify-between">
                                      <span>Est. Monthly Housing:</span>
                                      <span className="font-mono">${monthlyHousing.toLocaleString()}</span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span>Est. Monthly Expenses:</span>
                                      <span className="font-mono">${monthlyExpenses.toLocaleString()}</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <h4 className="font-semibold flex items-center"><Calculator className="h-4 w-4 mr-1" /> Taxes (Weekly)</h4>
                                  <ul className="ml-6 space-y-1">
                                    <li className="flex justify-between">
                                      <span>Federal:</span>
                                      <span className="font-mono">${federalTax.toLocaleString()}</span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span>State:</span>
                                      <span className="font-mono">${stateTax.toLocaleString()}</span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span>City/Local:</span>
                                      <span className="font-mono">${cityTax.toLocaleString()}</span>
                                    </li>
                                    <li className="flex justify-between font-semibold">
                                      <span>TOTAL:</span>
                                      <span className="font-mono">${weeklyTaxes.toLocaleString()}</span>
                                    </li>
                                  </ul>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold flex items-center"><Briefcase className="h-4 w-4 mr-1" /> 13-Week Contract Summary</h4>
                                  <ul className="ml-6 space-y-1">
                                    <li className="flex justify-between">
                                      <span>Gross Income:</span>
                                      <span className="font-mono">${grossIncomeForThreeMonths.toLocaleString()}</span>
                                    </li>
                                    <li className="flex justify-between">
                                      <span>Est. Taxes:</span>
                                      <span className="font-mono">${taxesForThreeMonths.toLocaleString()}</span>
                                    </li>
                                    <li className="flex justify-between font-semibold">
                                      <span>Est. Take-Home:</span>
                                      <span className="font-mono text-green-600">${takeHomeForThreeMonths.toLocaleString()}</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  // Fallback to the original text display if parsing failed
  return (
    <Card className="w-full shadow-sm bg-white text-black border border-gray-200 rounded-xl mb-4">
      <CardHeader className="bg-white border-b border-gray-200 flex flex-row justify-between items-center p-4">
        <CardTitle className="text-xl font-bold text-black">Contract Analysis Report</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {resultText ? (
          <div className="whitespace-pre-wrap bg-white p-6 rounded border border-gray-200 max-h-[500px] overflow-y-auto text-black">
            {resultText}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p>No results to display. Please submit your contract information.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
