
import React from "react";

interface SlideRendererProps {
  slide: any;
  index: number;
  currentSlide: number;
  theme: string;
  fontSize?: string;
  textColor?: string;
}

const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  index,
  currentSlide,
  theme,
  fontSize = "medium",
  textColor,
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
      {renderSlideContent(slide, slideClasses, accentColor, fontSize, textColor)}
    </div>
  );
};

const getSlideBackground = (theme: string): string => {
  switch (theme) {
    case "modern":
      return "bg-gradient-to-br from-blue-50 to-white dark:slide-bg-modern";
    case "classic":
      return "bg-gray-50 dark:slide-bg-classic";
    case "minimal":
      return "bg-white dark:slide-bg-minimal";
    case "vibrant":
      return "bg-gradient-to-br from-pink-50 via-pink-100 to-white dark:slide-bg-vibrant";
    case "corporate":
      return "bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:slide-bg-corporate";
    default:
      return "bg-white dark:bg-gray-900";
  }
};

const getAccentColor = (theme: string): string => {
  switch (theme) {
    case "modern":
      return "border-blue-500 text-blue-800 dark:border-blue-400 dark:text-blue-300";
    case "classic":
      return "border-gray-700 text-gray-800 dark:border-gray-400 dark:text-gray-300";
    case "minimal":
      return "border-black text-black dark:border-white dark:text-white";
    case "vibrant":
      return "border-pink-500 text-pink-800 dark:border-pink-400 dark:text-pink-300";
    case "corporate":
      return "border-blue-700 text-blue-800 dark:border-blue-500 dark:text-blue-300";
    default:
      return "border-primary text-primary";
  }
};

const getFontSizeClass = (fontSize: string, type: "title" | "subtitle" | "content") => {
  if (type === "title") {
    return fontSize === "small" ? "text-3xl" : fontSize === "large" ? "text-5xl" : "text-4xl";
  } else if (type === "subtitle") {
    return fontSize === "small" ? "text-lg" : fontSize === "large" ? "text-2xl" : "text-xl";
  } else {
    return fontSize === "small" ? "text-base" : fontSize === "large" ? "text-xl" : "text-lg";
  }
};

const renderSlideContent = (
  slide: any, 
  slideClasses: string, 
  accentColor: string, 
  fontSize: string,
  textColor?: string
) => {
  const textColorStyle = textColor ? { color: textColor } : {};
  const titleSizeClass = getFontSizeClass(fontSize, "title");
  const subtitleSizeClass = getFontSizeClass(fontSize, "subtitle");
  const contentSizeClass = getFontSizeClass(fontSize, "content");
  
  switch (slide.type) {
    case "title":
      return (
        <div className={`w-full h-full flex flex-col items-center justify-center text-center p-12 ${slideClasses}`}>
          <h1 
            className={`${titleSizeClass} font-bold mb-6 ${accentColor}`}
            style={textColorStyle}
          >
            {slide.title}
          </h1>
          <p 
            className={`${subtitleSizeClass} text-gray-600 dark:text-gray-300 max-w-2xl`}
            style={textColorStyle}
          >
            {slide.subtitle}
          </p>
        </div>
      );
    case "agenda":
      return (
        <div className={`w-full h-full p-12 ${slideClasses}`}>
          <h2 
            className={`${titleSizeClass} font-bold mb-8 border-b-2 pb-2 ${accentColor}`}
            style={textColorStyle}
          >
            {slide.title}
          </h2>
          <ul className="space-y-5 max-w-4xl mx-auto">
            {slide.items.map((item: string, idx: number) => (
              <li key={idx} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-4 ${accentColor.replace('border', 'bg').replace('text', 'bg')}`}></div>
                <span 
                  className={contentSizeClass}
                  style={textColorStyle}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "content":
      return (
        <div className={`w-full h-full p-12 ${slideClasses}`}>
          <h2 
            className={`${titleSizeClass} font-bold mb-8 border-b-2 pb-2 ${accentColor}`}
            style={textColorStyle}
          >
            {slide.title}
          </h2>
          <div className="max-w-4xl mx-auto">
            <ul className="space-y-5">
              {slide.content.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start">
                  <div className={`w-3 h-3 rounded-full mr-4 mt-2 ${accentColor.replace('border', 'bg').replace('text', 'bg')}`}></div>
                  <span 
                    className={contentSizeClass}
                    style={textColorStyle}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    case "chart":
      return (
        <div className={`w-full h-full p-12 ${slideClasses}`}>
          <h2 
            className={`${titleSizeClass} font-bold mb-8 border-b-2 pb-2 ${accentColor}`}
            style={textColorStyle}
          >
            {slide.title}
          </h2>
          <div className="w-full max-w-4xl mx-auto h-64 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Chart visualization will appear here</p>
          </div>
        </div>
      );
    case "thanks":
      return (
        <div className={`w-full h-full flex flex-col items-center justify-center text-center p-12 ${slideClasses}`}>
          <h1 
            className={`${titleSizeClass} font-bold mb-6 ${accentColor}`}
            style={textColorStyle}
          >
            {slide.title}
          </h1>
          <p 
            className={`${subtitleSizeClass} text-gray-600 dark:text-gray-300 max-w-2xl`}
            style={textColorStyle}
          >
            {slide.subtitle}
          </p>
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
