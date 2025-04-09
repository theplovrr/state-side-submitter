
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Download, Copy, Check, Trophy, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ResultDisplay = ({ resultText }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
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

  const handleCopy = () => {
    if (textRef.current) {
      navigator.clipboard.writeText(resultText);
      setCopied(true);
      toast({
        title: "Analysis copied to clipboard",
        duration: 2000,
      });

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([resultText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "travel-contract-analysis.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Contract analysis downloaded",
      duration: 2000,
    });
  };

  // Render a table display if we have structured data
  if (result) {
    return (
      <Card className="w-full shadow-lg bg-black text-white border-gray-800 mt-8">
        <CardHeader className="bg-black border-b border-gray-800 flex flex-row justify-between items-center p-4">
          <CardTitle className="text-xl font-bold text-white">
            {result.isSingleDestination 
              ? "Contract Analysis" 
              : "Contract Comparison"
            }
          </CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="border-gray-700 bg-gray-900 hover:bg-gray-800 text-white"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              className="border-gray-700 bg-gray-900 hover:bg-gray-800 text-white"
            >
              <Download size={16} />
              <span className="ml-2">Download</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-4 p-3 bg-gray-900 rounded-md border border-gray-800">
            <p className="text-gray-300"><span className="font-semibold">Home State:</span> {result.homeState}</p>
          </div>
          
          <Table className="border-collapse">
            <TableHeader className="bg-gray-900">
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300">Destination</TableHead>
                <TableHead className="text-gray-300">Weekly Pay</TableHead>
                <TableHead className="text-gray-300">Home State Tax Impact</TableHead>
                <TableHead className="text-gray-300">Total Taxes</TableHead>
                <TableHead className="text-gray-300">IRS Stipend Safe?</TableHead>
                <TableHead className="text-gray-300">Cost of Living</TableHead>
                <TableHead className="text-gray-300">Est. Take-Home</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.offers.map((offer, index) => (
                <TableRow 
                  key={index} 
                  className={`border-gray-800 ${offer.isWinner ? 'bg-gray-800 animate-pulse' : ''}`}
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
                  <TableCell>{offer.homeStateTaxImpact}</TableCell>
                  <TableCell>{offer.totalTaxes}</TableCell>
                  <TableCell>
                    <Badge className={offer.irsStipendSafe === "Yes" ? "bg-green-600" : "bg-red-600"}>
                      {offer.irsStipendSafe}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      offer.costOfLiving === "Low" ? "bg-green-600" : 
                      offer.costOfLiving === "Medium" ? "bg-yellow-600" : 
                      "bg-red-600"
                    }>
                      {offer.costOfLiving}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold">
                    ${offer.estimatedTakeHome.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-2">Additional Considerations</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              {result.additionalConsiderations.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="text-xs text-gray-400 mt-4">
            Report generated by Plovrr on: {result.reportDate}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-900 p-6 flex flex-col items-center space-y-4 border-t border-gray-800">
          <p className="text-center text-gray-300 font-medium">Ready to take action on this analysis?</p>
          <Button className="bg-white hover:bg-gray-200 text-black flex items-center gap-2">
            Sign up for Plovrr to maximize your earnings and simplify taxes
            <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Fallback to the original text display if parsing failed
  return (
    <Card className="w-full shadow-lg bg-black text-white border-gray-800 mt-8">
      <CardHeader className="bg-black border-b border-gray-800 flex flex-row justify-between items-center p-4">
        <CardTitle className="text-xl font-bold text-white">Contract Analysis</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy}
            className="border-gray-700 bg-gray-900 hover:bg-gray-800 text-white"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            className="border-gray-700 bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Download size={16} />
            <span className="ml-2">Download</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div 
          ref={textRef}
          className="whitespace-pre-wrap font-mono text-sm bg-gray-900 p-6 rounded border border-gray-700 max-h-[500px] overflow-y-auto text-white"
        >
          {resultText}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-900 p-6 flex flex-col items-center space-y-4 border-t border-gray-800">
        <p className="text-center text-gray-300 font-medium">Ready to take action on this analysis?</p>
        <Button className="bg-white hover:bg-gray-200 text-black flex items-center gap-2">
          Sign up for Plovrr to maximize your earnings and simplify taxes
          <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResultDisplay;
