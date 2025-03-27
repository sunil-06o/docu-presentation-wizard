
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Undo, Redo, Image, Type, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ThemeSelector from "@/components/ThemeSelector";

interface PresentationEditorProps {
  slides: any[];
  currentSlide: number;
  theme: string;
  onThemeChange: (theme: string) => void;
  onSlideUpdate: (slideIndex: number, updatedSlide: any) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const PresentationEditor: React.FC<PresentationEditorProps> = ({
  slides,
  currentSlide,
  theme,
  onThemeChange,
  onSlideUpdate,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  const { toast } = useToast();
  const currentSlideData = slides[currentSlide];
  const [fontSize, setFontSize] = useState<string>("medium");
  const [textColor, setTextColor] = useState<string>("#000000");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSlide = {
      ...currentSlideData,
      title: e.target.value
    };
    onSlideUpdate(currentSlide, updatedSlide);
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentSlideData.subtitle) return;
    
    const updatedSlide = {
      ...currentSlideData,
      subtitle: e.target.value
    };
    onSlideUpdate(currentSlide, updatedSlide);
  };

  const handleContentChange = (index: number, value: string) => {
    if (!currentSlideData.content) return;
    
    const newContent = [...currentSlideData.content];
    newContent[index] = value;
    
    const updatedSlide = {
      ...currentSlideData,
      content: newContent
    };
    onSlideUpdate(currentSlide, updatedSlide);
  };

  const handleItemsChange = (index: number, value: string) => {
    if (!currentSlideData.items) return;
    
    const newItems = [...currentSlideData.items];
    newItems[index] = value;
    
    const updatedSlide = {
      ...currentSlideData,
      items: newItems
    };
    onSlideUpdate(currentSlide, updatedSlide);
  };

  const handleAddImage = () => {
    toast({
      title: "Coming Soon",
      description: "Image upload functionality will be available soon."
    });
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    toast({
      title: "Font Size Changed",
      description: `Font size set to ${size}`
    });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value);
    toast({
      title: "Text Color Changed",
      description: "The text color has been updated"
    });
  };

  const renderEditFields = () => {
    switch (currentSlideData.type) {
      case "title":
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
              <Input 
                id="title" 
                value={currentSlideData.title || ""} 
                onChange={handleTitleChange} 
                className="w-full"
                maxLength={150}
              />
              <p className="text-xs text-gray-500 mt-1">
                {currentSlideData.title?.length || 0}/150 characters
              </p>
            </div>
            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium mb-1">Subtitle</label>
              <Input 
                id="subtitle" 
                value={currentSlideData.subtitle || ""} 
                onChange={handleSubtitleChange}
                className="w-full"
                maxLength={150}
              />
              <p className="text-xs text-gray-500 mt-1">
                {currentSlideData.subtitle?.length || 0}/150 characters
              </p>
            </div>
          </div>
        );
      case "content":
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="content-title" className="block text-sm font-medium mb-1">Title</label>
              <Input 
                id="content-title" 
                value={currentSlideData.title || ""} 
                onChange={handleTitleChange}
                className="w-full"
                maxLength={150}
              />
              <p className="text-xs text-gray-500 mt-1">
                {currentSlideData.title?.length || 0}/150 characters
              </p>
            </div>
            {currentSlideData.content && currentSlideData.content.map((item: string, index: number) => (
              <div key={index}>
                <label htmlFor={`content-${index}`} className="block text-sm font-medium mb-1">Point {index + 1}</label>
                <Textarea 
                  id={`content-${index}`} 
                  value={item} 
                  onChange={(e) => handleContentChange(index, e.target.value)}
                  className="w-full"
                  maxLength={150}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {item.length}/150 characters
                </p>
              </div>
            ))}
          </div>
        );
      case "agenda":
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="agenda-title" className="block text-sm font-medium mb-1">Title</label>
              <Input 
                id="agenda-title" 
                value={currentSlideData.title || ""} 
                onChange={handleTitleChange}
                className="w-full"
                maxLength={150}
              />
              <p className="text-xs text-gray-500 mt-1">
                {currentSlideData.title?.length || 0}/150 characters
              </p>
            </div>
            {currentSlideData.items && currentSlideData.items.map((item: string, index: number) => (
              <div key={index}>
                <label htmlFor={`item-${index}`} className="block text-sm font-medium mb-1">Item {index + 1}</label>
                <Input 
                  id={`item-${index}`} 
                  value={item} 
                  onChange={(e) => handleItemsChange(index, e.target.value)}
                  className="w-full"
                  maxLength={150}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {item.length}/150 characters
                </p>
              </div>
            ))}
          </div>
        );
      case "thanks":
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="thanks-title" className="block text-sm font-medium mb-1">Title</label>
              <Input 
                id="thanks-title" 
                value={currentSlideData.title || ""} 
                onChange={handleTitleChange}
                className="w-full"
                maxLength={150}
              />
              <p className="text-xs text-gray-500 mt-1">
                {currentSlideData.title?.length || 0}/150 characters
              </p>
            </div>
            <div>
              <label htmlFor="thanks-subtitle" className="block text-sm font-medium mb-1">Subtitle</label>
              <Input 
                id="thanks-subtitle" 
                value={currentSlideData.subtitle || ""} 
                onChange={handleSubtitleChange}
                className="w-full"
                maxLength={150}
              />
              <p className="text-xs text-gray-500 mt-1">
                {currentSlideData.subtitle?.length || 0}/150 characters
              </p>
            </div>
          </div>
        );
      default:
        return <p>This slide type doesn't support editing yet.</p>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium dark:text-white">Edit Slide {currentSlide + 1}</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onUndo} 
            disabled={!canUndo}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRedo} 
            disabled={!canRedo}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {renderEditFields()}
        </div>
        
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 className="text-sm font-medium mb-3 dark:text-white">Styling Options</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Text Color</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="color" 
                    value={textColor} 
                    onChange={handleColorChange}
                    className="w-8 h-8 rounded cursor-pointer"
                  />
                  <Input 
                    value={textColor} 
                    onChange={handleColorChange}
                    className="w-24"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Font Size</label>
                <div className="flex space-x-2">
                  <Button 
                    variant={fontSize === "small" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => handleFontSizeChange("small")}
                  >
                    Small
                  </Button>
                  <Button 
                    variant={fontSize === "medium" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => handleFontSizeChange("medium")}
                  >
                    Medium
                  </Button>
                  <Button 
                    variant={fontSize === "large" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => handleFontSizeChange("large")}
                  >
                    Large
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Insert</label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center space-x-1"
                  onClick={handleAddImage}
                >
                  <Image className="h-4 w-4" />
                  <span>Add Image</span>
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-3 dark:text-white">Presentation Theme</h4>
            <ThemeSelector theme={theme} setTheme={onThemeChange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationEditor;
