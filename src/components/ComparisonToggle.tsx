
import React from "react";
import { cn } from "@/lib/utils";

interface ComparisonToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const ComparisonToggle = ({ checked, onCheckedChange }: ComparisonToggleProps) => {
  return (
    <div className="flex items-center justify-center w-full max-w-md mx-auto">
      <div className="relative bg-gray-100 rounded-full p-1 w-full max-w-xs overflow-hidden">
        <div
          className={cn(
            "absolute top-0 left-0 h-full bg-white rounded-full shadow-md transition-all duration-300 ease-in-out",
            checked ? "translate-x-[99%] w-1/2" : "translate-x-0 w-1/2"
          )}
        />
        
        <div className="relative flex">
          <button
            onClick={() => onCheckedChange(false)}
            className={cn(
              "flex-1 relative py-2 rounded-full text-sm font-medium z-10 transition-colors duration-200",
              !checked ? "text-gray-900" : "text-gray-500"
            )}
          >
            Compare States
          </button>
          
          <button
            onClick={() => onCheckedChange(true)}
            className={cn(
              "flex-1 relative py-2 rounded-full text-sm font-medium z-10 transition-colors duration-200",
              checked ? "text-gray-900" : "text-gray-500"
            )}
          >
            Compare Cities
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonToggle;
