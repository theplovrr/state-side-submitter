import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TypeaheadInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[] | { name: string; type: string }[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowFreeText?: boolean;
}

const TypeaheadInput = ({
  value,
  onChange,
  options,
  placeholder = "Search...",
  disabled = false,
  className,
  allowFreeText = false,
}: TypeaheadInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredOptions([]);
      return;
    }

    const isComplexOptions = typeof options[0] !== 'string';

    let filtered;
    if (isComplexOptions) {
      const typedOptions = options as { name: string; type: string }[];
      filtered = typedOptions.filter(option => 
        option.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      
      filtered.sort((a, b) => {
        if (a.type === 'state' && b.type !== 'state') return -1;
        if (a.type !== 'state' && b.type === 'state') return 1;
        return a.name.localeCompare(b.name);
      });
    } else {
      filtered = (options as string[]).filter(option => 
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
    }

    setFilteredOptions(filtered.slice(0, 8));
  }, [inputValue, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current && 
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(true);
    
    if (allowFreeText && newValue) {
      onChange(newValue);
    }
  };

  const handleSelectOption = (option: string | { name: string; type: string }) => {
    const value = typeof option === 'string' ? option : option.name;
    setInputValue(value);
    onChange(value);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-[#9CA3AF]" />
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pl-9 border-[#E5E7EB] bg-white text-black focus:border-black focus:ring-black pr-8 h-11 placeholder:text-[#9CA3AF]",
            className
          )}
        />
        {inputValue && (
          <button 
            type="button" 
            onClick={handleClear}
            className="absolute right-3 text-[#9CA3AF] hover:text-black"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showSuggestions && filteredOptions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-[#E5E7EB] rounded-md shadow-sm max-h-60 overflow-auto"
        >
          {filteredOptions.map((option, index) => {
            const isString = typeof option === 'string';
            const optionValue = isString ? option : option.name;
            const optionType = isString ? null : option.type;
            
            return (
              <div
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-[#F3F4F6] flex justify-between items-center"
                onClick={() => handleSelectOption(option)}
              >
                <span>{optionValue}</span>
                {optionType && (
                  <span className="text-xs text-[#6B7280] ml-2">
                    ({optionType})
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TypeaheadInput;
