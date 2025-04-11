
import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const ResultDisplay = ({ resultText }) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [expandedOffers, setExpandedOffers] = useState({});

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

  // Toggle individual row expansion
  const toggleRowExpansion = (index) => {
    setExpandedOffers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Render detailed breakdown for a single offer
  const renderDetailedBreakdown = (offer, index) => {
    if (!expandedOffers[index]) return null;

    // Calculate tax breakdown
    const totalTaxAmount = parseInt(offer.totalTaxes.replace(/[^0-9.-]+/g, ""));
    const federalTax = Math.round(totalTaxAmount * 0.6);
    const stateTax = Math.round(totalTaxAmount * 0.35);
    const cityTax = Math.round(totalTaxAmount * 0.05);
    
    const weeklyFedTax = Math.round(federalTax / 52);
    const weeklyStateTax = Math.round(stateTax / 52);
    const weeklyCityTax = Math.round(cityTax / 52);
    
    const grossIncomeForThreeMonths = offer.weeklySalary * 13;
    const taxesForThreeMonths = Math.round(totalTaxAmount / 4);
    const livingCostsForThreeMonths = offer.costOfLiving === "Low" ? 6500 : offer.costOfLiving === "Medium" ? 9750 : 14300;
    const estimatedSavingsForThreeMonths = Math.round((offer.estimatedTakeHome * 13) - livingCostsForThreeMonths);

    return (
      <tr className="animate-accordion-down border-0">
        <td colSpan={6} className="p-0 border-0">
          <div className={`px-4 pb-6 pt-2 ${offer.isWinner ? 'bg-yellow-50' : 'bg-white'}`}>
            <div className="text-xl font-bold mb-4">{offer.state} Detailed Report</div>
            
            <div className="space-y-6">
              {/* Income Breakdown Section */}
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <div className="flex items-center gap-2 font-semibold mb-4 text-gray-700">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div className="text-lg">Income Breakdown</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div>Weekly Salary:</div>
                    <div className="font-medium">${offer.weeklySalary.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Weekly Taxable Income:</div>
                    <div className="font-medium">${Math.round(offer.weeklySalary * 0.6).toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Weekly Tax-Free Stipends:</div>
                    <div className="font-medium">${Math.round(offer.weeklySalary * 0.4).toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Est. Weekly Taxes*:</div>
                    <div className="font-medium text-red-600">-${Math.round(weeklyFedTax + weeklyStateTax + weeklyCityTax).toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-100">
                    <div className="font-semibold">Estimated Weekly Take-Home:</div>
                    <div className="font-bold text-green-600">${offer.estimatedTakeHome.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Cost of Living Section */}
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <div className="flex items-center gap-2 font-semibold mb-4 text-gray-700">
                  <Home className="h-5 w-5 text-blue-600" />
                  <div className="text-lg">Cost of Living Estimate</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div>Classification:</div>
                    <Badge className={offer.costOfLiving === "Low" ? "bg-green-100 text-green-800 border-green-200" : 
                      offer.costOfLiving === "Medium" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : 
                      "bg-red-100 text-red-800 border-red-200"}>
                      {offer.costOfLiving}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <div>Est. Monthly Housing:</div>
                    <div className="font-medium">${offer.costOfLiving === "Low" ? "1,200" : offer.costOfLiving === "Medium" ? "1,800" : "2,600"}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Est. Monthly Expenses:</div>
                    <div className="font-medium">${offer.costOfLiving === "Low" ? "800" : offer.costOfLiving === "Medium" ? "1,200" : "1,800"}</div>
                  </div>
                </div>
              </div>

              {/* 3-Month Contract Summary */}
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <div className="flex items-center gap-2 font-semibold mb-4 text-gray-700">
                  <Calculator className="h-5 w-5 text-purple-600" />
                  <div className="text-lg">3-Month Contract Summary</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div>13-Week Gross Income:</div>
                    <div className="font-medium">${grossIncomeForThreeMonths.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>13-Week Est. Taxes*:</div>
                    <div className="font-medium text-red-600">-${taxesForThreeMonths.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>13-Week Est. Living Costs:</div>
                    <div className="font-medium text-red-600">-${livingCostsForThreeMonths.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between mt-2 p-2 bg-green-50 border border-green-200 rounded-md text-green-800">
                    <div className="font-semibold">Estimated Savings (13 Weeks)*:</div>
                    <div className="font-bold text-green-600">${estimatedSavingsForThreeMonths.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  };

  // If we have structured data
  if (result) {
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
              Contract Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="border-collapse w-full">
              <TableHeader className="bg-gray-100">
                <TableRow className="border-gray-200">
                  <TableHead className="text-black">Destination</TableHead>
                  <TableHead className="text-black">Weekly Pay</TableHead>
                  <TableHead className="text-black">IRS Stipend Safe?</TableHead>
                  <TableHead className="text-black">Cost of Living</TableHead>
                  <TableHead className="text-black">
                    <div className="flex items-center gap-1">
                      Est. Taxes (Deducted Weekly)*
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
                  <TableHead className="text-black">Est. Take-Home (Weekly)</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.offers.map((offer, index) => {
                  // Calculate weekly taxes (annual taxes divided by 52)
                  const weeklyTaxes = parseInt(offer.totalTaxes.replace(/[^0-9.-]+/g, "")) / 52;
                  
                  return (
                    <React.Fragment key={`offer-${index}`}>
                      <TableRow isWinner={offer.isWinner}>
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
                        <TableCell className={`font-bold ${offer.isWinner ? 'text-[#ea384c]' : ''}`}>
                          ${offer.estimatedTakeHome.toLocaleString()}
                        </TableCell>
                        <TableCell className="p-0 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => toggleRowExpansion(index)}
                            className="h-8 w-8 p-0"
                          >
                            {expandedOffers[index] ? 
                              <ChevronUp className="h-4 w-4" /> : 
                              <ChevronDown className="h-4 w-4" />
                            }
                          </Button>
                        </TableCell>
                      </TableRow>
                      {renderDetailedBreakdown(offer, index)}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
            <div className="p-4 flex justify-between items-center text-xs text-gray-500">
              <div>* Estimates based on available tax data.</div>
              <div>Report generated: {result.reportDate}</div>
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
        <div className="whitespace-pre-wrap bg-white p-6 rounded border border-gray-200 max-h-[500px] overflow-y-auto text-black">
          {resultText}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
