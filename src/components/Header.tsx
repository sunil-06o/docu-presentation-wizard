
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";

interface HeaderProps {
  showBackButton?: boolean;
  showSettings?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  showBackButton = false,
  showSettings = false
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  
  return (
    <header className="w-full py-4 px-8 flex items-center justify-between bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center">
        {showBackButton && !isHomePage && (
          <Link to="/" className="flex items-center text-gray-600 hover:text-primary transition-colors mr-6">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        )}
        <Link to="/" className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
          Docu<span className="font-light">Slide</span>
        </Link>
      </div>
      
      {showSettings && (
        <div className="flex items-center">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
