
import React, { useEffect, useState } from "react";
import SlideRenderer from "./presentation/SlideRenderer";
import SlideThumbnail from "./presentation/SlideThumbnail";
import SlideControls from "./presentation/SlideControls";
import PresentationActions from "./presentation/PresentationActions";
import PresentationEditor from "./presentation/PresentationEditor";
import { usePresentationSlides } from "@/hooks/usePresentationSlides";

interface PresentationPreviewProps {
  file: any;
  audience: string;
  theme: string;
  onThemeChange: (theme: string) => void;
  onDownload: () => void;
  onSlidesGenerated?: (slides: any[]) => void;
}

const PresentationPreview: React.FC<PresentationPreviewProps> = ({
  file,
  audience,
  theme,
  onThemeChange,
  onDownload,
  onSlidesGenerated
}) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editHistory, setEditHistory] = useState<any[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  
  const { 
    slides, 
    currentSlide, 
    setCurrentSlide, 
    navigateSlide, 
    totalSlides,
    setSlides
  } = usePresentationSlides({ file, audience });

  useEffect(() => {
    if (slides.length > 0 && onSlidesGenerated) {
      onSlidesGenerated(slides);
    }
  }, [slides, onSlidesGenerated]);

  useEffect(() => {
    if (slides.length > 0 && historyIndex === -1) {
      // Initialize history when slides are first loaded
      setEditHistory([JSON.parse(JSON.stringify(slides))]);
      setHistoryIndex(0);
    }
  }, [slides, historyIndex]);

  const handleSlideUpdate = (slideIndex: number, updatedSlide: any) => {
    const newSlides = [...slides];
    newSlides[slideIndex] = updatedSlide;
    
    // Add to history
    const newHistory = editHistory.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newSlides)));
    
    setSlides(newSlides);
    setEditHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setSlides(JSON.parse(JSON.stringify(editHistory[newIndex])));
    }
  };

  const handleRedo = () => {
    if (historyIndex < editHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setSlides(JSON.parse(JSON.stringify(editHistory[newIndex])));
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold dark:text-white">Presentation Preview</h2>
        <PresentationActions 
          onDownload={onDownload} 
          onEdit={toggleEditMode} 
          isEditing={editMode}
        />
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors duration-200">
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">{file ? file.name : "Presentation"}</span> • {audience} audience • {theme} theme
          </div>
          
          <SlideControls 
            currentSlide={currentSlide} 
            totalSlides={totalSlides}
            onNavigate={navigateSlide}
          />
        </div>
        
        <div className="w-full aspect-[16/9] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm relative">
          {slides.map((slide, index) => (
            <SlideRenderer 
              key={index}
              slide={slide}
              index={index}
              currentSlide={currentSlide}
              theme={theme}
            />
          ))}
        </div>
        
        {editMode && (
          <div className="mt-6">
            <PresentationEditor
              slides={slides}
              currentSlide={currentSlide}
              theme={theme}
              onThemeChange={onThemeChange}
              onSlideUpdate={handleSlideUpdate}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < editHistory.length - 1}
            />
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto pb-4 gap-3 snap-x">
            {slides.map((slide, index) => (
              <SlideThumbnail
                key={index}
                slide={slide}
                index={index}
                currentSlide={currentSlide}
                theme={theme}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationPreview;
