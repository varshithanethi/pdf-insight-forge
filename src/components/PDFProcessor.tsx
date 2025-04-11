
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { FileText, FilePieChart, ListChecks, Presentation, Loader2, CheckCircle2, Sparkles, Download, Lock, Shield } from 'lucide-react';
import { usePDF } from '@/contexts/PDFContext';
import { generateSummary, extractKeyPoints, generateSlides } from '@/utils/pdfUtils';
import { toast } from 'sonner';
import SlideCard from './SlideCard';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

const PDFProcessor: React.FC = () => {
  const {
    pdfText,
    setPdfSummary,
    setPdfKeyPoints,
    setPdfSlides,
    pdfSummary,
    pdfKeyPoints,
    pdfSlides,
    isLoading,
    setIsLoading,
    setProcessingStep
  } = usePDF();
  
  const { isAuthenticated, setShowAuthModal, isAdmin } = useAuth();
  
  const [summaryLength, setSummaryLength] = useState<number>(500);
  const [keyPointsCount, setKeyPointsCount] = useState<number>(10);
  const [slidesCount, setSlidesCount] = useState<number>(5);
  const [maxAllowedSlides, setMaxAllowedSlides] = useState<number>(10);
  
  // Set maximum slides based on user role
  useEffect(() => {
    setMaxAllowedSlides(isAdmin ? 20 : 10);
  }, [isAdmin]);
  
  const handleGenerateSummary = () => {
    if (!pdfText) {
      toast.error('Please upload a PDF first');
      return;
    }
    
    setIsLoading(true);
    setProcessingStep('Generating summary...');
    
    try {
      const summary = generateSummary(pdfText, summaryLength);
      setPdfSummary(summary);
      toast.success('Summary generated successfully');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary');
    } finally {
      setIsLoading(false);
      setProcessingStep('');
    }
  };
  
  const handleExtractKeyPoints = () => {
    if (!pdfText) {
      toast.error('Please upload a PDF first');
      return;
    }
    
    setIsLoading(true);
    setProcessingStep('Extracting key points...');
    
    try {
      const keyPoints = extractKeyPoints(pdfText, keyPointsCount);
      setPdfKeyPoints(keyPoints);
      toast.success('Key points extracted successfully');
    } catch (error) {
      console.error('Error extracting key points:', error);
      toast.error('Failed to extract key points');
    } finally {
      setIsLoading(false);
      setProcessingStep('');
    }
  };
  
  const handleGenerateSlides = () => {
    if (!pdfText) {
      toast.error('Please upload a PDF first');
      return;
    }
    
    setIsLoading(true);
    setProcessingStep('Generating slides...');
    
    try {
      const slides = generateSlides(pdfText, slidesCount);
      setPdfSlides(slides);
      toast.success('Slides generated successfully');
    } catch (error) {
      console.error('Error generating slides:', error);
      toast.error('Failed to generate slides');
    } finally {
      setIsLoading(false);
      setProcessingStep('');
    }
  };

  const handleDownload = (content: string, filename: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to download content');
      setShowAuthModal(true);
      return;
    }
    
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(`Downloaded ${filename}`);
  };
  
  return (
    <Card className="h-full border-none shadow-lg bg-gradient-to-br from-card to-secondary/30 backdrop-blur-sm">
      <CardHeader className="border-b border-border/40">
        <div className="flex justify-between items-center">
          <CardTitle className="text-gradient font-bold">PDF Insights</CardTitle>
          {isAdmin && (
            <Badge variant="accent" className="flex items-center animate-fade-in">
              <Shield className="mr-1 h-3 w-3" /> Admin Features Enabled
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="overflow-auto h-full pt-6">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-background/50 p-1">
            <TabsTrigger value="summary" disabled={isLoading} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="mr-2 h-4 w-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="keypoints" disabled={isLoading} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ListChecks className="mr-2 h-4 w-4" />
              Key Points
            </TabsTrigger>
            <TabsTrigger value="slides" disabled={isLoading} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Presentation className="mr-2 h-4 w-4" />
              Slides
            </TabsTrigger>
          </TabsList>
          
          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">
                  Summary Length: {summaryLength} characters
                </label>
                {isAdmin && (
                  <Badge variant="outline" className="text-xs">
                    Advanced Options
                  </Badge>
                )}
              </div>
              <Slider
                value={[summaryLength]}
                min={200}
                max={isAdmin ? 2000 : 1000}
                step={50}
                onValueChange={(value) => setSummaryLength(value[0])}
                disabled={isLoading}
                className={isAdmin ? "accent-accent" : ""}
              />
            </div>
            
            <Button
              onClick={handleGenerateSummary}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              disabled={!pdfText || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Summary
                </>
              )}
            </Button>
            
            {pdfSummary && (
              <div className="mt-6 p-6 bg-secondary/50 backdrop-blur-sm rounded-md border border-border/50 animate-fade-in relative">
                <div className="absolute right-2 top-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDownload(pdfSummary, 'pdf-summary.txt')}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
                <h3 className="font-semibold mb-4 text-lg">Document Summary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{pdfSummary}</p>
              </div>
            )}
          </TabsContent>
          
          {/* Key Points Tab */}
          <TabsContent value="keypoints" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">
                  Number of Key Points: {keyPointsCount}
                </label>
                {isAdmin && (
                  <Badge variant="outline" className="text-xs">
                    Advanced Options
                  </Badge>
                )}
              </div>
              <Slider
                value={[keyPointsCount]}
                min={5}
                max={isAdmin ? 30 : 20}
                step={1}
                onValueChange={(value) => setKeyPointsCount(value[0])}
                disabled={isLoading}
                className={isAdmin ? "accent-accent" : ""}
              />
            </div>
            
            <Button
              onClick={handleExtractKeyPoints}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              disabled={!pdfText || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <ListChecks className="mr-2 h-4 w-4" />
                  Extract Key Points
                </>
              )}
            </Button>
            
            {pdfKeyPoints.length > 0 && (
              <div className="mt-6 p-6 bg-secondary/50 backdrop-blur-sm rounded-md border border-border/50 animate-fade-in relative">
                <div className="absolute right-2 top-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDownload(pdfKeyPoints.join("\n\n"), 'pdf-key-points.txt')}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </div>
                <h3 className="font-semibold mb-4 text-lg">Key Points</h3>
                <ul className="space-y-3">
                  {pdfKeyPoints.map((point, index) => (
                    <li key={index} className="flex items-start text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <CheckCircle2 className="h-5 w-5 mr-3 text-accent flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>
          
          {/* Slides Tab */}
          <TabsContent value="slides" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">
                  Number of Slides: {slidesCount}
                </label>
                {isAdmin ? (
                  <Badge variant="accent" className="text-xs flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Admin: {maxAllowedSlides} slides max
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <Lock className="h-3 w-3" /> 10 slides max
                  </Badge>
                )}
              </div>
              <Slider
                value={[slidesCount]}
                min={3}
                max={maxAllowedSlides}
                step={1}
                onValueChange={(value) => setSlidesCount(value[0])}
                disabled={isLoading}
                className={isAdmin ? "accent-accent" : ""}
              />
            </div>
            
            <Button
              onClick={handleGenerateSlides}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              disabled={!pdfText || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Presentation className="mr-2 h-4 w-4" />
                  Generate Slides
                </>
              )}
            </Button>
            
            {pdfSlides.length > 0 && (
              <>
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownload(pdfSlides.join("\n\n---\n\n"), 'pdf-slides.md')}
                    className="text-xs"
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Download All Slides
                  </Button>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  {pdfSlides.map((slide, index) => (
                    <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                      <SlideCard slideContent={slide} index={index} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PDFProcessor;
