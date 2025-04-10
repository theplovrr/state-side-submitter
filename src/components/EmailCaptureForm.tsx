
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailCaptureFormProps = {
  onSubmit: (email: string) => void;
  isLoading: boolean;
};

const EmailCaptureForm = ({ onSubmit, isLoading }: EmailCaptureFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.email);
  };

  return (
    <div className="max-w-md mx-auto relative">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-24 h-24 pointer-events-none animate-fade-in">
        <img 
          src="/lovable-uploads/bird-suitcase.png" 
          alt="Bird with suitcase" 
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-black mb-3">Get Your Personalized Take-Home Pay & Tax Breakdown</h2>
        <p className="text-gray-600">
          Enter your email to unlock your estimated take-home pay and tax details for your contracts.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="you@example.com" 
                    className="border-[#E5E7EB] bg-white text-black placeholder:text-[#9CA3AF] focus:border-gray-400 focus:ring-gray-400" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2 relative">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 h-12"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin mr-2" size={18} />
                  Crunching the numbers...
                </span>
              ) : (
                "Show Me My Results"
              )}
            </Button>
            
            <div className="absolute -bottom-24 right-0 w-20 h-20 pointer-events-none animate-fade-in">
              <img 
                src="/lovable-uploads/bird-travel.png" 
                alt="Bird with travel bags" 
                className="w-full h-auto object-contain transform scale-x-[-1]"
                style={{ transform: 'scaleX(-1)' }}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EmailCaptureForm;
