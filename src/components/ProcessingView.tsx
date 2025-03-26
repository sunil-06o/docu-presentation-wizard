
import React from "react";
import { Progress } from "@/components/ui/progress";
import { Brain, FileSearch, FileCheck, Loader2 } from "lucide-react";

interface ProcessingViewProps {
  progress: number;
}

const ProcessingView: React.FC<ProcessingViewProps> = ({ progress }) => {
  const steps = [
    { 
      id: "analyzing", 
      label: "Analyzing Document", 
      description: "Extracting text and identifying key content",
      icon: FileSearch,
      threshold: 30
    },
    { 
      id: "summarizing", 
      label: "Summarizing Content", 
      description: "Identifying main points and organizing structure",
      icon: Brain,
      threshold: 70
    },
    { 
      id: "generating", 
      label: "Generating Slides", 
      description: "Creating presentation with optimal layout",
      icon: FileCheck,
      threshold: 100
    }
  ];

  const getCurrentStepIndex = () => {
    for (let i = 0; i < steps.length; i++) {
      if (progress < steps[i].threshold) {
        return i;
      }
    }
    return steps.length - 1;
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="w-full max-w-2xl mx-auto py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold mb-2">Processing Your Document</h2>
        <p className="text-gray-600">
          Our AI is analyzing your document and creating a presentation
        </p>
      </div>

      <div className="mb-8">
        <Progress value={progress} className="h-2" />
        <div className="mt-2 text-right text-sm text-gray-500">
          {progress}%
        </div>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const IconComponent = step.icon;
          
          return (
            <div 
              key={step.id}
              className={`flex items-start p-4 rounded-lg transition-all ${
                isActive ? 'bg-primary/5 border border-primary/10' : 
                isCompleted ? 'bg-green-50 border border-green-100' : 
                'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className={`mr-4 p-2 rounded-full ${
                isActive ? 'bg-primary/10 text-primary animate-pulse' : 
                isCompleted ? 'bg-green-100 text-green-600' : 
                'bg-gray-200 text-gray-400'
              }`}>
                {isActive ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <IconComponent className="h-6 w-6" />
                )}
              </div>
              <div className="flex-grow">
                <h3 className={`font-medium ${
                  isActive ? 'text-primary' : 
                  isCompleted ? 'text-green-700' : 
                  'text-gray-400'
                }`}>
                  {step.label}
                </h3>
                <p className={`text-sm ${
                  isActive ? 'text-gray-600' : 
                  isCompleted ? 'text-green-600' : 
                  'text-gray-400'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProcessingView;
