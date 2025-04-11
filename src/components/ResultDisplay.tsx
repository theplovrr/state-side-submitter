
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, HelpCircle, ChevronDown, ChevronUp, DollarSign, Home, Calculator } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const ResultDisplay = ({ resultText }) => {
  const { toast } = useToast();
  const textRef = useRef(null);
  const [expandedOffers, setExpandedOffers] = useState([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const isMobile = useIsMobile();

  // Parse the result text into structured data
  const parseResult = () => {
    try {
      // This is a simplified version where we expect the resultText to be 
      // JSON-formatted data from the compareOffers function
      return JSON.parse(resultText);
    } catch (e) {
      // Fallback to displaying raw text if parsing fails
      return null;
    }
  };

  const result = parseResult();

  // Get the winning offer (if any)
  const getWinningOffer = () => {
    if (!result || !result.offers || result.offers.length === 0) return null;
    
    return result.offers.find(offer => offer.isWinner);
  };

  const winningOffer = getWinningOffer();

  // Toggle expanded state for an offer
  const toggleExpand = (index) => {
    setExpandedOffers(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  // Calculate tax breakdown (simplified for demo)
  const calculateTaxBreakdown = (offer) => {
    const totalTaxAmount = parseInt(offer.totalTaxes.replace(/[^0-9.-]+/g, ""));
    
    // Calculate breakdown (simplified for demo)
    const federalTax = Math.round(totalTaxAmount * 0.6); // 60% federal
    const stateTax = Math.round(totalTaxAmount * 0.35); // 35% state
    const cityTax = Math.round(totalTaxAmount * 0.05); // 5% city
    
    // Weekly amounts
    const weeklyFederalTax = Math.round(federalTax / 52);
    const weeklyStateTax = Math.round(stateTax / 52);
    const weeklyCityTax = Math.round(cityTax / 52);
    const weeklyTotalTax = weeklyFederalTax + weeklyStateTax + weeklyCityTax;
    
    return {
      weeklyFederalTax,
      weeklyStateTax,
      weeklyCityTax,
      weeklyTotalTax
    };
  };

  // Render a table display if we have structured data
  if (result) {
    return (
      <>
        {winningOffer && (
          <div className="flex flex-col items-center justify-center mb-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-2">
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
          <CardHeader className="bg-white border-b border-gray-200 p-4 flex flex-row justify-between items-center">
            <CardTitle className="text-xl font-bold text-black">
              {result.isSingleDestination 
                ? "Contract Analysis" 
                : "Contract Comparison"
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Table className="border-collapse w-full">
              <TableHeader className="bg-gray-50">
                <TableRow className="border-gray-200">
                  <TableHead className="text-black">Destination</TableHead>
                  <TableHead className="text-black">Weekly Pay</TableHead>
                  <TableHead className="text-black">IRS Stipend Safe?</TableHead>
                  <TableHead className="text-black">Cost of Living</TableHead>
                  <TableHead className="text-black">
                    <div className="flex items-center gap-1">
                      Est. Taxes (Deducted Weekly)
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-gray-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[250px] text-xs">
                            Includes estimated federal, state, and city taxes. See detailed report for full breakdown.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="text-black">Est. Take-Home (Weekly)</TableHead>
                  <TableHead className="text-black"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.offers.map((offer, index) => {
                  // Calculate weekly taxes (annual taxes divided by 52)
                  const weeklyTaxes = parseInt(offer.totalTaxes.replace(/[^0-9.-]+/g, "")) / 52;
                  const isExpanded = expandedOffers.includes(index);
                  
                  return (
                    <>
                      <TableRow 
                        key={`offer-${index}`} 
                        className={`border-gray-200 ${offer.isWinner ? 'bg-yellow-50' : ''}`}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {offer.state}
                            {offer.isWinner && (
                              <Badge className="bg-yellow-500 text-black">
                                <Trophy className="h-3 w-3 mr-1" /> Winner!
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>${offer.weeklySalary.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={offer.irsStipendSafe === "Yes" ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}>
                            {offer.irsStipendSafe}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            offer.costOfLiving === "Low" ? "bg-green-100 text-green-800 border-green-200" : 
                            offer.costOfLiving === "Medium" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : 
                            "bg-red-100 text-red-800 border-red-200"
                          }>
                            {offer.costOfLiving}
                          </Badge>
                        </TableCell>
                        <TableCell>${Math.round(weeklyTaxes).toLocaleString()}</TableCell>
                        <TableCell className={`font-bold ${offer.isWinner ? 'text-black' : ''}`}>
                          ${offer.estimatedTakeHome.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <button 
                            onClick={() => toggleExpand(index)}
                            className="text-gray-500 hover:text-gray-800 transition-colors"
                            aria-label={isExpanded ? "Hide details" : "Show details"}
                          >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                        </TableCell>
                      </TableRow>
                      
                      {/* Detailed breakdown row */}
                      {isExpanded && (
                        <TableRow key={`details-${index}`} className="bg-gray-50">
                          <TableCell colSpan={7} className="p-0">
                            <div className="p-4 border-t border-gray-200">
                              <h4 className="font-medium text-gray-900 mb-3">Detailed Breakdown: {offer.state}</h4>
                              
                              <div className="bg-white p-4 rounded-md border border-gray-200 space-y-3">
                                {/* Calculate tax breakdown */}
                                {(() => {
                                  const { weeklyFederalTax, weeklyStateTax, weeklyCityTax, weeklyTotalTax } = 
                                    calculateTaxBreakdown(offer);
                                  
                                  return (
                                    <>
                                      <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="text-gray-600">Federal Tax (Weekly):</div>
                                        <div className="font-medium text-right">${weeklyFederalTax.toLocaleString()}</div>
                                        
                                        <div className="text-gray-600">State Tax (Weekly):</div>
                                        <div className="font-medium text-right">${weeklyStateTax.toLocaleString()}</div>
                                        
                                        <div className="text-gray-600">City Tax (Weekly):</div>
                                        <div className="font-medium text-right">${weeklyCityTax.toLocaleString()}</div>
                                        
                                        <div className="text-gray-600 font-medium">Total Estimated Taxes (Weekly):</div>
                                        <div className="font-bold text-right">${weeklyTotalTax.toLocaleString()}</div>
                                        
                                        <div className="text-gray-600 pt-2 border-t border-gray-200 font-medium">Weekly Take-Home Pay:</div>
                                        <div className="font-bold text-right pt-2 border-t border-gray-200">${offer.estimatedTakeHome.toLocaleString()}</div>
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  );
                })}
              </TableBody>
            </Table>
            
            {/* Collapsible detailed report section */}
            <div className="mt-6">
              <Collapsible
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                className="w-full"
              >
                <div className="flex justify-center mb-4">
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      {isDetailsOpen ? (
                        <>Hide Detailed Breakdown {<ChevronUp className="h-4 w-4" />}</>
                      ) : (
                        <>Show Detailed Breakdown {<ChevronDown className="h-4 w-4" />}</>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                
                <CollapsibleContent className="space-y-6 pt-2 animate-accordion-down">
                  {result.offers.map((offer, index) => (
                    <div 
                      key={`detailed-offer-${index}`} 
                      className={`p-5 rounded-lg border border-gray-200 shadow-sm ${offer.isWinner ? 'bg-yellow-50' : 'bg-white'}`}
                    >
                      <h3 className="text-xl font-bold mb-4 text-center">{offer.state} Detailed Report</h3>
                      
                      {/* Income Breakdown Section */}
                      <div className={`mb-5 ${isMobile ? 'p-3' : 'p-4'} bg-gray-50 rounded-md border border-gray-200`}>
                        <h4 className="font-medium text-md mb-3 flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          Income Breakdown
                        </h4>
                        <div className={`overflow-x-auto ${isMobile ? 'pb-4' : ''}`}>
                          <table className="w-full text-sm">
                            <tbody>
                              <tr className="border-b border-gray-200">
                                <td className="py-2 text-gray-600">Weekly Salary:</td>
                                <td className="py-2 font-medium text-right">${offer.weeklySalary.toLocaleString()}</td>
                              </tr>
                              <tr className="border-b border-gray-200">
                                <td className="py-2 text-gray-600">Weekly Taxable Income:</td>
                                <td className="py-2 font-medium text-right">${Math.round(offer.weeklySalary * 0.6).toLocaleString()}</td>
                              </tr>
                              <tr className="border-b border-gray-200">
                                <td className="py-2 text-gray-600">Weekly Tax-Free Stipends:</td>
                                <td className="py-2 font-medium text-right">${Math.round(offer.weeklySalary * 0.4).toLocaleString()}</td>
                              </tr>
                              <tr className="border-b border-gray-200">
                                <td className="py-2 text-gray-600">Est. Weekly Taxes:</td>
                                <td className="py-2 font-medium text-right">-${Math.round(parseInt(offer.totalTaxes.replace(/[^0-9.-]+/g, "")) / 52).toLocaleString()}</td>
                              </tr>
                              <tr>
                                <td className="py-2 text-gray-700 font-semibold">Estimated Weekly Take-Home:</td>
                                <td className="py-2 font-bold text-right text-green-700">${offer.estimatedTakeHome.toLocaleString()}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      {/* Cost of Living Section */}
                      <div className={`mb-5 ${isMobile ? 'p-3' : 'p-4'} bg-gray-50 rounded-md border border-gray-200`}>
                        <h4 className="font-medium text-md mb-3 flex items-center gap-2">
                          <Home className="h-5 w-5 text-blue-600" />
                          Cost of Living Estimate
                        </h4>
                        <div className={`overflow-x-auto ${isMobile ? 'pb-4' : ''}`}>
                          <table className="w-full text-sm">
                            <tbody>
                              <tr className="border-b border-gray-200">
                                <td className="py-2 text-gray-600">Classification:</td>
                                <td className="py-2 font-medium text-right">
                                  <Badge className={
                                    offer.costOfLiving === "Low" ? "bg-green-100 text-green-800" : 
                                    offer.costOfLiving === "Medium" ? "bg-yellow-100 text-yellow-800" : 
                                    "bg-red-100 text-red-800"
                                  }>
                                    {offer.costOfLiving}
                                  </Badge>
                                </td>
                              </tr>
                              <tr className="border-b border-gray-200">
                                <td className="py-2 text-gray-600">Est. Monthly Housing:</td>
                                <td className="py-2 font-medium text-right">
                                  ${offer.costOfLiving === "Low" ? "1,200" : 
                                    offer.costOfLiving === "Medium" ? "1,800" : 
                                    "2,600"}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 text-gray-600">Est. Monthly Expenses:</td>
                                <td className="py-2 font-medium text-right">
                                  ${offer.costOfLiving === "Low" ? "800" : 
                                    offer.costOfLiving === "Medium" ? "1,200" : 
                                    "1,800"}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      {/* 3-Month Contract Summary */}
                      <div className={`${isMobile ? 'p-3' : 'p-4'} bg-gray-50 rounded-md border border-gray-200`}>
                        <h4 className="font-medium text-md mb-3 flex items-center gap-2">
                          <Calculator className="h-5 w-5 text-purple-600" />
                          3-Month Contract Summary
                        </h4>
                        <div className={`overflow-x-auto ${isMobile ? 'pb-4' : ''}`}>
                          <table className="w-full text-sm">
                            <tbody>
                              <tr className="border-b border-gray-200">
                                <td className="py-2 text-gray-600">13-Week Gross Income:</td>
                                <td className="py-2 font-medium text-right">${(offer.weeklySalary * 13).toLocaleString()}</td>
                              </tr>
                              <tr className="border-b border-gray-200">
                                <td className="py-2 text-gray-600">13-Week Est. Taxes:</td>
                                <td className="py-2 font-medium text-right">-${Math.round(parseInt(offer.totalTaxes.replace(/[^0-9.-]+/g, "")) / 4).toLocaleString()}</td>
                              </tr>
                              <tr className="border-b border-gray-200">
                                <td className="py-2 text-gray-600">13-Week Est. Living Costs:</td>
                                <td className="py-2 font-medium text-right">
                                  -${offer.costOfLiving === "Low" ? "6,500" : 
                                     offer.costOfLiving === "Medium" ? "9,750" : 
                                     "14,300"}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 text-gray-700 font-semibold">Estimated Savings (13 Weeks):</td>
                                <td className="py-2 font-bold text-right text-green-700 bg-green-50 px-2 rounded">
                                  ${Math.round((offer.estimatedTakeHome * 13) - 
                                    (offer.costOfLiving === "Low" ? 6500 : 
                                     offer.costOfLiving === "Medium" ? 9750 : 
                                     14300)).toLocaleString()}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 flex flex-col gap-2">
              <div className="text-right">
                Report generated: {result.reportDate}
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded text-center">
                These are estimates based on available tax data. For your exact taxes, consult your tax professional.
              </div>
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
        <CardTitle className="text-xl font-bold text-black">Contract Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div 
          ref={textRef}
          className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-6 rounded border border-gray-200 max-h-[500px] overflow-y-auto text-black"
        >
          {resultText}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
