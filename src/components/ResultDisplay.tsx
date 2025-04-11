
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
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
                      Est. Taxes (Deducted Weekly)*
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
                  <TableHead className="text-black">
                    <div className="flex items-center gap-1">
                      Est. Take-Home (Weekly)*
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
            
            {/* Collapsible detailed report section with raw text output */}
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
                        <>Hide Detailed Breakdown <ChevronUp className="h-4 w-4" /></>
                      ) : (
                        <>Show Detailed Breakdown <ChevronDown className="h-4 w-4" /></>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                
                <CollapsibleContent className="space-y-6 pt-2 animate-accordion-down">
                  <div className="font-mono text-sm bg-gray-50 p-6 rounded-lg border border-gray-200 whitespace-pre-line overflow-x-auto">
                    {/* Display the raw text with font styling for bold headings */}
                    {result.textReport ? (
                      <div dangerouslySetInnerHTML={{ 
                        __html: result.textReport
                          // Bold the key headings
                          .replace(/^(WINNER:.*)/gm, '<strong>$1</strong>')
                          .replace(/^(COMPARISON SUMMARY:)/gm, '<strong>$1</strong>')
                          .replace(/^(DETAILED BREAKDOWN:)/gm, '<strong>$1</strong>')
                          .replace(/^(CONTRACT \d+:.*(\(WINNER\))?)/gm, '<strong>$1</strong>')
                          .replace(/^(Report generated:.*)/gm, '<em>$1</em>')
                          .replace(/^(DISCLAIMER:.*)/gm, '<em>$1</em>')
                          // Add spacing between sections
                          .replace(/^--+$/gm, '<hr class="border-gray-200 my-2">')
                      }} />
                    ) : (
                      // Fallback raw text without formatting if no HTML is provided
                      <>
                        {(() => {
                          // Generate a ChatGPT-style text output for all contracts
                          let output = `<strong>CONTRACT ANALYSIS REPORT</strong>\n\n`;
                          
                          if (winningOffer) {
                            output += `<strong>WINNER: ${winningOffer.state} - $${winningOffer.estimatedTakeHome.toLocaleString()} weekly take-home</strong>\n\n`;
                          }
                          
                          output += `<strong>COMPARISON SUMMARY:</strong>\n`;
                          result.offers.forEach((offer, i) => {
                            const weeklyTaxes = parseInt(offer.totalTaxes.replace(/[^0-9.-]+/g, "")) / 52;
                            output += `${i+1}. ${offer.state}: $${offer.weeklySalary.toLocaleString()} weekly salary, $${Math.round(weeklyTaxes).toLocaleString()} taxes, $${offer.estimatedTakeHome.toLocaleString()} take-home${offer.isWinner ? ' (BEST OFFER)' : ''}\n`;
                          });
                          
                          output += `\n<strong>DETAILED BREAKDOWN:</strong>\n\n`;
                          
                          result.offers.forEach((offer, i) => {
                            // Calculate tax breakdown
                            const totalTaxAmount = parseInt(offer.totalTaxes.replace(/[^0-9.-]+/g, ""));
                            const federalTax = Math.round(totalTaxAmount * 0.6);
                            const stateTax = Math.round(totalTaxAmount * 0.35);
                            const cityTax = Math.round(totalTaxAmount * 0.05);
                            
                            // Weekly amounts
                            const weeklyFederalTax = Math.round(federalTax / 52);
                            const weeklyStateTax = Math.round(stateTax / 52);
                            const weeklyCityTax = Math.round(cityTax / 52);
                            
                            output += `<strong>CONTRACT ${i+1}: ${offer.state.toUpperCase()}${offer.isWinner ? ' (WINNER)' : ''}</strong>\n`;
                            output += `<hr class="border-gray-200 my-2">\n`;
                            output += `Weekly Salary: $${offer.weeklySalary.toLocaleString()}\n`;
                            output += `Weekly Taxable Income: $${Math.round(offer.weeklySalary * 0.6).toLocaleString()}\n`;
                            output += `Weekly Tax-Free Stipends: $${Math.round(offer.weeklySalary * 0.4).toLocaleString()}\n`;
                            output += `IRS Stipend Safe: ${offer.irsStipendSafe}\n\n`;
                            
                            output += `Cost of Living: ${offer.costOfLiving}\n`;
                            output += `Est. Monthly Housing: $${offer.costOfLiving === "Low" ? "1,200" : offer.costOfLiving === "Medium" ? "1,800" : "2,600"}\n`;
                            output += `Est. Monthly Expenses: $${offer.costOfLiving === "Low" ? "800" : offer.costOfLiving === "Medium" ? "1,200" : "1,800"}\n\n`;
                            
                            output += `Taxes (Weekly):\n`;
                            output += `- Federal: $${weeklyFederalTax.toLocaleString()}\n`;
                            output += `- State: $${weeklyStateTax.toLocaleString()}\n`;
                            output += `- City: $${weeklyCityTax.toLocaleString()}\n`;
                            output += `- TOTAL: $${Math.round(weeklyFederalTax + weeklyStateTax + weeklyCityTax).toLocaleString()}\n\n`;
                            
                            output += `13-Week Contract Summary:\n`;
                            output += `- Gross Income: $${(offer.weeklySalary * 13).toLocaleString()}\n`;
                            output += `- Est. Taxes: -$${Math.round(parseInt(offer.totalTaxes.replace(/[^0-9.-]+/g, "")) / 4).toLocaleString()}\n`;
                            output += `- Est. Living Costs: -$${offer.costOfLiving === "Low" ? "6,500" : offer.costOfLiving === "Medium" ? "9,750" : "14,300"}\n`;
                            output += `- Estimated Savings: $${Math.round((offer.estimatedTakeHome * 13) - (offer.costOfLiving === "Low" ? 6500 : offer.costOfLiving === "Medium" ? 9750 : 14300)).toLocaleString()}\n\n`;
                            
                            if (i < result.offers.length - 1) {
                              output += `\n`;
                            }
                          });
                          
                          output += `\n<em>Report generated: ${result.reportDate}</em>\n`;
                          output += `<em>DISCLAIMER: These are estimates based on available tax data. For your exact taxes, consult your tax professional.</em>`;
                          
                          return <div dangerouslySetInnerHTML={{ __html: output }} />;
                        })()}
                      </>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            
            <div className="mt-4 text-xs text-gray-500 flex justify-end">
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
