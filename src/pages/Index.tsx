
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Shield, Zap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-6 px-8 flex items-center justify-between backdrop-blur-md bg-white/70 border-b border-gray-100 fixed top-0 z-10">
        <div className="flex items-center">
          <span className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Docu<span className="font-light">Slide</span></span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="#security" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            Security
          </a>
          <Button 
            variant="outline"
            className="shadow-sm hover:shadow-md transition-all"
            onClick={() => navigate('/dashboard')}
          >
            Get Started
          </Button>
        </nav>
        <Button 
          className="md:hidden"
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="w-full px-4 md:px-8 lg:px-16 py-24 flex flex-col items-center justify-center text-center">
          <div className="animate-fade-in opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance md:max-w-4xl mb-6">
              Transform Documents Into 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600"> Beautiful Presentations</span>
            </h1>
          </div>
          <div className="animate-fade-in opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            <p className="text-xl text-gray-600 max-w-2xl mb-10">
              Effortlessly convert your documents into professional, AI-powered presentations with just a few clicks.
            </p>
          </div>
          <div className="animate-fade-in opacity-0" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
            <Button 
              size="lg" 
              className="rounded-full shadow-lg hover:shadow-xl transition-all px-8 group"
              onClick={() => navigate('/dashboard')}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          <div className="mt-16 animate-fade-in opacity-0" style={{ animationDelay: "700ms", animationFillMode: "forwards" }}>
            <div className="relative w-full max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 h-full w-full"></div>
              <div className="glassmorphism rounded-2xl shadow-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                  alt="DocuSlide Application" 
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full px-4 md:px-8 lg:px-16 py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to create stunning, professional presentations in minutes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileText className="h-8 w-8 text-primary" />,
                  title: "Smart Document Analysis",
                  description: "Our AI extracts key points and organizes content from your PDFs, DOCX, and TXT files."
                },
                {
                  icon: <Zap className="h-8 w-8 text-primary" />,
                  title: "Instant Conversion",
                  description: "Transform documents into beautiful presentations with professional templates in seconds."
                },
                {
                  icon: <Shield className="h-8 w-8 text-primary" />,
                  title: "Secure Processing",
                  description: "Your confidential documents are processed securely with enterprise-grade encryption."
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all animate-fade-in opacity-0"
                  style={{ animationDelay: `${index * 200}ms`, animationFillMode: "forwards" }}
                >
                  <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full px-4 md:px-8 lg:px-16 py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Three simple steps to transform your documents into presentations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Upload Your Document",
                  description: "Upload your PDF, DOCX, or TXT files to our secure platform."
                },
                {
                  step: "02",
                  title: "AI Processing",
                  description: "Our AI analyzes your document, extracts key points, and organizes content."
                },
                {
                  step: "03",
                  title: "Download Presentation",
                  description: "Review, customize, and download your professional presentation."
                }
              ].map((step, index) => (
                <div 
                  key={index}
                  className="relative animate-fade-in opacity-0"
                  style={{ animationDelay: `${index * 200}ms`, animationFillMode: "forwards" }}
                >
                  <div className="absolute -left-4 -top-4 text-6xl font-bold text-gray-100">{step.step}</div>
                  <div className="relative bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all z-10">
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="w-full px-4 md:px-8 lg:px-16 py-24 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Security</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your confidential documents are protected with the highest security standards.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white rounded-xl p-8 shadow-md animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>
                <h3 className="text-xl font-semibold mb-4">Data Protection</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-600">End-to-end encryption for all document transfers</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-600">Automatic deletion of files after processing</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-600">No storage of document content on our servers</p>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-md animate-fade-in opacity-0 animate-delay-200" style={{ animationFillMode: "forwards" }}>
                <h3 className="text-xl font-semibold mb-4">Compliance</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-600">GDPR compliant data processing</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-600">SOC 2 Type II certified infrastructure</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-600">Regular security audits and penetration testing</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-4 md:px-8 lg:px-16 py-24 bg-gradient-to-r from-primary/10 to-blue-600/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Documents?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Join thousands of professionals who save hours creating presentations.
            </p>
            <Button 
              size="lg" 
              className="rounded-full shadow-lg hover:shadow-xl transition-all px-8 group"
              onClick={() => navigate('/dashboard')}
            >
              Start Creating Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="w-full px-4 md:px-8 lg:px-16 py-12 bg-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 mb-4">
              Docu<span className="font-light">Slide</span>
            </div>
            <p className="text-gray-600 mb-4">
              Transform documents into beautiful presentations with AI.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-primary transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#security" className="text-gray-600 hover:text-primary transition-colors">Security</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-center">
            © {new Date().getFullYear()} DocuSlide. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
