
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { FileText, FilePieChart, ListChecks, Presentation, Loader2 } from 'lucide-react';
import { usePDF } from '@/contexts/PDFContext';
import { generateSummary, extractKeyPoints, generateSlides } from '@/utils/pdfUtils';
import { toast } from 'sonner';

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
  
  const [summaryLength, setSummaryLength] = useState<number>(500);
  const [keyPointsCount, setKeyPointsCount] = useState<number>(10);
  const [slidesCount, setSlidesCount] = useState<number>(5);
  
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
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>PDF Insights</CardTitle>
      </CardHeader>
      
      <CardContent className="overflow-auto h-full">
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary" disabled={isLoading}>
              <FileText className="mr-2 h-4 w-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="keypoints" disabled={isLoading}>
              <ListChecks className="mr-2 h-4 w-4" />
              Key Points
            </TabsTrigger>
            <TabsTrigger value="slides" disabled={isLoading}>
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
              </div>
              <Slider
                value={[summaryLength]}
                min={200}
                max={1000}
                step={50}
                onValueChange={(value) => setSummaryLength(value[0])}
                disabled={isLoading}
              />
            </div>
            
            <Button
              onClick={handleGenerateSummary}
              className="w-full bg-gradient-to-r from-primary to-accent"
              disabled={!pdfText || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Summary
                </>
              )}
            </Button>
            
            {pdfSummary && (
              <div className="mt-4 p-4 bg-secondary rounded-md">
                <h3 className="font-semibold mb-2">Document Summary</h3>
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
              </div>
              <Slider
                value={[keyPointsCount]}
                min={5}
                max={20}
                step={1}
                onValueChange={(value) => setKeyPointsCount(value[0])}
                disabled={isLoading}
              />
            </div>
            
            <Button
              onClick={handleExtractKeyPoints}
              className="w-full bg-gradient-to-r from-primary to-accent"
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
              <div className="mt-4 p-4 bg-secondary rounded-md">
                <h3 className="font-semibold mb-2">Key Points</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {pdfKeyPoints.map((point, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {point}
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
              </div>
              <Slider
                value={[slidesCount]}
                min={3}
                max={10}
                step={1}
                onValueChange={(value) => setSlidesCount(value[0])}
                disabled={isLoading}
              />
            </div>
            
            <Button
              onClick={handleGenerateSlides}
              className="w-full bg-gradient-to-r from-primary to-accent"
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
              <div className="mt-4 space-y-6">
                {pdfSlides.map((slide, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="prose prose-sm max-w-none">
                        <div className="font-bold text-lg mb-2">
                          Slide {index + 1}
                        </div>
                        <div className="whitespace-pre-line text-sm">
                          {slide.split('\n').map((line, i) => (
                            <div key={i} className={line.startsWith('#') ? "text-lg font-bold mb-2" : "mb-2"}>
                              {line.startsWith('#') ? line.replace(/^#\s/, '') : line}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PDFProcessor;
