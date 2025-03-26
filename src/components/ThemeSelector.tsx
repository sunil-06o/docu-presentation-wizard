
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ThemeSelectorProps {
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ theme, setTheme }) => {
  const themeOptions = [
    {
      id: "modern",
      name: "Modern",
      colors: ["#3B82F6", "#60A5FA", "#93C5FD"],
    },
    {
      id: "classic",
      name: "Classic",
      colors: ["#334155", "#64748B", "#94A3B8"],
    },
    {
      id: "minimal",
      name: "Minimal",
      colors: ["#18181B", "#71717A", "#D4D4D8"],
    },
    {
      id: "vibrant",
      name: "Vibrant",
      colors: ["#EC4899", "#F472B6", "#FBCFE8"],
    },
    {
      id: "corporate",
      name: "Corporate",
      colors: ["#1E40AF", "#3B82F6", "#93C5FD"],
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-6">Presentation Theme</h2>
      <p className="text-gray-600 mb-6">
        Choose a visual theme for your presentation slides.
      </p>
      
      <RadioGroup 
        value={theme} 
        onValueChange={setTheme}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        {themeOptions.map((option) => (
          <div key={option.id} className="relative">
            <RadioGroupItem
              value={option.id}
              id={`theme-${option.id}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`theme-${option.id}`}
              className="flex flex-col items-center p-4 bg-white border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary/30 peer-data-[state=checked]:shadow-md"
            >
              <div className="w-full h-20 rounded-lg overflow-hidden mb-3 flex">
                {option.colors.map((color, index) => (
                  <div 
                    key={index}
                    className="flex-1 h-full"
                    style={{ backgroundColor: color }}
                  ></div>
                ))}
              </div>
              <h3 className="text-base font-medium">{option.name}</h3>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ThemeSelector;
