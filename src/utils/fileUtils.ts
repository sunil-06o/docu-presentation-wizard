
// Import PDF.js library
import * as pdfjs from 'pdfjs-dist';
import { getDocument } from 'pdfjs-dist';
import { 
  extractPdfContentWithLimit, 
  summarizeText, 
  createTextFileFromExtractedContent,
  getDocumentTitle
} from './pdfExtractor';

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const validateFileType = (file: File): boolean => {
  const validTypes = [
    'application/pdf', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    'text/plain'
  ];
  return validTypes.includes(file.type);
};

export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const getFileTypeFromExtension = (extension: string): string => {
  const extensionMap: {[key: string]: string} = {
    'pdf': 'PDF Document',
    'docx': 'Word Document',
    'txt': 'Text File',
  };
  
  return extensionMap[extension.toLowerCase()] || 'Unknown File Type';
};

// Function to extract text from PDF files using our improved extractor
const extractPdfContent = async (file: File): Promise<{ text: string, downloadInfo?: { url: string, fileName: string }, pages: any[] }> => {
  try {
    const extractedPages = await extractPdfContentWithLimit(file, 250);
    let fullText = '';
    
    extractedPages.forEach(page => {
      fullText += `--- Page ${page.pageNumber} ---\n${page.text}\n\n`;
    });
    
    // Create downloadable text file
    const downloadInfo = createTextFileFromExtractedContent(extractedPages, file.name);
    
    return {
      text: fullText || `[PDF content extraction completed: ${file.name}]`,
      downloadInfo,
      pages: extractedPages
    };
  } catch (error) {
    console.error('Error extracting PDF content:', error);
    return {
      text: `[Error extracting content from ${file.name}. The PDF might be encrypted, damaged, or uses unsupported features.]`,
      pages: []
    };
  }
};

// Function to extract text from DOCX files using JSZip
const extractDocxContent = async (file: File): Promise<{ text: string, downloadInfo?: { url: string, fileName: string } }> => {
  try {
    // This is a simplified approach. For production, consider using a dedicated DOCX parser
    const arrayBuffer = await file.arrayBuffer();
    const textDecoder = new TextDecoder('utf-8');
    
    // Note: This simple extraction looks for XML content and tries to extract text
    // It's not a complete solution but works for basic DOCX files
    const content = textDecoder.decode(arrayBuffer);
    
    // Look for text content between XML tags, focusing on paragraphs
    const textMatches = content.match(/<w:t>(.*?)<\/w:t>/g) || [];
    const extractedText = textMatches
      .map(match => match.replace(/<\/?w:t>/g, ''))
      .join(' ');
    
    // Create downloadable text file
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const textFileName = file.name.split('.')[0] + '_extracted.txt';
    
    return {
      text: extractedText || `[DOCX content extracted from ${file.name}]`,
      downloadInfo: { url, fileName: textFileName }
    };
  } catch (error) {
    console.error('Error extracting DOCX content:', error);
    return {
      text: `[Error extracting content from ${file.name}. The DOCX file might be damaged or uses unsupported features.]`
    };
  }
};

// Function to extract text from plain text files
const extractTxtContent = async (file: File): Promise<{ text: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve({
          text: e.target.result as string
        });
      } else {
        reject(new Error("Failed to read text file"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading text file"));
    reader.readAsText(file);
  });
};

// Main function to extract content from various file types
export const extractFileContent = async (file: File): Promise<{
  text: string,
  downloadInfo?: { url: string, fileName: string },
  pages?: any[],
  title?: string
}> => {
  try {
    let result;
    
    if (file.type === 'application/pdf') {
      result = await extractPdfContent(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      result = await extractDocxContent(file);
    } else if (file.type === 'text/plain') {
      result = await extractTxtContent(file);
    } else {
      // Fallback for unsupported file types
      const fileExtension = getFileExtension(file.name);
      const fileType = getFileTypeFromExtension(fileExtension);
      return {
        text: `[Unsupported file type: ${fileType}]\n\nFile Details:\nName: ${file.name}\nSize: ${formatFileSize(file.size)}\nType: ${file.type}`
      };
    }
    
    // Extract document title
    const documentTitle = getDocumentTitle(result.text);
    
    return {
      ...result,
      title: documentTitle
    };
  } catch (error) {
    console.error('Error extracting file content:', error);
    return {
      text: `[Error extracting content from ${file.name}]`
    };
  }
};

// Generate slides from content with better summarization
export const generateSlidesFromContent = (content: string, audience: string, documentTitle?: string): any[] => {
  // Split content into pages and paragraphs
  const pages = content.split('---').filter(page => page.trim().length > 0);
  
  // Extract title from document title or first page
  const title = documentTitle || getDocumentTitle(pages[0]) || "Document Presentation";
  
  // Create a subtitle based on audience
  const subtitle = `Prepared for ${audience.charAt(0).toUpperCase() + audience.slice(1)} Audience`;
  
  // Summarize the entire content
  const fullText = pages.join(' ');
  const summaryPoints = summarizeText(fullText, 15, 150);
  
  // Group summary points into content sections
  const contentSections: string[][] = [];
  let currentSection: string[] = [];
  
  summaryPoints.forEach((point, index) => {
    if (currentSection.length >= 4 || (index > 0 && index % 4 === 0)) {
      if (currentSection.length > 0) {
        contentSections.push([...currentSection]);
        currentSection = [];
      }
    }
    currentSection.push(point);
  });
  
  // Add any remaining content as the final section
  if (currentSection.length > 0) {
    contentSections.push(currentSection);
  }
  
  // Create additional sections if we don't have enough
  while (contentSections.length < 3) {
    contentSections.push([
      "Additional content from document",
      "Supplementary information",
      "Relevant points and observations",
      "For further reference"
    ]);
  }
  
  // Generate slides based on the summarized content
  const slides: any[] = [
    {
      type: "title",
      title: title.substring(0, 150),
      subtitle: subtitle,
    }
  ];
  
  // Add agenda slide with meaningful section titles
  const sectionTitles = contentSections.map((section, index) => {
    // Try to create a meaningful title from the first point
    const firstPoint = section[0];
    // Extract first few words for a title
    const words = firstPoint.split(' ').slice(0, 4).join(' ');
    return words || `Section ${index + 1}`;
  });
  
  slides.push({
    type: "agenda",
    title: "Agenda",
    items: sectionTitles.slice(0, 5).map(title => title.substring(0, 150))
  });
  
  // Add content slides
  contentSections.forEach((section, index) => {
    slides.push({
      type: "content",
      title: sectionTitles[index].substring(0, 150),
      content: section.map(item => item.substring(0, 150))
    });
  });
  
  // Add a chart slide if we have space (for data visualization)
  if (slides.length < 5) {
    slides.push({
      type: "chart",
      title: "Key Data Points",
      chartType: "bar"
    });
  }
  
  // Add a thank you slide
  slides.push({
    type: "thanks",
    title: "Thank You",
    subtitle: "Questions & Discussion",
  });
  
  // Ensure we have at least 5 slides
  if (slides.length < 5) {
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
    while (slides.length < 5) {
      // Insert before the thank you slide
      slides.splice(slides.length - 1, 0, extraSlides[slides.length % 2]);
    }
  }
  
  return slides;
};

// Improved function to generate a PowerPoint file (still simulated)
export const generatePowerPointFile = (slides: any[], theme: string, fileName: string): Blob => {
  // This is a simplified version - in a real implementation, you would use a library like pptxgenjs
  
  // For demonstration purposes, we'll create a text file with the content
  const content = slides.map(slide => {
    let slideContent = `=== ${slide.type.toUpperCase()} SLIDE ===\n`;
    
    if (slide.title) {
      slideContent += `Title: ${slide.title}\n`;
    }
    
    if (slide.subtitle) {
      slideContent += `Subtitle: ${slide.subtitle}\n`;
    }
    
    if (slide.content) {
      slideContent += `Content: ${slide.content.join('\n- ')}\n`;
    }
    
    if (slide.items) {
      slideContent += `Items: ${slide.items.join('\n- ')}\n`;
    }
    
    return slideContent;
  }).join('\n\n');
  
  const summaryInfo = `
Presentation Summary:
Title: ${slides[0].title || "Untitled Presentation"}
Theme: ${theme}
Total Slides: ${slides.length}
Generated from: ${fileName}
  `;
  
  return new Blob([summaryInfo, '\n\n', content], { type: 'text/plain' });
};
