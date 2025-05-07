
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const EmailCaptureForm = ({ onSubmit, isLoading }) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values) => {
    try {
      await fetch("https://formspree.io/f/xnnddewg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
    } catch (err) {
      console.error("Formspree error:", err);
    }

    // Continue showing estimator
    onSubmit(values.email);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
          Travel Nurse Take-Home Pay & Tax Estimator
        </h1>
      </div>

      <div className="flex justify-center items-center mb-6 space-x-6">
        <img
          src="/lovable-uploads/631e3d9e-b7db-4e1b-8772-1bfb4d3db5ce.png"
          alt="Travel nurse illustration"
          className="w-24 h-24"
        />
        <img
          src="/lovable-uploads/1f8a6d9e-656c-4254-b141-82d8edf42f09.png"
          alt="Calculator illustration" 
          className="w-24 h-24"
        />
      </div>

      <div className="text-center mb-5">
        <p className="text-gray-600 mb-6">
          See your estimated take-home pay and tax details for your contracts.
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
                    className="border-[#E5E7EB] bg-white text-black"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2 mb-10">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black border border-gray-200 h-12"
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
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EmailCaptureForm;
