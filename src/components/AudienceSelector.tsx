
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Users, Briefcase, Code } from "lucide-react";

interface AudienceSelectorProps {
  audience: string;
  setAudience: (audience: string) => void;
}

const AudienceSelector: React.FC<AudienceSelectorProps> = ({ audience, setAudience }) => {
  const audienceOptions = [
    {
      id: "executive",
      name: "Executive",
      description: "High-level overview for executives and decision-makers",
      icon: <Briefcase className="h-10 w-10 text-indigo-600" />,
    },
    {
      id: "management",
      name: "Management",
      description: "Detailed information for managers and team leads",
      icon: <Users className="h-10 w-10 text-blue-600" />,
    },
    {
      id: "technical",
      name: "Technical",
      description: "In-depth details for technical team members",
      icon: <Code className="h-10 w-10 text-green-600" />,
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-6">Target Audience</h2>
      <p className="text-gray-600 mb-6">
        Select the target audience for your presentation to optimize content and style.
      </p>
      
      <RadioGroup 
        value={audience} 
        onValueChange={setAudience}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {audienceOptions.map((option) => (
          <div key={option.id} className="relative">
            <RadioGroupItem
              value={option.id}
              id={option.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={option.id}
              className="flex flex-col items-center p-6 bg-white border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary/30 peer-data-[state=checked]:shadow-md"
            >
              <div className="mb-4 opacity-85">{option.icon}</div>
              <h3 className="text-lg font-medium mb-2">{option.name}</h3>
              <p className="text-sm text-gray-500 text-center">{option.description}</p>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default AudienceSelector;
