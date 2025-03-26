
import React, { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FileText, Upload, File } from "lucide-react";
import { validateFileType, validateFileSize, formatFileSize, extractFileContent } from "@/utils/fileUtils";

type FileType = {
  name: string;
  type: string;
  size: number;
  content?: string;
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
      const content = await extractFileContent(file);
      const fileData: FileType = {
        name: file.name,
        type: file.type,
        size: file.size,
        content: content
      };
      setSelectedFile(fileData);
      setIsProcessing(false);
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error processing file",
        description: "There was a problem reading your file.",
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
  }, [toast]);

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
  }, [toast]);

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

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div 
        className={`drop-area p-12 ${dragActive ? 'active' : ''} bg-white rounded-xl transition-all`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-pulse-light">
            <Upload className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Upload Document</h3>
          <p className="text-gray-600 mb-6 max-w-md">
            Drag and drop your PDF, DOCX, or TXT file here, or click to browse
          </p>
          
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="py-2 px-4 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-medium">
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
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm animate-slide-in">
          <h3 className="text-lg font-semibold mb-4">Selected File</h3>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className="mr-4">
              {getFileIcon(selectedFile.type)}
            </div>
            <div className="flex-grow">
              <p className="font-medium text-gray-900 truncate">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
            </div>
            <Button
              variant="default"
              onClick={handleSubmit}
              className="ml-4 rounded-full"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Continue'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
