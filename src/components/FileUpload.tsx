import React, { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FileText, Upload, File, Download } from "lucide-react";
import { validateFileType, validateFileSize, formatFileSize, extractFileContent } from "@/utils/fileUtils";
import { saveFileWithCustomLocation } from "@/utils/pdfExtractor";

type FileType = {
  name: string;
  type: string;
  size: number;
  content?: string;
  textFileUrl?: string;
  textFileName?: string;
  documentTitle?: string;
};

interface FileUploadProps {
  onFileUpload: (file: FileType) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      toast({
        title: "Processing file",
        description: "Extracting text from your document. This may take a moment...",
      });
      
      const extractionResult = await extractFileContent(file);
      const fileData: FileType = {
        name: file.name,
        type: file.type,
        size: file.size,
        content: extractionResult.text,
        textFileUrl: extractionResult.downloadInfo?.url,
        textFileName: extractionResult.downloadInfo?.fileName,
        documentTitle: extractionResult.title
      };
      setSelectedFile(fileData);
      setIsProcessing(false);
      
      if (extractionResult.downloadInfo) {
        toast({
          title: "Text extraction complete",
          description: "Your document has been processed. The extracted text will be used to create your presentation.",
        });
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error processing file",
        description: "There was a problem reading your file. Please try another document.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        processFile(file);
      }
    }
  }, []);

  const validateFile = (file: File): boolean => {
    if (!validateFileType(file)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, or TXT file.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!validateFileSize(file)) {
      toast({
        title: "File too large",
        description: "File size should be less than 10MB.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        processFile(file);
      }
    }
  }, []);

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else if (fileType.includes('word')) {
      return <FileText className="h-8 w-8 text-blue-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const handleDownloadExtractedText = async () => {
    if (selectedFile?.textFileUrl) {
      try {
        const success = await saveFileWithCustomLocation(
          selectedFile.textFileUrl,
          selectedFile.textFileName || 'extracted_text.txt',
          'text/plain'
        );
        
        if (success) {
          toast({
            title: "Text file saved",
            description: "The extracted text has been saved to your selected location.",
          });
        }
      } catch (error) {
        console.error("Error saving file:", error);
        toast({
          title: "Error saving file",
          description: "There was a problem saving your file. The file may have been downloaded to your default location.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div 
        className={`drop-area p-12 ${dragActive ? 'active border-primary' : ''} bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 transition-all hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-750`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse-light">
            <Upload className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3 dark:text-white">Upload Document</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
            Drag and drop your PDF, DOCX, or TXT file here, or click to browse
          </p>
          
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="py-2 px-4 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-200 font-medium">
              Browse Files
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-slide-in">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Selected File</h3>
          <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="mr-4">
              {getFileIcon(selectedFile.type)}
            </div>
            <div className="flex-grow">
              <p className="font-medium text-gray-900 dark:text-white truncate">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(selectedFile.size)}</p>
              {selectedFile.documentTitle && (
                <p className="text-sm text-primary mt-1">
                  <span className="font-medium">Detected title:</span> {selectedFile.documentTitle}
                </p>
              )}
              {selectedFile.content && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span className="font-medium">Status:</span> Text extracted successfully
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {selectedFile.textFileUrl && (
                <Button
                  variant="outline"
                  onClick={handleDownloadExtractedText}
                  className="ml-2 flex items-center gap-1"
                  size="sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Save Extracted Text</span>
                </Button>
              )}
              <Button
                variant="default"
                onClick={handleSubmit}
                className="rounded-full"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
