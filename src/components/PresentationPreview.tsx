
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Edit,
  Share,
  Copy
} from "lucide-react";
import { generateSlidesFromContent } from "@/utils/fileUtils";

interface PresentationPreviewProps {
  file: any;
  audience: string;
  theme: string;
  onDownload: () => void;
}

const PresentationPreview: React.FC<PresentationPreviewProps> = ({
  file,
  audience,
  theme,
  onDownload
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slides, setSlides] = useState<any[]>([]);
  
  useEffect(() => {
    if (file && file.content) {
      // Generate slides based on actual file content
      const generatedSlides = generateSlidesFromContent(file.content, audience);
      setSlides(generatedSlides);
    } else {
      // Fallback to default slides if no content is available
      setSlides([
        {
          type: "title",
          title: "Generated Presentation",
          subtitle: "Based on your document",
        },
        {
          type: "content",
          title: "No Content Available",
          content: [
            "File content could not be extracted",
            "Please try uploading a different file",
            "Or check if the file format is supported",
            "Supported formats: PDF, DOCX, TXT"
          ]
        },
        {
          type: "thanks",
          title: "Thank You",
          subtitle: "Questions & Discussion",
        }
      ]);
    }
  }, [file, audience]);

  const totalSlides = slides.length;

  const navigateSlide = (direction: number) => {
    let newIndex = currentSlide + direction;
    
    if (newIndex < 0) {
      newIndex = totalSlides - 1;
    } else if (newIndex >= totalSlides) {
      newIndex = 0;
    }
    
    setCurrentSlide(newIndex);
  };

  const getSlideBackground = () => {
    switch (theme) {
      case "modern":
        return "bg-gradient-to-br from-blue-50 to-white";
      case "classic":
        return "bg-gray-50";
      case "minimal":
        return "bg-white";
      case "vibrant":
        return "bg-gradient-to-br from-pink-50 to-white";
      case "corporate":
        return "bg-gradient-to-br from-blue-100 to-white";
      default:
        return "bg-white";
    }
  };

  const getAccentColor = () => {
    switch (theme) {
      case "modern":
        return "border-blue-500";
      case "classic":
        return "border-gray-700";
      case "minimal":
        return "border-black";
      case "vibrant":
        return "border-pink-500";
      case "corporate":
        return "border-blue-700";
      default:
        return "border-primary";
    }
  };

  const renderSlideContent = (slide: any, index: number) => {
    const isCurrentSlide = index === currentSlide;
    const slideClasses = getSlideBackground();
    const accentColor = getAccentColor();
    
    switch (slide.type) {
      case "title":
        return (
          <div className={`w-full h-full flex flex-col items-center justify-center text-center p-10 ${slideClasses}`}>
            <h1 className="text-4xl font-bold mb-4">{slide.title}</h1>
            <p className="text-xl text-gray-600">{slide.subtitle}</p>
          </div>
        );
      case "agenda":
        return (
          <div className={`w-full h-full p-10 ${slideClasses}`}>
            <h2 className={`text-3xl font-bold mb-6 border-b-2 pb-2 ${accentColor}`}>{slide.title}</h2>
            <ul className="space-y-3">
              {slide.items.map((item: string, idx: number) => (
                <li key={idx} className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${accentColor.replace('border', 'bg')}`}></div>
                  <span className="text-xl">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case "content":
        return (
          <div className={`w-full h-full p-10 ${slideClasses}`}>
            <h2 className={`text-3xl font-bold mb-6 border-b-2 pb-2 ${accentColor}`}>{slide.title}</h2>
            <ul className="space-y-4">
              {slide.content.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <div className={`w-2 h-2 rounded-full mr-3 mt-2 ${accentColor.replace('border', 'bg')}`}></div>
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case "chart":
        return (
          <div className={`w-full h-full p-10 ${slideClasses}`}>
            <h2 className={`text-3xl font-bold mb-6 border-b-2 pb-2 ${accentColor}`}>{slide.title}</h2>
            <div className="w-full h-64 bg-white/50 rounded-lg border border-gray-200 flex items-center justify-center">
              <p className="text-gray-500">Chart visualization will appear here</p>
            </div>
          </div>
        );
      case "thanks":
        return (
          <div className={`w-full h-full flex flex-col items-center justify-center text-center p-10 ${slideClasses}`}>
            <h1 className="text-4xl font-bold mb-4">{slide.title}</h1>
            <p className="text-xl text-gray-600">{slide.subtitle}</p>
          </div>
        );
      default:
        return (
          <div className={`w-full h-full flex items-center justify-center ${slideClasses}`}>
            <p>Slide content not available</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Presentation Preview</h2>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Share className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button 
            size="sm" 
            className="flex items-center gap-1"
            onClick={onDownload}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{file ? file.name : "Presentation"}</span> • {audience} audience • {theme} theme
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Slide {currentSlide + 1} of {totalSlides}
            </span>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => navigateSlide(-1)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={() => navigateSlide(1)}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative">
          {slides.map((slide, index) => (
            <div 
              key={index} 
              className={`w-full h-full absolute transition-opacity duration-300 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {renderSlideContent(slide, index)}
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex overflow-x-auto pb-4 gap-3 snap-x">
            {slides.map((slide, index) => (
              <div 
                key={index}
                className={`flex-shrink-0 w-32 h-20 rounded border ${
                  index === currentSlide ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
                } cursor-pointer snap-center overflow-hidden transition-all hover:opacity-90`}
                onClick={() => setCurrentSlide(index)}
              >
                <div className="w-full h-full scale-[0.2] origin-top-left" style={{ transform: 'scale(0.2)', width: '500%', height: '500%' }}>
                  {renderSlideContent(slide, index)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationPreview;
