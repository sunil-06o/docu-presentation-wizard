
import { useState, useEffect } from "react";
import { generateSlidesFromContent } from "@/utils/fileUtils";

interface SlideHookProps {
  file: any;
  audience: string;
}

export function usePresentationSlides({ file, audience }: SlideHookProps) {
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

  const navigateSlide = (direction: number) => {
    let newIndex = currentSlide + direction;
    
    if (newIndex < 0) {
      newIndex = slides.length - 1;
    } else if (newIndex >= slides.length) {
      newIndex = 0;
    }
    
    setCurrentSlide(newIndex);
  };

  return {
    slides,
    currentSlide,
    setCurrentSlide,
    navigateSlide,
    totalSlides: slides.length
  };
}
