
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="w-full shadow-lg bg-black text-white border-gray-800 mt-8">
      <CardHeader className="bg-black border-b border-gray-800 flex flex-row justify-between items-center p-4">
        <CardTitle className="text-xl font-bold text-white">Analysis Result</CardTitle>
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
    </Card>
  );
};

export default ResultDisplay;
