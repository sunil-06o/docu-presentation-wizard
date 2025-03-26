
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

// New function to extract text content from files
export const extractFileContent = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type === 'text/plain') {
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
    } else {
      // For non-text files (PDF, DOCX), we would normally use a server-side API
      // For demo purposes, we'll extract the filename and create a simple content
      const fileExtension = getFileExtension(file.name);
      const fileType = getFileTypeFromExtension(fileExtension);
      resolve(`Content extracted from ${file.name} (${fileType})\n\nFile Details:\nName: ${file.name}\nSize: ${formatFileSize(file.size)}\nType: ${file.type}\n\nThis is a demonstration of content extraction. In a production environment, we would use appropriate libraries or APIs to extract the actual content from PDF or DOCX files.`);
    }
  });
};

// New function to generate slides from content
export const generateSlidesFromContent = (content: string, audience: string): any[] => {
  // Split content into lines and filter out empty ones
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  
  // Extract title from first line or use filename
  const title = lines[0] || "Document Presentation";
  
  // Extract subtitle from second line or create default
  const subtitle = lines[1] || "Auto-generated Presentation";
  
  // Group remaining lines into content sections
  const contentSections: string[][] = [];
  let currentSection: string[] = [];
  
  // Simple algorithm to group content into sections
  // In a real implementation, this would use more sophisticated NLP
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Try to identify potential section headers
    if (line.length < 50 && (line.endsWith(':') || !line.includes(' '))) {
      if (currentSection.length > 0) {
        contentSections.push([...currentSection]);
        currentSection = [];
      }
    }
    
    currentSection.push(line);
    
    // Create a new section every few lines to avoid too much content on one slide
    if (currentSection.length >= 4) {
      contentSections.push([...currentSection]);
      currentSection = [];
    }
  }
  
  // Add any remaining content as the final section
  if (currentSection.length > 0) {
    contentSections.push(currentSection);
  }
  
  // Generate slides based on the content
  const slides: any[] = [
    {
      type: "title",
      title: title,
      subtitle: subtitle,
    }
  ];
  
  // Add agenda slide if we have multiple content sections
  if (contentSections.length > 1) {
    slides.push({
      type: "agenda",
      title: "Agenda",
      items: contentSections.map((section, index) => {
        return section[0].replace(':', '') || `Section ${index + 1}`;
      }).slice(0, 5) // Limit to 5 agenda items
    });
  }
  
  // Add content slides
  contentSections.forEach((section, index) => {
    slides.push({
      type: "content",
      title: section[0].replace(':', '') || `Section ${index + 1}`,
      content: section.slice(1, 5) // Limit to 4 content points per slide
    });
  });
  
  // Add a thank you slide
  slides.push({
    type: "thanks",
    title: "Thank You",
    subtitle: "Questions & Discussion",
  });
  
  return slides;
};
