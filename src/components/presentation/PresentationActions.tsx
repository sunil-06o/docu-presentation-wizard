
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Edit, Share, FileText, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/use-theme";

interface PresentationActionsProps {
  onDownload: () => void;
  onEdit?: () => void;
  isEditing?: boolean;
}

const PresentationActions: React.FC<PresentationActionsProps> = ({
  onDownload,
  onEdit,
  isEditing = false
}) => {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const handleViewOriginal = () => {
    toast({
      title: "Feature in development",
      description: "View original document feature is coming soon.",
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
      {onEdit && (
        <Button 
          variant={isEditing ? "default" : "outline"}
          size="sm" 
          className="flex items-center gap-1"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 mr-1" />
          {isEditing ? "Editing Mode" : "Edit"}
        </Button>
      )}
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
        Save Presentation
      </Button>
    </div>
  );
};

export default PresentationActions;
