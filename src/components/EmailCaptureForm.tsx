import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

const EmailCaptureForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      await fetch("https://formspree.io/f/xnnddewg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      alert("Thanks! You're in — check your inbox.");
    } catch (err) {
      console.error(err);
      alert("Oops — something went wrong. Please try again.");
    }
  };

  const isLoading = form.formState.isSubmitting;

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
          Travel Nurse Take-Home Pay & Tax Estimator
        </h1>
      </div>

      <div className="flex justify-center items-center mb-6 space-x-6">
        <div className="w-24 h-24 pointer-events-none animate-fade-in hover:animate-pulse">
          <img
            src="/lovable-uploads/631e3d9e-b7db-4e1b-8772-1bfb4d3db5ce.png"
            alt="Plovrr mascot with suitcase"
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="w-24 h-24 pointer-events-none animate-fade-in hover:animate-pulse">
          <img
            src="/lovable-uploads/1f8a6d9f-656c-4254-b141-82d8edf42f09.png"
            alt="Plovrr mascot with luggage"
            className="w-full h-auto object-contain"
          />
        </div>
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
                    className="border-[#E5E7EB] bg-white text-black placeholder:text-[#9CA3AF] focus:border-gray-400 focus:ring-gray-400"
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
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EmailCaptureForm;

