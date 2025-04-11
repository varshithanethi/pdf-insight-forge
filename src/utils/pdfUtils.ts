
import * as pdfjsLib from 'pdfjs-dist';
import { toast } from 'sonner';

// Set the workerSrc property of the PDF.js library
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

/**
 * Extract text from a PDF file
 */
export const extractTextFromPdf = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const textItems = textContent.items.map((item: any) => item.str).join(' ');
      fullText += textItems + '\n\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    toast.error('Failed to extract text from PDF');
    return '';
  }
};

/**
 * Generate a summary of the PDF text
 */
export const generateSummary = (text: string, maxLength: number = 500): string => {
  if (!text) return '';
  
  // Simple summarization by extracting first few sentences
  // In a real app, we'd use a more sophisticated algorithm or AI
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
  let summary = '';
  let currentLength = 0;
  
  for (const sentence of sentences) {
    if (currentLength + sentence.length <= maxLength) {
      summary += sentence + ' ';
      currentLength += sentence.length;
    } else {
      break;
    }
  }
  
  return summary.trim();
};

/**
 * Extract key points from the PDF text
 */
export const extractKeyPoints = (text: string, maxPoints: number = 10): string[] => {
  if (!text) return [];
  
  // Simple extraction of sentences that might be key points
  // In a real app, we'd use a more sophisticated algorithm or AI
  const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];
  const keyPoints: string[] = [];
  
  // Look for sentences that might be bullet points or contain important keywords
  const importantKeywords = ['important', 'key', 'crucial', 'significant', 'essential', 'main', 'primary'];
  
  for (const sentence of sentences) {
    // Check if the sentence contains any important keywords
    if (importantKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
      keyPoints.push(sentence.trim());
      if (keyPoints.length >= maxPoints) break;
    }
  }
  
  // If we didn't find enough key points, just use the first few sentences
  if (keyPoints.length < maxPoints) {
    for (const sentence of sentences) {
      if (!keyPoints.includes(sentence.trim()) && sentence.length > 30) {
        keyPoints.push(sentence.trim());
        if (keyPoints.length >= maxPoints) break;
      }
    }
  }
  
  return keyPoints;
};

/**
 * Generate presentation slides from the PDF text
 */
export const generateSlides = (text: string, maxSlides: number = 5): string[] => {
  if (!text) return [];
  
  // Simple slide generation by splitting text into sections
  // In a real app, we'd use a more sophisticated algorithm or AI
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const slides: string[] = [];
  
  // Create a slide for the introduction
  if (paragraphs.length > 0) {
    slides.push(`# Introduction\n\n${paragraphs[0].substring(0, 200)}...`);
  }
  
  // Try to find sections in the document
  const remainingParagraphs = paragraphs.slice(1);
  let currentSection = '';
  
  for (const paragraph of remainingParagraphs) {
    const firstLine = paragraph.split('\n')[0];
    
    // Check if this paragraph looks like a section heading
    if (firstLine.length < 60 && !firstLine.endsWith('.')) {
      if (currentSection) {
        slides.push(currentSection);
        if (slides.length >= maxSlides) break;
      }
      
      currentSection = `# ${firstLine}\n\n`;
    } else {
      currentSection += `${paragraph.substring(0, 150)}...\n\n`;
    }
  }
  
  // Add the last section if it exists
  if (currentSection && slides.length < maxSlides) {
    slides.push(currentSection);
  }
  
  // If we don't have enough slides, create more from the text
  if (slides.length < maxSlides && paragraphs.length > 0) {
    const chunks = Math.ceil(paragraphs.length / maxSlides);
    
    for (let i = 0; i < paragraphs.length; i += chunks) {
      if (slides.length >= maxSlides) break;
      
      const chunk = paragraphs.slice(i, i + chunks).join('\n\n');
      const title = `# Section ${slides.length + 1}`;
      slides.push(`${title}\n\n${chunk.substring(0, 200)}...`);
    }
  }
  
  return slides;
};

/**
 * Generate a mock image URL for a PDF visualization
 * In a real app, we'd generate actual visualizations
 */
export const generateMockVisualizations = (text: string): string => {
  // For the initial implementation, we'll return a placeholder image
  // In a real app, we would generate actual visualizations
  return 'https://via.placeholder.com/800x400?text=Document+Visualization';
};
