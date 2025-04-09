
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
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-3">Get Your Personalized Take-Home Pay & Tax Breakdown</h2>
        <p className="text-gray-400">
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
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="you@example.com" 
                    className="border-gray-700 bg-gray-900 text-white focus:border-white focus:ring-white" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-200 text-black font-medium py-2 px-4"
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
        </form>
      </Form>
    </div>
  );
};

export default EmailCaptureForm;
