
import React from "react";

interface SlideRendererProps {
  slide: any;
  index: number;
  currentSlide: number;
  theme: string;
}

const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  index,
  currentSlide,
  theme,
}) => {
  const isCurrentSlide = index === currentSlide;
  const slideClasses = getSlideBackground(theme);
  const accentColor = getAccentColor(theme);
  
  return (
    <div 
      className={`w-full h-full absolute transition-opacity duration-300 ${
        isCurrentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
      }`}
    >
      {renderSlideContent(slide, slideClasses, accentColor)}
    </div>
  );
};

const getSlideBackground = (theme: string): string => {
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

const getAccentColor = (theme: string): string => {
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

const renderSlideContent = (slide: any, slideClasses: string, accentColor: string) => {
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

export default SlideRenderer;
