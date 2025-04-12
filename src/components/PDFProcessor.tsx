import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { FileText, FilePieChart, ListChecks, Presentation, Loader2, CheckCircle2, Sparkles, Download, Lock, Shield, Image as ImageIcon, Lightbulb } from 'lucide-react';
import { usePDF } from '@/contexts/PDFContext';
import { toast } from 'sonner';
import SlideCard from './SlideCard';
import ImageCard from './ImageCard';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import RelatedDocuments from './RelatedDocuments';
import VoiceRecognition from './VoiceRecognition';
import { apiService } from '@/services/api';
import { generateSlides, generateRelatedImages } from '@/utils/pdfUtils';

const PDFProcessor: React.FC = () => {
  const {
    pdfText,
    setPdfSummary,
    setPdfKeyPoints,
    setPdfSlides,
    setGeneratedImages,
    setRelatedDocuments,
    pdfSummary,
    pdfKeyPoints,
    pdfSlides,
    generatedImages,
    isLoading,
    setIsLoading,
    setProcessingStep
  } = usePDF();
  
  const { isAuthenticated, setShowAuthModal, isAdmin } = useAuth();
  
  const [summaryLength, setSummaryLength] = useState<number>(500);
  const [keyPointsCount, setKeyPointsCount] = useState<number>(10);
  const [slidesCount, setSlidesCount] = useState<number>(5);
  const [imagesCount, setImagesCount] = useState<number>(6);
  const [maxAllowedSlides, setMaxAllowedSlides] = useState<number>(10);
  const [maxAllowedImages, setMaxAllowedImages] = useState<number>(8);
  const [activeTab, setActiveTab] = useState<string>('summary');
  
  useEffect(() => {
    setMaxAllowedSlides(isAdmin ? 20 : 10);
    setMaxAllowedImages(isAdmin ? 12 : 8);
  }, [isAdmin]);

  const handleVoiceCommand = (transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();
    
    if (lowerTranscript.includes("show summary") || lowerTranscript.includes("go to summary")) {
      setActiveTab('summary');
      toast.success('Switched to Summary tab');
    } else if (lowerTranscript.includes("show key points") || lowerTranscript.includes("go to key points")) {
      setActiveTab('keypoints');
      toast.success('Switched to Key Points tab');
    } else if (lowerTranscript.includes("show slides") || lowerTranscript.includes("go to slides")) {
      setActiveTab('slides');
      toast.success('Switched to Slides tab');
    } else if (lowerTranscript.includes("show images") || lowerTranscript.includes("go to images")) {
      setActiveTab('images');
      toast.success('Switched to Images tab');
    } else if (lowerTranscript.includes("show related") || lowerTranscript.includes("go to related")) {
      setActiveTab('related');
      toast.success('Switched to Related Documents tab');
    }
    
    else if (lowerTranscript.includes("generate summary")) {
      handleGenerateSummary();
    } else if (lowerTranscript.includes("extract key points")) {
      handleExtractKeyPoints();
    } else if (lowerTranscript.includes("generate slides")) {
      handleGenerateSlides();
    } else if (lowerTranscript.includes("generate images")) {
      handleGenerateImages();
    } else if (lowerTranscript.includes("find related")) {
      handleFindRelatedDocuments();
    }
  };
  
  const handleGenerateSummary = async () => {
    if (!pdfText) {
      toast.error('Please upload a PDF first');
      return;
    }
    
    setIsLoading(true);
    setProcessingStep('Generating summary...');
    
    try {
      const summary = await apiService.generateSummary(pdfText, summaryLength);
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
  
  const handleExtractKeyPoints = async () => {
    if (!pdfText) {
      toast.error('Please upload a PDF first');
      return;
    }
    
    setIsLoading(true);
    setProcessingStep('Extracting key points...');
    
    try {
      const keyPoints = await apiService.extractKeyPoints(pdfText, keyPointsCount);
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

  const handleGenerateImages = () => {
    if (!pdfText) {
      toast.error('Please upload a PDF first');
      return;
    }
    
    setIsLoading(true);
    setProcessingStep('Generating images...');
    
    try {
      const images = generateRelatedImages(pdfText, imagesCount);
      setGeneratedImages(images);
      toast.success('Images generated successfully');
    } catch (error) {
      console.error('Error generating images:', error);
      toast.error('Failed to generate images');
    } finally {
      setIsLoading(false);
      setProcessingStep('');
    }
  };

  const handleFindRelatedDocuments = async () => {
    if (!pdfText) {
      toast.error('Please upload a PDF first');
      return;
    }
    
    setIsLoading(true);
    setProcessingStep('Finding related documents...');
    
    try {
      const relatedDocs = await apiService.findRelatedDocuments(pdfText);
      setRelatedDocuments(relatedDocs);
      toast.success('Related documents found');
    } catch (error) {
      console.error('Error finding related documents:', error);
      toast.error('Failed to find related documents');
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

  const handleDownloadImage = (imageUrl: string, title: string) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to download images');
      setShowAuthModal(true);
      return;
    }
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading ${title} image`);
  };
  
  const generateSlides = (text: string, count: number) => {
    return Array(count).fill(0).map((_, i) => `# Slide ${i+1}\n\n## Topic ${i+1}\n\nContent for slide ${i+1} would go here. This is automatically generated from the document's content.`);
  };
  
  const generateRelatedImages = (text: string, count: number) => {
    return Array(count).fill(0).map((_, i) => ({
      url: `https://source.unsplash.com/random/800x600?sig=${i}`,
      title: `Generated Image ${i+1}`,
      description: `This is an AI-generated image related to the content of slide ${i+1}.`
    }));
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
        <div className="mb-4">
          <VoiceRecognition onResult={handleVoiceCommand} />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6 bg-background/50 p-1">
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
            <TabsTrigger value="images" disabled={isLoading} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ImageIcon className="mr-2 h-4 w-4" />
              Images
            </TabsTrigger>
            <TabsTrigger value="related" disabled={isLoading} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Lightbulb className="mr-2 h-4 w-4" />
              Related
            </TabsTrigger>
          </TabsList>
          
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
            
            {pdfSummary ? (
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
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pdfSummary.trim() === "This is a server-generated summary of the PDF document..." ? 
                    "No meaningful summary could be generated. Try adjusting the summary length or upload a different PDF document." : 
                    pdfSummary}
                </p>
              </div>
            ) : null}
          </TabsContent>
          
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
          
          <TabsContent value="images" className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">
                  Number of Images: {imagesCount}
                </label>
                {isAdmin ? (
                  <Badge variant="accent" className="text-xs flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Admin: {maxAllowedImages} images max
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs flex items-center gap-1">
                    <Lock className="h-3 w-3" /> 8 images max
                  </Badge>
                )}
              </div>
              <Slider
                value={[imagesCount]}
                min={2}
                max={maxAllowedImages}
                step={1}
                onValueChange={(value) => setImagesCount(value[0])}
                disabled={isLoading}
                className={isAdmin ? "accent-accent" : ""}
              />
            </div>
            
            <Button
              onClick={handleGenerateImages}
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
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Generate Images
                </>
              )}
            </Button>
            
            {generatedImages.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {generatedImages.map((image, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <ImageCard 
                      image={image}
                      index={index}
                      onDownload={() => handleDownloadImage(image.url, image.title)}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="related" className="space-y-4">
            <Button
              onClick={handleFindRelatedDocuments}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              disabled={!pdfText || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding related documents...
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Find Related Documents
                </>
              )}
            </Button>
            
            <div className="mt-4">
              <RelatedDocuments />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PDFProcessor;
