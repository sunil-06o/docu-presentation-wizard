
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideControlsProps {
  currentSlide: number;
  totalSlides: number;
  onNavigate: (direction: number) => void;
}

const SlideControls: React.FC<SlideControlsProps> = ({
  currentSlide,
  totalSlides,
  onNavigate
}) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-500">
        Slide {currentSlide + 1} of {totalSlides}
      </span>
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => onNavigate(-1)}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={() => onNavigate(1)}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default SlideControls;
