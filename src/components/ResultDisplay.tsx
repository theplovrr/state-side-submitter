
import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ResultDisplay = ({ resultText }) => {
  const { toast } = useToast();
  const textRef = useRef(null);

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
            <Table className="border-collapse">
              <TableHeader className="bg-gray-50">
                <TableRow className="border-gray-200">
                  <TableHead className="text-black">Destination</TableHead>
                  <TableHead className="text-black">Weekly Pay</TableHead>
                  <TableHead className="text-black">IRS Stipend Safe?</TableHead>
                  <TableHead className="text-black">Cost of Living</TableHead>
                  <TableHead className="text-black">Est. Take-Home</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.offers.map((offer, index) => (
                  <TableRow 
                    key={index} 
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
                    <TableCell className={`font-bold ${offer.isWinner ? 'text-black' : ''}`}>
                      ${offer.estimatedTakeHome.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="text-xs text-gray-500 mt-4 text-right">
              Report generated: {result.reportDate}
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
