
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import TypeaheadInput from "./TypeaheadInput";

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

// Example cities for demonstration
const majorCities = [
  "New York City", "Los Angeles", "Chicago", "Houston", "Phoenix", 
  "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
  "Austin", "Jacksonville", "Fort Worth", "Columbus", "Indianapolis",
  "Charlotte", "San Francisco", "Seattle", "Denver", "Washington DC",
  "Boston", "El Paso", "Nashville", "Detroit", "Portland",
  "Las Vegas", "Oklahoma City", "Memphis", "Louisville", "Baltimore",
  "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Sacramento",
  "Kansas City", "Long Beach", "Mesa", "Atlanta", "Colorado Springs",
  "Raleigh", "Omaha", "Miami", "Tampa", "Minneapolis",
  "New Orleans", "Cleveland", "Honolulu", "Arlington", "Bakersfield"
];

// Combined locations with type indicators
const locations = [
  ...states.map(state => ({ name: state, type: "state" })),
  ...majorCities.map(city => ({ name: city, type: "city" }))
];

const JobOfferForm = ({ 
  index, 
  formData, 
  setFormData, 
  disabled = false,
  optional = false,
  placeholderText = "Type to search locations..."
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
        <CardTitle className="text-xl font-bold text-white flex items-center justify-between">
          <span>Travel Contract Destination {index}</span>
          {optional && <span className="text-gray-400 text-sm font-normal">(Optional)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium text-base">Estimated Weekly Pay (Total package)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Enter weekly pay amount" 
                      value={formData.salary} 
                      onChange={(e) => handleChange("salary", e.target.value)}
                      className="border-gray-700 bg-gray-900 text-white focus:border-white focus:ring-white"
                      disabled={disabled}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400 text-sm">
                    Total package: base pay + stipends.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium text-base">Contract Location</FormLabel>
                  <FormControl>
                    <TypeaheadInput
                      value={formData.state}
                      onChange={(value) => handleChange("state", value)}
                      options={locations}
                      placeholder={placeholderText}
                      disabled={disabled}
                      allowFreeText={true}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400 text-sm">
                    Enter destination — we'll handle taxes and cost of living.
                  </FormDescription>
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
