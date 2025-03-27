
import * as pdfjs from 'pdfjs-dist';
import { getDocument } from 'pdfjs-dist';

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface ExtractedPage {
  pageNumber: number;
  text: string;
}

/**
 * Extracts text from a PDF file with character limit per page
 * @param file The PDF file to extract text from
 * @param charLimit Maximum characters to extract per page
 * @returns Array of extracted pages with text
 */
export const extractPdfContentWithLimit = async (
  file: File, 
  charLimit: number = 250
): Promise<ExtractedPage[]> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    const extractedPages: ExtractedPage[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      let pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      // Apply character limit
      if (pageText.length > charLimit) {
        pageText = pageText.substring(0, charLimit - 3) + '...';
      }
      
      extractedPages.push({
        pageNumber: i,
        text: pageText
      });
    }
    
    return extractedPages;
  } catch (error) {
    console.error('Error extracting PDF content:', error);
    return [{
      pageNumber: 1,
      text: `[Error extracting content from ${file.name}. The PDF might be encrypted, damaged, or uses unsupported features.]`
    }];
  }
};

/**
 * Summarizes text into key points
 * @param text The text to summarize
 * @param maxPoints Maximum number of key points to extract
 * @param charLimit Character limit per key point
 * @returns Array of key points
 */
export const summarizeText = (
  text: string,
  maxPoints: number = 5,
  charLimit: number = 150
): string[] => {
  // Simple summarization - split by sentences and get the most important ones
  // This is a basic implementation - for production, consider using an NLP API
  const sentences = text
    .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
    .split('|')
    .map(s => s.trim())
    .filter(s => s.length > 10);
  
  // Get sentences that contain important keywords or are at the beginning/end
  // This is a basic heuristic for important sentences
  const importanceScores = sentences.map((sentence, index) => {
    let score = 0;
    
    // Beginning sentences often contain important information
    if (index < sentences.length * 0.2) {
      score += 3;
    }
    
    // Ending sentences often contain conclusions
    if (index > sentences.length * 0.8) {
      score += 2;
    }
    
    // Sentences with keywords like "important", "key", "significant", etc.
    const importantKeywords = [
      "important", "key", "significant", "essential", "crucial", 
      "primary", "main", "major", "fundamental", "critical",
      "conclusion", "therefore", "thus", "result", "consequently"
    ];
    
    importantKeywords.forEach(keyword => {
      if (sentence.toLowerCase().includes(keyword)) {
        score += 2;
      }
    });
    
    // Longer sentences might contain more information
    score += Math.min(sentence.length / 50, 1);
    
    return { sentence, score };
  });
  
  // Sort by importance score
  const sortedSentences = importanceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPoints)
    .map(item => item.sentence);
  
  // Apply character limit
  return sortedSentences.map(point => 
    point.length > charLimit ? point.substring(0, charLimit - 3) + '...' : point
  );
};

/**
 * Creates a downloadable text file from extracted PDF content
 * @param extractedPages Array of extracted pages with text
 * @param fileName Original file name
 * @param saveAs Whether to trigger a save-as dialog
 * @returns Object with download URL and file name
 */
export const createTextFileFromExtractedContent = (
  extractedPages: ExtractedPage[],
  fileName: string,
  saveAs: boolean = true
): { url: string, fileName: string } => {
  const content = extractedPages.map(page => 
    `--- Page ${page.pageNumber} ---\n${page.text}`
  ).join('\n\n');
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const textFileName = fileName.split('.')[0] + '_extracted.txt';
  
  if (saveAs) {
    // Use the File System Access API if available
    if ('showSaveFilePicker' in window) {
      // We'll initiate the save dialog when the user clicks the download button
      // This is handled in the component that calls this function
    } else {
      // Fallback for browsers without File System Access API
      // The default browser download behavior will be used
    }
  }
  
  return { 
    url, 
    fileName: textFileName 
  };
};

/**
 * Saves a file using the File System Access API with a custom location
 * @param url The object URL for the blob
 * @param suggestedName Suggested file name
 * @param mimeType MIME type of the file
 * @returns Promise resolving to true if successful
 */
export const saveFileWithCustomLocation = async (
  url: string,
  suggestedName: string,
  mimeType: string = 'text/plain'
): Promise<boolean> => {
  try {
    // Check if File System Access API is supported
    if (!('showSaveFilePicker' in window)) {
      // Fallback for browsers without API support
      const a = document.createElement('a');
      a.href = url;
      a.download = suggestedName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return true;
    }
    
    // @ts-ignore - TypeScript might not have the type definitions for this API
    const fileHandle = await window.showSaveFilePicker({
      suggestedName,
      types: [{
        description: 'Text Files',
        accept: { [mimeType]: [`.${suggestedName.split('.').pop()}`] },
      }],
    });
    
    // Get a writable stream
    // @ts-ignore
    const writable = await fileHandle.createWritable();
    
    // Fetch the blob from the URL
    const response = await fetch(url);
    const blob = await response.blob();
    
    // Write the blob to the file
    await writable.write(blob);
    await writable.close();
    
    // Clean up the object URL
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error saving file with custom location:', error);
    
    // If user cancelled or API failed, fall back to standard download
    if (error.name !== 'AbortError') {
      const a = document.createElement('a');
      a.href = url;
      a.download = suggestedName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    
    return false;
  }
};

/**
 * Gets the document title from extracted text
 * @param content The extracted text content
 * @returns The document title
 */
export const getDocumentTitle = (content: string): string => {
  // Try to extract a title from the content
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  // Find the first substantial line that might be a title
  const potentialTitle = lines.find(line => {
    const trimmed = line.trim();
    // A title is usually short, without punctuation at the end except for question marks
    return trimmed.length > 0 && 
           trimmed.length < 100 && 
           !trimmed.includes('---') &&
           !trimmed.endsWith('.') && 
           !trimmed.endsWith(';') &&
           !trimmed.endsWith(':');
  });
  
  return potentialTitle || "Document Presentation";
};

export default {
  extractPdfContentWithLimit,
  summarizeText,
  createTextFileFromExtractedContent,
  saveFileWithCustomLocation,
  getDocumentTitle
};
