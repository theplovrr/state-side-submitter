
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
    <Card className="w-full shadow-lg bg-black text-white border-gray-800">
      <CardHeader className="bg-black border-b border-gray-800">
        <CardTitle className="text-xl font-bold text-white">Job Offer {index}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium text-base">Weekly Salary (USD)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter weekly salary" 
                      value={formData.salary} 
                      onChange={(e) => handleChange("salary", e.target.value)}
                      className="border-gray-700 bg-gray-900 text-white focus:border-white focus:ring-white"
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
                  <FormLabel className="text-white font-medium text-base">State</FormLabel>
                  <Select
                    disabled={disabled}
                    value={formData.state}
                    onValueChange={(value) => handleChange("state", value)}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-700 bg-gray-900 text-white focus:border-white focus:ring-white">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black border-gray-700 text-white">
                      {states.map((state) => (
                        <SelectItem key={state} value={state} className="focus:bg-gray-800 focus:text-white">
                          {state}
                        </SelectItem>
                      ))}
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
