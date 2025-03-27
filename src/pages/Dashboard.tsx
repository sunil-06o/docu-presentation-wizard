import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import AudienceSelector from "@/components/AudienceSelector";
import ThemeSelector from "@/components/ThemeSelector";
import ProcessingView from "@/components/ProcessingView";
import PresentationPreview from "@/components/PresentationPreview";
import Header from "@/components/Header";
import { generatePowerPointFile } from "@/utils/fileUtils";
import { useToast } from "@/hooks/use-toast";

type FileType = {
  name: string;
  type: string;
  size: number;
  content?: string;
  textFileUrl?: string;
  textFileName?: string;
  documentTitle?: string;
};

type StepType = "upload" | "customize" | "process" | "preview";

const Dashboard = () => {
  const [file, setFile] = useState<FileType | null>(null);
  const [currentStep, setCurrentStep] = useState<StepType>("upload");
  const [audience, setAudience] = useState<string>("executive");
  const [theme, setTheme] = useState<string>("modern");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const { toast } = useToast();
  const [generatedSlides, setGeneratedSlides] = useState<any[]>([]);
  const [lastDownloadTime, setLastDownloadTime] = useState<string | null>(null);

  const handleFileUpload = (uploadedFile: FileType) => {
    setFile(uploadedFile);
    setCurrentStep("customize");
  };

  const handleProcess = () => {
    setIsLoading(true);
    setCurrentStep("process");
    
    // Simulate processing with a progress bar
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsLoading(false);
        setCurrentStep("preview");
      }
    }, 200);
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleDownload = () => {
    if (!file || !generatedSlides.length) {
      toast({
        title: "No content to download",
        description: "Please upload a file and process it first.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Generate PowerPoint file
      const pptxBlob = generatePowerPointFile(generatedSlides, theme, file.name);
      
      // Create download link
      const url = URL.createObjectURL(pptxBlob);
      const a = document.createElement('a');
      a.href = url;
      // Use document title for file name if available
      const baseFileName = file.documentTitle ? 
        file.documentTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 
        file.name.split('.')[0];
      
      a.download = `${baseFileName}_presentation.pptx`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Set download time for display
      const now = new Date();
      setLastDownloadTime(now.toLocaleTimeString());
      
      toast({
        title: "Presentation downloaded",
        description: `${a.download} has been downloaded to your default download location.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "There was an error generating your presentation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case "upload":
        return <FileUpload onFileUpload={handleFileUpload} />;
      case "customize":
        return (
          <div className="w-full max-w-4xl mx-auto grid grid-cols-1 gap-8 animate-fade-in">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Document Information</h3>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
                <p className="font-medium text-gray-900 dark:text-white">{file?.name}</p>
                {file?.documentTitle && (
                  <p className="text-sm text-primary mt-1">
                    <span className="font-medium">Detected title:</span> {file.documentTitle}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  The presentation will be created using the extracted content and detected title.
                </p>
              </div>
            </div>
            
            <AudienceSelector audience={audience} setAudience={setAudience} />
            <ThemeSelector theme={theme} setTheme={setTheme} />
            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleProcess}
                className="rounded-full px-8 group"
              >
                Process Document
              </Button>
            </div>
          </div>
        );
      case "process":
        return <ProcessingView progress={progress} />;
      case "preview":
        return (
          <div className="space-y-4">
            {lastDownloadTime && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
                <p className="text-green-700 dark:text-green-400">
                  <span className="font-medium">Last download:</span> {lastDownloadTime}
                </p>
                <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                  The file has been downloaded to your default download location.
                </p>
              </div>
            )}
            <PresentationPreview 
              file={file}
              audience={audience}
              theme={theme}
              onThemeChange={handleThemeChange}
              onDownload={handleDownload}
              onSlidesGenerated={setGeneratedSlides}
            />
          </div>
        );
      default:
        return <FileUpload onFileUpload={handleFileUpload} />;
    }
  };

  const steps = [
    { key: "upload", label: "Upload" },
    { key: "customize", label: "Customize" },
    { key: "process", label: "Process" },
    { key: "preview", label: "Preview" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header showBackButton={true} showSettings={true} />

      <main className="flex-grow px-4 md:px-8 lg:px-16 py-8 dark:text-gray-100">
        <div className="w-full max-w-5xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl font-bold mb-6 dark:text-white">Create Presentation</h1>
            
            <div className="w-full bg-white dark:bg-gray-800 rounded-xl p-2 shadow-sm transition-colors duration-200">
              <div className="w-full flex justify-between items-center relative">
                {steps.map((step, index) => {
                  const isActive = currentStep === step.key;
                  const isPast = steps.findIndex(s => s.key === currentStep) > index;
                  
                  return (
                    <React.Fragment key={step.key}>
                      <div 
                        className={`flex flex-col items-center justify-center z-10 transition-all ${
                          isActive || isPast ? 'text-primary dark:text-primary' : 'text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                            isActive 
                              ? 'bg-primary text-white shadow-md' 
                              : isPast 
                                ? 'bg-primary/20 text-primary dark:bg-primary/30' 
                                : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">{step.label}</span>
                      </div>
                      
                      {index < steps.length - 1 && (
                        <div 
                          className={`h-1 flex-grow max-w-32 transition-all ${
                            isPast ? 'bg-primary dark:bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        ></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            {getStepContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
