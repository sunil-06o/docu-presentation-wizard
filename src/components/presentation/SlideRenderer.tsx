
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
      return "bg-gradient-to-br from-pink-50 via-pink-100 to-white";
    case "corporate":
      return "bg-gradient-to-br from-blue-100 via-blue-50 to-white";
    default:
      return "bg-white";
  }
};

const getAccentColor = (theme: string): string => {
  switch (theme) {
    case "modern":
      return "border-blue-500 text-blue-800";
    case "classic":
      return "border-gray-700 text-gray-800";
    case "minimal":
      return "border-black text-black";
    case "vibrant":
      return "border-pink-500 text-pink-800";
    case "corporate":
      return "border-blue-700 text-blue-800";
    default:
      return "border-primary text-primary";
  }
};

const renderSlideContent = (slide: any, slideClasses: string, accentColor: string) => {
  const textColor = accentColor.split(" ")[1] || "text-gray-800";
  
  switch (slide.type) {
    case "title":
      return (
        <div className={`w-full h-full flex flex-col items-center justify-center text-center p-12 ${slideClasses}`}>
          <h1 className={`text-4xl font-bold mb-6 ${textColor}`}>{slide.title}</h1>
          <p className="text-xl text-gray-600 max-w-2xl">{slide.subtitle}</p>
        </div>
      );
    case "agenda":
      return (
        <div className={`w-full h-full p-12 ${slideClasses}`}>
          <h2 className={`text-3xl font-bold mb-8 border-b-2 pb-2 ${accentColor}`}>{slide.title}</h2>
          <ul className="space-y-5 max-w-4xl mx-auto">
            {slide.items.map((item: string, idx: number) => (
              <li key={idx} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-4 ${accentColor.replace('border', 'bg').replace('text', 'bg')}`}></div>
                <span className="text-xl">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "content":
      return (
        <div className={`w-full h-full p-12 ${slideClasses}`}>
          <h2 className={`text-3xl font-bold mb-8 border-b-2 pb-2 ${accentColor}`}>{slide.title}</h2>
          <div className="max-w-4xl mx-auto">
            <ul className="space-y-5">
              {slide.content.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <div className={`w-3 h-3 rounded-full mr-4 mt-2 ${accentColor.replace('border', 'bg').replace('text', 'bg')}`}></div>
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "chart":
      return (
        <div className={`w-full h-full p-12 ${slideClasses}`}>
          <h2 className={`text-3xl font-bold mb-8 border-b-2 pb-2 ${accentColor}`}>{slide.title}</h2>
          <div className="w-full max-w-4xl mx-auto h-64 bg-white/70 rounded-lg border border-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Chart visualization will appear here</p>
          </div>
        </div>
      );
    case "thanks":
      return (
        <div className={`w-full h-full flex flex-col items-center justify-center text-center p-12 ${slideClasses}`}>
          <h1 className={`text-4xl font-bold mb-6 ${textColor}`}>{slide.title}</h1>
          <p className="text-xl text-gray-600 max-w-2xl">{slide.subtitle}</p>
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
