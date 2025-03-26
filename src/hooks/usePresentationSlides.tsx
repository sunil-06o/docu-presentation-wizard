
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
      
      // Ensure we have at least 5 slides
      if (generatedSlides.length < 5) {
        // Add extra content slides if needed
        const extraSlides = [
          {
            type: "content",
            title: "Additional Information",
            content: [
              "This slide contains supplementary content",
              "Related to the main topic of the presentation",
              "Providing further context and details",
              "For a comprehensive understanding"
            ]
          },
          {
            type: "chart",
            title: "Data Visualization",
            chartType: "bar"
          }
        ];
        
        // Add extra slides until we have at least 5
        while (generatedSlides.length < 5) {
          // Insert before the thank you slide
          generatedSlides.splice(generatedSlides.length - 1, 0, extraSlides[generatedSlides.length % 2]);
        }
      }
      
      setSlides(generatedSlides);
    } else {
      // Default slides if no content is available
      setSlides([
        {
          type: "title",
          title: "Generated Presentation",
          subtitle: "Based on your document",
        },
        {
          type: "agenda",
          title: "Agenda",
          items: [
            "Introduction",
            "Key Points",
            "Data Analysis",
            "Conclusions",
            "Next Steps"
          ]
        },
        {
          type: "content",
          title: "Introduction",
          content: [
            "Overview of the topic",
            "Background information",
            "Context and relevance",
            "Main objectives"
          ]
        },
        {
          type: "content",
          title: "Key Findings",
          content: [
            "Analysis of the data",
            "Important discoveries",
            "Patterns identified",
            "Implications of findings"
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
