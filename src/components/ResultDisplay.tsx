
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ResultDisplay = ({ resultText }) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const textRef = useRef(null);

  const handleCopy = () => {
    if (textRef.current) {
      navigator.clipboard.writeText(resultText);
      setCopied(true);
      toast({
        title: "Text copied to clipboard",
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
    a.download = "job-offer-analysis.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Analysis downloaded",
      duration: 2000,
    });
  };

  return (
    <Card className="w-full shadow-md bg-white border-gray-200 mt-8">
      <CardHeader className="bg-gray-50 border-b border-gray-200 flex flex-row justify-between items-center p-4">
        <CardTitle className="text-xl font-bold">Analysis Result</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy}
            className="border-gray-300 hover:bg-gray-100"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownload}
            className="border-gray-300 hover:bg-gray-100"
          >
            <Download size={16} />
            <span className="ml-2">Download</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div 
          ref={textRef}
          className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded border border-gray-200 max-h-[400px] overflow-y-auto"
        >
          {resultText}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
