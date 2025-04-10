
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
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 pointer-events-none animate-fade-in">
        <img 
          src="/lovable-uploads/631e3d9e-b7db-4e1b-8772-1bfb4d3db5ce.png" 
          alt="Bird with suitcase" 
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="text-center mb-5">
        <h2 className="text-2xl font-bold text-black mb-2">Get Your Personalized Take-Home Pay & Tax Breakdown</h2>
        <p className="text-gray-600">
          Enter your email to unlock your estimated take-home pay and tax details for your contracts.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

          <div className="pt-1 relative">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-50 text-black border border-gray-200 font-medium py-3 px-4 h-12 rounded-md transition-colors"
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
            
            <div className="absolute -bottom-20 right-0 w-20 h-20 pointer-events-none animate-fade-in">
              <img 
                src="/lovable-uploads/1f8a6d9f-656c-4254-b141-82d8edf42f09.png" 
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
