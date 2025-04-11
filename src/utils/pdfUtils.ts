
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
  const importantKeywords = ['important', 'key', 'crucial', 'significant', 'essential', 'main', 'primary', 
    'critical', 'fundamental', 'notable', 'remarkable', 'major', 'vital', 'central', 'core'];
  
  for (const sentence of sentences) {
    // Check if the sentence contains any important keywords
    if (importantKeywords.some(keyword => sentence.toLowerCase().includes(keyword))) {
      keyPoints.push(sentence.trim());
      if (keyPoints.length >= maxPoints) break;
    }
  }
  
  // If we didn't find enough key points, look for sentences with numbers or dates
  if (keyPoints.length < maxPoints) {
    const numberPattern = /\d+/;
    for (const sentence of sentences) {
      if (!keyPoints.includes(sentence.trim()) && numberPattern.test(sentence) && sentence.length > 30) {
        keyPoints.push(sentence.trim());
        if (keyPoints.length >= maxPoints) break;
      }
    }
  }
  
  // If we still don't have enough, use the first few substantial sentences
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
  
  // Split text into paragraphs
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const slides: string[] = [];
  
  // Structure for different types of slides
  const slideTypes = [
    { title: 'Introduction', template: (content: string) => `# Introduction\n\n${content}\n\n• Key focus of this document\n• Essential background information` },
    { title: 'Overview', template: (content: string) => `# Overview\n\n${content}\n\n• Main points covered\n• Document structure` },
    { title: 'Key Points', template: (content: string) => `# Key Points\n\n${content}\n\n• Critical information\n• Important considerations` },
    { title: 'Details', template: (content: string) => `# Important Details\n\n${content}\n\n• Specific information\n• Technical aspects` },
    { title: 'Analysis', template: (content: string) => `# Analysis\n\n${content}\n\n• Interpretations\n• Implications` },
    { title: 'Statistics', template: (content: string) => `# Key Statistics\n\n${content}\n\n• Important numbers\n• Relevant data points` },
    { title: 'Context', template: (content: string) => `# Context\n\n${content}\n\n• Background information\n• Relevant history` },
    { title: 'Applications', template: (content: string) => `# Applications\n\n${content}\n\n• Practical uses\n• Implementations` },
    { title: 'Recommendations', template: (content: string) => `# Recommendations\n\n${content}\n\n• Suggested actions\n• Best practices` },
    { title: 'Conclusion', template: (content: string) => `# Conclusion\n\n${content}\n\n• Summary of main points\n• Final thoughts` },
    { title: 'Executive Summary', template: (content: string) => `# Executive Summary\n\n${content}\n\n• Overview for decision makers\n• Key takeaways` },
    { title: 'Research Findings', template: (content: string) => `# Research Findings\n\n${content}\n\n• Discoveries\n• Evidence-based conclusions` },
    { title: 'Market Analysis', template: (content: string) => `# Market Analysis\n\n${content}\n\n• Industry trends\n• Competitive landscape` },
    { title: 'Future Directions', template: (content: string) => `# Future Directions\n\n${content}\n\n• Next steps\n• Long-term vision` },
    { title: 'Methodology', template: (content: string) => `# Methodology\n\n${content}\n\n• Approach used\n• Techniques applied` },
    { title: 'Case Studies', template: (content: string) => `# Case Studies\n\n${content}\n\n• Real-world examples\n• Practical applications` },
    { title: 'Technical Details', template: (content: string) => `# Technical Details\n\n${content}\n\n• Specifications\n• Implementation notes` },
    { title: 'Risk Assessment', template: (content: string) => `# Risk Assessment\n\n${content}\n\n• Potential challenges\n• Mitigation strategies` },
    { title: 'Q&A', template: (content: string) => `# Q&A\n\n${content}\n\n• Common questions\n• Clarifications` },
    { title: 'References', template: (content: string) => `# References\n\n${content}\n\n• Sources cited\n• Further reading` }
  ];
  
  // Create initial slide
  if (paragraphs.length > 0) {
    slides.push(slideTypes[0].template(paragraphs[0].substring(0, 150)));
  }
  
  // Create additional slides based on content
  const keyPoints = extractKeyPoints(text, 3);
  if (keyPoints.length > 0) {
    const keyPointsText = keyPoints.map(point => `• ${point.substring(0, 80)}...`).join('\n\n');
    slides.push(slideTypes[2].template(keyPointsText));
  }
  
  // Try to find sections in the document
  let currentSection = '';
  let sectionHeading = '';
  let slideTypeIndex = 3; // Start with the 4th slide type after intro, overview, and key points
  
  for (const paragraph of paragraphs.slice(1)) {
    const firstLine = paragraph.split('\n')[0];
    
    // Check if this paragraph looks like a section heading
    if (firstLine.length < 60 && !firstLine.endsWith('.') && slideTypeIndex < slideTypes.length) {
      if (currentSection) {
        const slideType = slideTypes[slideTypeIndex % slideTypes.length];
        slides.push(slideType.template(currentSection));
        slideTypeIndex++;
        if (slides.length >= maxSlides) break;
      }
      
      sectionHeading = firstLine;
      currentSection = paragraph.substring(firstLine.length).trim().substring(0, 150);
    } else {
      currentSection += `\n\n${paragraph.substring(0, 100)}...`;
    }
  }
  
  // Add the last section
  if (currentSection && slides.length < maxSlides && slideTypeIndex < slideTypes.length) {
    const slideType = slideTypes[slideTypeIndex % slideTypes.length];
    slides.push(slideType.template(currentSection));
  }
  
  // Always include a conclusion slide if we have room
  if (slides.length < maxSlides && paragraphs.length > 1) {
    slides.push(slideTypes[9].template(paragraphs[paragraphs.length - 1].substring(0, 150)));
  }
  
  // Enhance slide generation with more topic-focused slides
  const topics = identifyTopics(text);
  for (const topic of topics) {
    if (slides.length >= maxSlides) break;
    
    // Find paragraphs related to this topic
    const relatedContent = paragraphs.find(p => p.toLowerCase().includes(topic.toLowerCase()));
    if (relatedContent) {
      const slideType = slideTypes[slides.length % slideTypes.length];
      slides.push(slideType.template(relatedContent.substring(0, 150)));
    }
  }
  
  // Fill any remaining slide slots
  while (slides.length < maxSlides && paragraphs.length > slides.length) {
    const index = slides.length % paragraphs.length;
    const slideType = slideTypes[slides.length % slideTypes.length];
    const content = paragraphs[index].substring(0, 150);
    slides.push(slideType.template(content));
  }
  
  return slides;
};

/**
 * Identify potential topics in the text
 */
const identifyTopics = (text: string): string[] => {
  if (!text) return [];
  
  const commonTopics = [
    'introduction', 'background', 'methodology', 'results', 'discussion', 
    'conclusion', 'recommendations', 'analysis', 'overview', 'summary',
    'research', 'findings', 'data', 'market', 'industry', 'trends',
    'challenges', 'solutions', 'implementation', 'strategy', 'future',
    'case study', 'examples', 'applications', 'benefits', 'risks',
    'technology', 'innovation', 'development', 'process', 'system',
    'management', 'performance', 'evaluation', 'assessment', 'review'
  ];
  
  const foundTopics: string[] = [];
  
  // Look for common topic words
  for (const topic of commonTopics) {
    if (text.toLowerCase().includes(topic)) {
      foundTopics.push(topic);
    }
  }
  
  // Look for capitalized phrases that might be section titles
  const potentialHeadings = text.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}/g) || [];
  for (const heading of potentialHeadings) {
    if (heading.length > 5 && !foundTopics.includes(heading)) {
      foundTopics.push(heading);
    }
  }
  
  return foundTopics.slice(0, 10); // Limit to 10 topics
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

/**
 * Generate color themes for slides based on content
 */
export const generateSlideTheme = (slideIndex: number): string => {
  const themes = [
    'from-blue-500 to-purple-500',
    'from-emerald-500 to-cyan-500',
    'from-pink-500 to-rose-500',
    'from-amber-500 to-orange-500',
    'from-indigo-500 to-sky-500',
    'from-green-500 to-teal-500',
    'from-red-500 to-pink-500',
    'from-violet-500 to-purple-500',
    'from-yellow-500 to-amber-500',
    'from-blue-500 to-indigo-500'
  ];
  
  return themes[slideIndex % themes.length];
};

/**
 * Generate icon name based on slide content
 */
export const getSlideIconName = (slideTitle: string): string => {
  const iconMap: Record<string, string> = {
    'Introduction': 'BookOpen',
    'Overview': 'FileText',
    'Key Points': 'ListChecks',
    'Important Details': 'Clipboard',
    'Analysis': 'BarChart',
    'Key Statistics': 'PieChart',
    'Context': 'Map',
    'Applications': 'Lightbulb',
    'Recommendations': 'CheckCircle',
    'Conclusion': 'Flag',
    'Executive Summary': 'FileText',
    'Research Findings': 'FileSearch',
    'Market Analysis': 'TrendingUp',
    'Future Directions': 'Compass',
    'Methodology': 'Microscope',
    'Case Studies': 'Layers',
    'Technical Details': 'Code',
    'Risk Assessment': 'AlertTriangle',
    'Q&A': 'HelpCircle',
    'References': 'Bookmark'
  };
  
  const titleMatch = slideTitle.match(/^# ([^\\n]+)/);
  const extractedTitle = titleMatch ? titleMatch[1] : '';
  
  return iconMap[extractedTitle] || 'FileText';
};
