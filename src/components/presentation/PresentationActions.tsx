
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Edit, Share, FileText, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";

interface PresentationActionsProps {
  onDownload: () => void;
}

const PresentationActions: React.FC<PresentationActionsProps> = ({
  onDownload
}) => {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const handleViewOriginal = () => {
    toast({
      title: "Feature in development",
      description: "View original document feature is coming soon.",
    });
  };

  const handleEdit = () => {
    toast({
      title: "Edit mode",
      description: "Edit mode feature is coming soon.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Share presentation",
      description: "Share feature is coming soon.",
    });
  };

  return (
    <div className="flex space-x-3">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={toggleTheme}
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4 mr-1" />
        ) : (
          <Moon className="h-4 w-4 mr-1" />
        )}
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={handleViewOriginal}
      >
        <FileText className="h-4 w-4 mr-1" />
        View Original
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1"
        onClick={handleEdit}
      >
        <Edit className="h-4 w-4 mr-1" />
        Edit
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1" 
        onClick={handleShare}
      >
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
