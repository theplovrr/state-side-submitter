
import React from "react";
import { cn } from "@/lib/utils";

const ComparisonToggle = ({ checked, onCheckedChange }) => {
  return (
    <div className="flex items-center justify-center w-full max-w-md mx-auto">
      <div className="relative bg-[#F3F4F6] rounded-full p-1 w-full max-w-xs overflow-hidden border border-[#E5E7EB]">
        <div
          className={cn(
            "absolute top-0 left-0 h-full bg-white rounded-full shadow-sm transition-all duration-300 ease-in-out",
            checked ? "translate-x-[99%] w-1/2" : "translate-x-0 w-1/2"
          )}
        />
        
        <div className="relative flex">
          <button
            onClick={() => onCheckedChange(false)}
            className={cn(
              "flex-1 relative py-2 rounded-full text-sm font-medium z-10 transition-colors duration-200 hover:text-black cursor-pointer",
              !checked ? "text-black" : "text-[#6B7280]"
            )}
          >
            Compare States
          </button>
          
          <button
            onClick={() => onCheckedChange(true)}
            className={cn(
              "flex-1 relative py-2 rounded-full text-sm font-medium z-10 transition-colors duration-200 hover:text-black cursor-pointer",
              checked ? "text-black" : "text-[#6B7280]"
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
