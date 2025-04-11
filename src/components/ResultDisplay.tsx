
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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const isMobile = useIsMobile();

  // Parse the result text into structured data
  const parseResult = () => {
    try {
      return JSON.parse(resultText);
    } catch (e) {
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

  // If we have structured data
  if (result) {
    return (
      <>
        {winningOffer && (
          <div className="flex flex-col items-center justify-center mb-4 animate-fade-in">
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
          <CardHeader className="bg-white border-b border-gray-200 p-4 flex flex-row justify-between items-center">
            <CardTitle className="text-xl font-bold text-black">
              {result.isSingleDestination 
                ? "Detailed Contract Analysis Report" 
                : "Detailed Contract Analysis Report"
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {winningOffer && (
              <div className="flex flex-col mb-6 border-b border-gray-200 pb-3">
                <div className="flex items-center">
                  <h3 className="text-lg font-bold text-[#ea384c] mr-2">WINNER:</h3>
                  <span className="text-lg font-semibold">{winningOffer.state} - </span>
                  <span className="text-lg font-bold text-[#ea384c] ml-1">${winningOffer.estimatedTakeHome.toLocaleString()} weekly take-home</span>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 border-b border-gray-200 pb-2">COMPARISON SUMMARY</h3>
              <div className="space-y-2">
                {result.offers.map((offer, i) => {
                  // Calculate weekly taxes (annual taxes divided by 52)
                  const weeklyTaxes = parseInt(offer.totalTaxes.replace(/[^0-9.-]+/g, "")) / 52;
                  
                  return (
                    <div 
                      key={`summary-${i}`} 
                      className={`py-2 px-3 rounded-md ${offer.isWinner ? 'bg-yellow-50 border-l-4 border-[#ea384c]' : ''}`}
                    >
                      <span className={`font-semibold ${offer.isWinner ? 'text-[#ea384c]' : ''}`}>{i+1}. {offer.state}: </span>
                      <span>${offer.weeklySalary.toLocaleString()} weekly salary, </span>
                      <span>${Math.round(weeklyTaxes).toLocaleString()} taxes, </span>
                      <span className={`font-bold ${offer.isWinner ? 'text-[#ea384c]' : ''}`}>
                        ${offer.estimatedTakeHome.toLocaleString()} take-home
                      </span>
                      {offer.isWinner && (
                        <span className="ml-2 inline-flex items-center bg-yellow-100 text-black text-xs px-2 py-0.5 rounded">
                          <Trophy className="h-3 w-3 mr-1" /> BEST OFFER
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <Table className="border-collapse w-full mb-4 bg-gray-50 rounded-lg overflow-hidden">
              <TableHeader className="bg-gray-100">
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
                            Estimates based on available tax data. For your exact taxes, consult your tax professional.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                  <TableHead className="text-black">Est. Take-Home (Weekly)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.offers.map((offer, index) => {
                  // Calculate weekly taxes (annual taxes divided by 52)
                  const weeklyTaxes = parseInt(offer.totalTaxes.replace(/[^0-9.-]+/g, "")) / 52;
                  
                  return (
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
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            <Collapsible
              open={isDetailsOpen}
              onOpenChange={setIsDetailsOpen}
              className="w-full space-y-2"
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-1 bg-gray-50 border border-gray-200 hover:bg-gray-100 py-2 px-4 rounded-md transition-colors"
                >
                  {isDetailsOpen ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span>Hide Detailed Breakdown</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span>Show Detailed Breakdown</span>
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-4 pt-4 animate-accordion-down">
                <h3 className="text-lg font-bold border-b border-gray-200 pb-2">DETAILED BREAKDOWN</h3>
                
                <div className="space-y-6">
                  {result.offers.map((offer, i) => {
                    // Calculate tax breakdown
                    const totalTaxAmount = parseInt(offer.totalTaxes.replace(/[^0-9.-]+/g, ""));
                    const federalTax = Math.round(totalTaxAmount * 0.6);
                    const stateTax = Math.round(totalTaxAmount * 0.35);
                    const cityTax = Math.round(totalTaxAmount * 0.05);
                    
                    const weeklyFedTax = Math.round(federalTax / 52);
                    const weeklyStateTax = Math.round(stateTax / 52);
                    const weeklyCityTax = Math.round(cityTax / 52);
                    
                    return (
                      <div 
                        key={`details-${i}`} 
                        className={`p-4 rounded-lg border ${offer.isWinner ? 'bg-yellow-50 border-[#ea384c]' : 'border-gray-200'}`}
                      >
                        <div className={`text-base font-bold pb-2 mb-3 border-b ${offer.isWinner ? 'text-[#ea384c] border-[#ea384c]' : 'border-gray-200'}`}>
                          CONTRACT {i+1}: {offer.state.toUpperCase()}
                          {offer.isWinner && (
                            <span className="ml-2 inline-flex items-center bg-yellow-100 text-black text-xs px-2 py-0.5 rounded">
                              <Trophy className="h-3 w-3 mr-1" /> WINNER
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-white p-3 rounded-md border border-gray-200">
                            <div className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                              <DollarSign className="h-4 w-4" />
                              Income Breakdown
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                              <div className="space-y-1">
                                <div><span className="font-medium">Weekly Salary:</span> ${offer.weeklySalary.toLocaleString()}</div>
                                <div><span className="font-medium">Weekly Taxable Income:</span> ${Math.round(offer.weeklySalary * 0.6).toLocaleString()}</div>
                                <div><span className="font-medium">Weekly Tax-Free Stipends:</span> ${Math.round(offer.weeklySalary * 0.4).toLocaleString()}</div>
                              </div>
                              <div className="space-y-1">
                                <div><span className="font-medium">IRS Stipend Safe:</span> 
                                  <Badge className={`ml-2 ${offer.irsStipendSafe === "Yes" ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}`}>
                                    {offer.irsStipendSafe}
                                  </Badge>
                                </div>
                                <div><span className="font-medium">Cost of Living:</span> 
                                  <Badge className={`ml-2 ${
                                    offer.costOfLiving === "Low" ? "bg-green-100 text-green-800 border-green-200" : 
                                    offer.costOfLiving === "Medium" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : 
                                    "bg-red-100 text-red-800 border-red-200"
                                  }`}>
                                    {offer.costOfLiving}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white p-3 rounded-md border border-gray-200">
                            <div className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                              <Home className="h-4 w-4" />
                              Cost of Living
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                              <div>• Monthly Housing: ${offer.costOfLiving === "Low" ? "1,200" : offer.costOfLiving === "Medium" ? "1,800" : "2,600"}</div>
                              <div>• Monthly Expenses: ${offer.costOfLiving === "Low" ? "800" : offer.costOfLiving === "Medium" ? "1,200" : "1,800"}</div>
                            </div>
                          </div>
                          
                          <div className="bg-white p-3 rounded-md border border-gray-200">
                            <div className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                              <DollarSign className="h-4 w-4" />
                              Taxes (Weekly)
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 pl-6">
                              <div className="mb-1">• Federal: ${weeklyFedTax.toLocaleString()}</div>
                              <div className="mb-1">• State: ${weeklyStateTax.toLocaleString()}</div>
                              <div className="mb-1">• City: ${weeklyCityTax.toLocaleString()}</div>
                              <div className="font-semibold">• TOTAL: ${Math.round(weeklyFedTax + weeklyStateTax + weeklyCityTax).toLocaleString()}</div>
                            </div>
                          </div>
                          
                          <div className="bg-white p-3 rounded-md border border-gray-200">
                            <div className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
                              <Calculator className="h-4 w-4" />
                              13-Week Contract Summary
                            </div>
                            <div className="pl-6">
                              <div className="mb-1">• Gross Income: ${(offer.weeklySalary * 13).toLocaleString()}</div>
                              <div className="mb-1">• Est. Taxes: -${Math.round(totalTaxAmount / 4).toLocaleString()}</div>
                              <div className="mb-1">• Est. Living Costs: -${offer.costOfLiving === "Low" ? "6,500" : offer.costOfLiving === "Medium" ? "9,750" : "14,300"}</div>
                              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md text-green-800 font-bold">
                                • Estimated Savings: ${Math.round((offer.estimatedTakeHome * 13) - (offer.costOfLiving === "Low" ? 6500 : offer.costOfLiving === "Medium" ? 9750 : 14300)).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
            
            <div className="text-xs text-gray-500 pt-3 border-t border-gray-200 flex justify-between">
              <div>
                DISCLAIMER: These are estimates based on available tax data. For your exact taxes, consult your tax professional.
              </div>
              <div className="text-right">
                Report generated: {result.reportDate}
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
        <CardTitle className="text-xl font-bold text-black">Detailed Contract Analysis Report</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div 
          ref={textRef}
          className="whitespace-pre-wrap bg-white p-6 rounded border border-gray-200 max-h-[500px] overflow-y-auto text-black"
        >
          {resultText}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
