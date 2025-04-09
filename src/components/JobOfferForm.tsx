
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

// List of all US states
const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
  "New Hampshire", "New Jersey", "New Mexico", "New York", 
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
  "West Virginia", "Wisconsin", "Wyoming"
];

const JobOfferForm = ({ 
  index, 
  formData, 
  setFormData, 
  disabled = false 
}) => {
  const form = useForm({
    defaultValues: formData
  });

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
  };

  return (
    <Card className="w-full shadow-md bg-white border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-bold">Job Offer {index}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Company Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter company name" 
                      value={formData.company} 
                      onChange={(e) => handleChange("company", e.target.value)}
                      className="border-gray-300 focus:border-black focus:ring-black"
                      disabled={disabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Position Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter position title" 
                      value={formData.position} 
                      onChange={(e) => handleChange("position", e.target.value)}
                      className="border-gray-300 focus:border-black focus:ring-black"
                      disabled={disabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">State</FormLabel>
                  <Select
                    disabled={disabled}
                    value={formData.state}
                    onValueChange={(value) => handleChange("state", value)}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300 focus:border-black focus:ring-black">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Annual Salary (USD)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter annual salary" 
                      value={formData.salary} 
                      onChange={(e) => handleChange("salary", e.target.value)}
                      className="border-gray-300 focus:border-black focus:ring-black"
                      disabled={disabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Benefits</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Health insurance, retirement, etc." 
                      value={formData.benefits} 
                      onChange={(e) => handleChange("benefits", e.target.value)}
                      className="border-gray-300 focus:border-black focus:ring-black"
                      disabled={disabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Remote Work Options</FormLabel>
                  <Select
                    disabled={disabled}
                    value={formData.remote}
                    onValueChange={(value) => handleChange("remote", value)}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-300 focus:border-black focus:ring-black">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fully_remote">Fully Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="in_office">In Office</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default JobOfferForm;
