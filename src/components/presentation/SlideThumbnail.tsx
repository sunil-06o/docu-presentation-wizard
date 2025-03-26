
import React from "react";
import SlideRenderer from "./SlideRenderer";

interface SlideThumbnailProps {
  slide: any;
  index: number;
  currentSlide: number;
  theme: string;
  onClick: () => void;
}

const SlideThumbnail: React.FC<SlideThumbnailProps> = ({
  slide,
  index,
  currentSlide,
  theme,
  onClick
}) => {
  return (
    <div 
      className={`flex-shrink-0 w-32 h-20 rounded border ${
        index === currentSlide ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'
      } cursor-pointer snap-center overflow-hidden transition-all hover:opacity-90`}
      onClick={onClick}
    >
      <div className="w-full h-full scale-[0.2] origin-top-left" style={{ transform: 'scale(0.2)', width: '500%', height: '500%' }}>
        <SlideRenderer 
          slide={slide} 
          index={index} 
          currentSlide={index} 
          theme={theme} 
        />
      </div>
    </div>
  );
};

export default SlideThumbnail;
