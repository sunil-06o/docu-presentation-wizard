
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Edit, Share, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PresentationActionsProps {
  onDownload: () => void;
}

const PresentationActions: React.FC<PresentationActionsProps> = ({
  onDownload
}) => {
  const { toast } = useToast();

  const handleViewOriginal = () => {
    toast({
      title: "Feature in development",
      description: "View original document feature is coming soon.",
    });
  };

  return (
    <div className="flex space-x-3">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={handleViewOriginal}
      >
        <FileText className="h-4 w-4 mr-1" />
        View Original
      </Button>
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Edit className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Share className="h-4 w-4 mr-1" />
        Share
      </Button>
      <Button 
        size="sm" 
        className="flex items-center gap-1"
        onClick={onDownload}
      >
        <Download className="h-4 w-4 mr-1" />
        Download
      </Button>
    </div>
  );
};

export default PresentationActions;
