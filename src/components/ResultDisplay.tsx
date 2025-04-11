
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
                ? "Detailed Contract Analysis" 
                : "Detailed Contract Comparison"
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
            
            {/* Collapsible detailed report section with enhanced formatting */}
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
                  <div className="font-mono text-sm bg-gray-50 p-6 rounded-lg border border-gray-200 overflow-x-auto leading-relaxed">
                    {result.textReport ? (
                      <div dangerouslySetInnerHTML={{ 
                        __html: result.textReport
                          // Bold and colorize the key headings and winner
                          .replace(/^(WINNER:.*)/gm, '<strong class="text-xl text-[#ea384c] border-b-2 border-[#ea384c] pb-1 mb-3 block">$1</strong>')
                          .replace(/^(COMPARISON SUMMARY:)/gm, '<strong class="text-lg text-[#1A1F2C] border-b border-[#8E9196] pb-1 mb-2 block">$1</strong>')
                          .replace(/^(DETAILED BREAKDOWN:)/gm, '<strong class="text-lg text-[#1A1F2C] border-b border-[#8E9196] pb-1 mb-2 block">$1</strong>')
                          // Style contract headings, highlight winner
                          .replace(/^(CONTRACT \d+:.*)\(WINNER\)/gm, '<strong class="text-[#ea384c] text-base border-b border-[#ea384c] pb-1 mb-2 mt-6 block">$1<span class="ml-2 bg-yellow-100 px-2 py-0.5 rounded text-black text-sm">WINNER</span></strong>')
                          .replace(/^(CONTRACT \d+:.*(?!\(WINNER\))$)/gm, '<strong class="text-[#1A1F2C] text-base border-b border-gray-300 pb-1 mb-2 mt-6 block">$1</strong>')
                          // Style subheadings
                          .replace(/^(Weekly Salary:.*)/gm, '<div class="mb-1"><span class="font-semibold">Weekly Salary:</span>$1</div>')
                          .replace(/^(Weekly Taxable Income:.*)/gm, '<div class="mb-1"><span class="font-semibold">Weekly Taxable Income:</span>$1</div>')
                          .replace(/^(Weekly Tax-Free Stipends:.*)/gm, '<div class="mb-1"><span class="font-semibold">Weekly Tax-Free Stipends:</span>$1</div>')
                          .replace(/^(IRS Stipend Safe:.*)/gm, '<div class="mb-2"><span class="font-semibold">IRS Stipend Safe:</span>$1</div>')
                          .replace(/^(Cost of Living:.*)/gm, '<div class="mb-1"><span class="font-semibold">Cost of Living:</span>$1</div>')
                          .replace(/^(Est\. Monthly Housing:.*)/gm, '<div class="mb-1"><span class="font-semibold">Est. Monthly Housing:</span>$1</div>')
                          .replace(/^(Est\. Monthly Expenses:.*)/gm, '<div class="mb-2"><span class="font-semibold">Est. Monthly Expenses:</span>$1</div>')
                          .replace(/^(Taxes \(Weekly\):)/gm, '<div class="mb-1 font-semibold">Taxes (Weekly):</div>')
                          .replace(/^(- Federal:.*)/gm, '<div class="ml-4 mb-0.5">- Federal:$1</div>')
                          .replace(/^(- State:.*)/gm, '<div class="ml-4 mb-0.5">- State:$1</div>')
                          .replace(/^(- City:.*)/gm, '<div class="ml-4 mb-0.5">- City:$1</div>')
                          .replace(/^(- TOTAL:.*)/gm, '<div class="ml-4 mb-2">- <span class="font-semibold">TOTAL:</span>$1</div>')
                          .replace(/^(13-Week Contract Summary:)/gm, '<div class="mb-1 font-semibold">13-Week Contract Summary:</div>')
                          .replace(/^(- Gross Income:.*)/gm, '<div class="ml-4 mb-0.5">- Gross Income:$1</div>')
                          .replace(/^(- Est\. Taxes:.*)/gm, '<div class="ml-4 mb-0.5">- Est. Taxes:$1</div>')
                          .replace(/^(- Est\. Living Costs:.*)/gm, '<div class="ml-4 mb-0.5">- Est. Living Costs:$1</div>')
                          .replace(/^(- Estimated Savings:.*)/gm, '<div class="ml-4 mb-2 font-semibold">- Estimated Savings:$1</div>')
                          .replace(/^(Report generated:.*)/gm, '<div class="text-xs text-gray-500 mt-4">$1</div>')
                          .replace(/^(DISCLAIMER:.*)/gm, '<div class="text-xs text-gray-500">$1</div>')
                          // Add spacing between sections
                          .replace(/^--+$/gm, '<hr class="border-gray-200 my-3">')
                      }} />
                    ) : (
                      // Fallback with enhanced formatting if no HTML is provided
                      <>
                        {(() => {
                          // Generate a well-formatted detailed report for all contracts
                          let output = `<strong class="text-xl block mb-4 pb-2 border-b-2 border-[#1A1F2C]">DETAILED CONTRACT ANALYSIS REPORT</strong>\n\n`;
                          
                          if (winningOffer) {
                            output += `<strong class="text-xl text-[#ea384c] border-b-2 border-[#ea384c] pb-1 mb-5 block">WINNER: ${winningOffer.state} - $${winningOffer.estimatedTakeHome.toLocaleString()} weekly take-home</strong>\n\n`;
                          }
                          
                          output += `<strong class="text-lg text-[#1A1F2C] border-b border-[#8E9196] pb-1 mb-3 block">COMPARISON SUMMARY:</strong>\n`;
                          result.offers.forEach((offer, i) => {
                            const weeklyTaxes = parseInt(offer.totalTaxes.replace(/[^0-9.-]+/g, "")) / 52;
                            if (offer.isWinner) {
                              output += `<div class="mb-1 pl-2 border-l-2 border-[#ea384c]"><span class="font-bold text-[#ea384c]">${i+1}. ${offer.state}:</span> $${offer.weeklySalary.toLocaleString()} weekly salary, $${Math.round(weeklyTaxes).toLocaleString()} taxes, <span class="font-bold text-[#ea384c]">$${offer.estimatedTakeHome.toLocaleString()} take-home</span> <span class="bg-yellow-100 px-1.5 py-0.5 rounded text-black text-xs">BEST OFFER</span></div>`;
                            } else {
                              output += `<div class="mb-1 pl-2">${i+1}. ${offer.state}: $${offer.weeklySalary.toLocaleString()} weekly salary, $${Math.round(weeklyTaxes).toLocaleString()} taxes, $${offer.estimatedTakeHome.toLocaleString()} take-home</div>`;
                            }
                          });
                          
                          output += `\n<strong class="text-lg text-[#1A1F2C] border-b border-[#8E9196] pb-1 mt-6 mb-4 block">DETAILED BREAKDOWN:</strong>\n\n`;
                          
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
                            
                            if (offer.isWinner) {
                              output += `<strong class="text-[#ea384c] text-base border-b border-[#ea384c] pb-1 mb-2 mt-6 block">CONTRACT ${i+1}: ${offer.state.toUpperCase()} <span class="ml-2 bg-yellow-100 px-2 py-0.5 rounded text-black text-sm">WINNER</span></strong>`;
                            } else {
                              output += `<strong class="text-[#1A1F2C] text-base border-b border-gray-300 pb-1 mb-2 mt-6 block">CONTRACT ${i+1}: ${offer.state.toUpperCase()}</strong>`;
                            }
                            
                            output += `<hr class="border-gray-200 my-2">\n`;
                            output += `<div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">`;
                            output += `<div class="mb-1"><span class="font-semibold">Weekly Salary:</span> $${offer.weeklySalary.toLocaleString()}</div>`;
                            output += `<div class="mb-1"><span class="font-semibold">Weekly Taxable Income:</span> $${Math.round(offer.weeklySalary * 0.6).toLocaleString()}</div>`;
                            output += `<div class="mb-1"><span class="font-semibold">Weekly Tax-Free Stipends:</span> $${Math.round(offer.weeklySalary * 0.4).toLocaleString()}</div>`;
                            output += `<div class="mb-1"><span class="font-semibold">IRS Stipend Safe:</span> ${offer.irsStipendSafe}</div>`;
                            output += `</div>`;
                            
                            output += `<div class="mt-2 mb-1 font-semibold">Cost of Living:</div>`;
                            output += `<div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 ml-4">`;
                            output += `<div class="mb-1">• Monthly Housing: $${offer.costOfLiving === "Low" ? "1,200" : offer.costOfLiving === "Medium" ? "1,800" : "2,600"}</div>`;
                            output += `<div class="mb-1">• Monthly Expenses: $${offer.costOfLiving === "Low" ? "800" : offer.costOfLiving === "Medium" ? "1,200" : "1,800"}</div>`;
                            output += `</div>`;
                            
                            output += `<div class="mt-2 mb-1 font-semibold">Taxes (Weekly):</div>`;
                            output += `<div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 ml-4">`;
                            output += `<div class="mb-0.5">• Federal: $${weeklyFederalTax.toLocaleString()}</div>`;
                            output += `<div class="mb-0.5">• State: $${weeklyStateTax.toLocaleString()}</div>`;
                            output += `<div class="mb-0.5">• City: $${weeklyCityTax.toLocaleString()}</div>`;
                            output += `<div class="mb-2 font-semibold">• TOTAL: $${Math.round(weeklyFederalTax + weeklyStateTax + weeklyCityTax).toLocaleString()}</div>`;
                            output += `</div>`;
                            
                            output += `<div class="mt-2 mb-1 font-semibold">13-Week Contract Summary:</div>`;
                            output += `<div class="ml-4 mb-0.5">• Gross Income: $${(offer.weeklySalary * 13).toLocaleString()}</div>`;
                            output += `<div class="ml-4 mb-0.5">• Est. Taxes: -$${Math.round(parseInt(offer.totalTaxes.replace(/[^0-9.-]+/g, "")) / 4).toLocaleString()}</div>`;
                            output += `<div class="ml-4 mb-0.5">• Est. Living Costs: -$${offer.costOfLiving === "Low" ? "6,500" : offer.costOfLiving === "Medium" ? "9,750" : "14,300"}</div>`;
                            output += `<div class="ml-4 mb-2 font-semibold">• Estimated Savings: $${Math.round((offer.estimatedTakeHome * 13) - (offer.costOfLiving === "Low" ? 6500 : offer.costOfLiving === "Medium" ? 9750 : 14300)).toLocaleString()}</div>`;
                            
                            if (i < result.offers.length - 1) {
                              output += `\n`;
                            }
                          });
                          
                          output += `<div class="text-xs text-gray-500 mt-4">Report generated: ${result.reportDate}</div>`;
                          output += `<div class="text-xs text-gray-500">DISCLAIMER: These are estimates based on available tax data. For your exact taxes, consult your tax professional.</div>`;
                          
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
        <CardTitle className="text-xl font-bold text-black">Detailed Contract Analysis</CardTitle>
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
