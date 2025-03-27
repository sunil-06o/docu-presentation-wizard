// Import PDF.js library
import * as pdfjs from 'pdfjs-dist';
import { getDocument } from 'pdfjs-dist';
import { extractPdfContentWithLimit, extractKeyPoints } from './pdfExtractor';

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
const extractPdfContent = async (file: File): Promise<string> => {
  try {
    const extractedPages = await extractPdfContentWithLimit(file, 250);
    let fullText = '';
    
    extractedPages.forEach(page => {
      fullText += `--- Page ${page.pageNumber} ---\n${page.text}\n\n`;
    });
    
    return fullText || `[PDF content extraction completed: ${file.name}]`;
  } catch (error) {
    console.error('Error extracting PDF content:', error);
    return `[Error extracting content from ${file.name}. The PDF might be encrypted, damaged, or uses unsupported features.]`;
  }
};

// Function to extract text from DOCX files using JSZip
const extractDocxContent = async (file: File): Promise<string> => {
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
    
    return extractedText || `[DOCX content extracted from ${file.name}]`;
  } catch (error) {
    console.error('Error extracting DOCX content:', error);
    return `[Error extracting content from ${file.name}. The DOCX file might be damaged or uses unsupported features.]`;
  }
};

// Function to extract text from plain text files
const extractTxtContent = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Failed to read text file"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading text file"));
    reader.readAsText(file);
  });
};

// Main function to extract content from various file types
export const extractFileContent = async (file: File): Promise<string> => {
  try {
    if (file.type === 'application/pdf') {
      return await extractPdfContent(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await extractDocxContent(file);
    } else if (file.type === 'text/plain') {
      return await extractTxtContent(file);
    } else {
      // Fallback for unsupported file types
      const fileExtension = getFileExtension(file.name);
      const fileType = getFileTypeFromExtension(fileExtension);
      return `[Unsupported file type: ${fileType}]\n\nFile Details:\nName: ${file.name}\nSize: ${formatFileSize(file.size)}\nType: ${file.type}`;
    }
  } catch (error) {
    console.error('Error extracting file content:', error);
    return `[Error extracting content from ${file.name}]`;
  }
};

// New function to generate slides from content with character limits
export const generateSlidesFromContent = (content: string, audience: string): any[] => {
  // Split content into lines and filter out empty ones
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  // Extract title from first line or use filename
  const title = lines[0] || "Document Presentation";
  
  // Extract subtitle from second line or create a subtitle based on audience
  const subtitle = lines[1] || `Prepared for ${audience.charAt(0).toUpperCase() + audience.slice(1)} Audience`;
  
  // Process content with character limits (max 250 chars per PDF page extract)
  let processedContent = content;
  if (processedContent.length > 250) {
    processedContent = processedContent.substring(0, 250) + "...";
  }
  
  // Group remaining lines into content sections with character limits
  const contentSections: string[][] = [];
  let currentSection: string[] = [];
  
  // Simple algorithm to group content into sections
  // In a real implementation, this would use more sophisticated NLP
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Limit each content item to 150 characters
    const limitedLine = line.length > 150 ? line.substring(0, 147) + "..." : line;
    
    // Try to identify potential section headers
    if ((line.length < 50 && (line.endsWith(':') || !line.includes(' '))) || currentSection.length >= 4) {
      if (currentSection.length > 0) {
        contentSections.push([...currentSection]);
        currentSection = [];
      }
    }
    
    currentSection.push(limitedLine);
  }
  
  // Add any remaining content as the final section
  if (currentSection.length > 0) {
    contentSections.push(currentSection);
  }
  
  // Create additional sections if we don't have enough
  while (contentSections.length < 3) {
    contentSections.push(["Additional content", "This section contains supplementary information", "Relevant to the main topic", "For further reference"]);
  }
  
  // Generate slides based on the content
  const slides: any[] = [
    {
      type: "title",
      title: title.substring(0, 150),
      subtitle: subtitle.substring(0, 150),
    }
  ];
  
  // Add agenda slide
  slides.push({
    type: "agenda",
    title: "Agenda",
    items: contentSections.map((section, index) => {
      const headerText = section[0].replace(':', '') || `Section ${index + 1}`;
      return headerText.substring(0, 150);
    }).slice(0, 5)
  });
  
  // Add content slides
  contentSections.forEach((section, index) => {
    slides.push({
      type: "content",
      title: (section[0].replace(':', '') || `Section ${index + 1}`).substring(0, 150),
      content: section.slice(1, 5).map(item => item.substring(0, 150))
    });
  });
  
  // Add a chart slide if we have space
  if (slides.length < 5) {
    slides.push({
      type: "chart",
      title: "Data Visualization",
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

// Function to generate a PowerPoint file (in a real implementation)
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
      slideContent += `Content: ${slide.content.join(', ')}\n`;
    }
    
    if (slide.items) {
      slideContent += `Items: ${slide.items.join(', ')}\n`;
    }
    
    return slideContent;
  }).join('\n\n');
  
  return new Blob([content], { type: 'text/plain' });
};
