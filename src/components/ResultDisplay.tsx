
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Copy, Check, Trophy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ResultDisplay = ({ resultText }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const textRef = useRef(null);
  const reportRef = useRef(null);

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

  const handleDownload = async () => {
    if (!result) {
      toast({
        title: "Error generating report",
        description: "Could not generate PDF report from the data",
        variant: "destructive",
      });
      return;
    }

    // Show a toast to indicate we're generating the PDF
    toast({
      title: "Generating your PDF report...",
      duration: 2000,
    });

    try {
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Set up PDF content
      const winningOffer = result.offers.find(offer => offer.isWinner);
      
      // Add logo
      const logoImg = document.querySelector("img[alt='Plovrr Logo']");
      if (logoImg) {
        const logoCanvas = await html2canvas(logoImg as HTMLElement);
        const logoData = logoCanvas.toDataURL('image/png');
        pdf.addImage(logoData, 'PNG', 20, 10, 40, 20);
      }
      
      // Add title and date
      pdf.setFontSize(20);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Contract Analysis Report", 20, 40);
      
      if (winningOffer) {
        pdf.setFontSize(16);
        pdf.text(`Your Top Contract: ${winningOffer.state}`, 20, 50);
      }
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Report generated: ${result.reportDate}`, 20, 60);
      
      // Add table headers
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Destination", 20, 70);
      pdf.text("Weekly Pay", 70, 70);
      pdf.text("IRS Stipend", 110, 70);
      pdf.text("Cost of Living", 150, 70);
      pdf.text("Est. Take-Home", 190, 70);
      
      // Add table divider
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 72, 190, 72);
      
      // Add table rows
      let yPosition = 80;
      result.offers.forEach((offer, index) => {
        // Highlight winner row with light yellow background
        if (offer.isWinner) {
          pdf.setFillColor(255, 245, 215);
          pdf.rect(20, yPosition - 5, 170, 10, 'F');
        }
        
        pdf.setTextColor(0, 0, 0);
        pdf.text(offer.state + (offer.isWinner ? " 🏆" : ""), 20, yPosition);
        pdf.text(`$${offer.weeklySalary.toLocaleString()}`, 70, yPosition);
        pdf.text(offer.irsStipendSafe, 110, yPosition);
        pdf.text(offer.costOfLiving, 150, yPosition);
        
        // Bold the take-home pay amount for winner
        if (offer.isWinner) {
          pdf.setFont(undefined, 'bold');
        }
        pdf.text(`$${offer.estimatedTakeHome.toLocaleString()}`, 190, yPosition);
        pdf.setFont(undefined, 'normal');
        
        yPosition += 12;
      });
      
      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Provided by Plovrr - Travel Nurse Take-Home Pay & Tax Estimator", 20, 270);
      
      // Save the PDF
      pdf.save("travel-contract-analysis.pdf");
      
      toast({
        title: "Contract analysis report downloaded",
        description: "Your PDF report has been generated successfully",
        duration: 2000,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error generating report",
        description: "There was an error creating your PDF report",
        variant: "destructive",
      });
    }
  };

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

        <Card className="w-full shadow-sm bg-white text-black border border-gray-200 rounded-xl mb-4" ref={reportRef}>
          <CardHeader className="bg-white border-b border-gray-200 p-4 flex flex-row justify-between items-center">
            <CardTitle className="text-xl font-bold text-black">
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
                className="border-gray-200 bg-white hover:bg-gray-50 text-black"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                className="border-gray-200 bg-white hover:bg-gray-50 text-black"
              >
                <Download size={16} />
                <span className="ml-2">Download Detailed Report</span>
              </Button>
            </div>
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
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy}
            className="border-gray-200 bg-white hover:bg-gray-50 text-black"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            className="border-gray-200 bg-white hover:bg-gray-50 text-black"
          >
            <Download size={16} />
            <span className="ml-2">Download Detailed Report</span>
          </Button>
        </div>
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
