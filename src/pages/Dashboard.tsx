
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

type FileType = {
  name: string;
  type: string;
  size: number;
  content?: any;
};

type StepType = "upload" | "customize" | "process" | "preview";

const Dashboard = () => {
  const [file, setFile] = useState<FileType | null>(null);
  const [currentStep, setCurrentStep] = useState<StepType>("upload");
  const [audience, setAudience] = useState<string>("executive");
  const [theme, setTheme] = useState<string>("modern");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

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

  const handleDownload = () => {
    // In a real implementation, this would generate and download the presentation
    alert("Presentation downloaded successfully!");
  };

  const getStepContent = () => {
    switch (currentStep) {
      case "upload":
        return <FileUpload onFileUpload={handleFileUpload} />;
      case "customize":
        return (
          <div className="w-full max-w-4xl mx-auto grid grid-cols-1 gap-8 animate-fade-in">
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
          <PresentationPreview 
            file={file}
            audience={audience}
            theme={theme}
            onDownload={handleDownload}
          />
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="w-full py-4 px-8 flex items-center justify-between bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center">
          <Link to="/" className="flex items-center text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
        <div className="flex items-center">
          <span className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Docu<span className="font-light">Slide</span></span>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex-grow px-4 md:px-8 lg:px-16 py-8">
        <div className="w-full max-w-5xl mx-auto">
          <div className="mb-12">
            <h1 className="text-3xl font-bold mb-6">Create Presentation</h1>
            
            <div className="w-full bg-white rounded-xl p-2 shadow-sm">
              <div className="w-full flex justify-between items-center relative">
                {steps.map((step, index) => {
                  const isActive = currentStep === step.key;
                  const isPast = steps.findIndex(s => s.key === currentStep) > index;
                  
                  return (
                    <React.Fragment key={step.key}>
                      <div 
                        className={`flex flex-col items-center justify-center z-10 transition-all ${
                          isActive || isPast ? 'text-primary' : 'text-gray-400'
                        }`}
                      >
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                            isActive 
                              ? 'bg-primary text-white shadow-md' 
                              : isPast 
                                ? 'bg-primary/20 text-primary' 
                                : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">{step.label}</span>
                      </div>
                      
                      {index < steps.length - 1 && (
                        <div 
                          className={`h-1 flex-grow max-w-32 transition-all ${
                            isPast ? 'bg-primary' : 'bg-gray-200'
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
