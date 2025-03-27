
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
 * Extracts key points from PDF text
 * @param text The text to extract key points from
 * @param maxPoints Maximum number of key points to extract
 * @param charLimit Character limit per key point
 * @returns Array of key points
 */
export const extractKeyPoints = (
  text: string,
  maxPoints: number = 5,
  charLimit: number = 150
): string[] => {
  // Simple extraction - split by sentences and get the first N
  const sentences = text
    .replace(/([.?!])\s*(?=[A-Z])/g, '$1|')
    .split('|')
    .map(s => s.trim())
    .filter(s => s.length > 10);
  
  // Limit the number of points and apply character limit
  return sentences
    .slice(0, maxPoints)
    .map(point => point.length > charLimit ? 
      point.substring(0, charLimit - 3) + '...' : 
      point
    );
};

/**
 * Creates a downloadable text file from extracted PDF content
 * @param extractedPages Array of extracted pages with text
 * @param fileName Original file name
 * @returns Object with download URL and file name
 */
export const createTextFileFromExtractedContent = (
  extractedPages: ExtractedPage[],
  fileName: string
): { url: string, fileName: string } => {
  const content = extractedPages.map(page => 
    `--- Page ${page.pageNumber} ---\n${page.text}`
  ).join('\n\n');
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const textFileName = fileName.split('.')[0] + '_extracted.txt';
  
  return { 
    url, 
    fileName: textFileName 
  };
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
  extractKeyPoints,
  createTextFileFromExtractedContent,
  getDocumentTitle
};
