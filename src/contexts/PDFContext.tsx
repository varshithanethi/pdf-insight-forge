
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RelatedDocument {
  id: string;
  title: string;
  description: string;
  similarity: number;
  url: string;
}

interface PDFContextType {
  pdfFile: File | null;
  pdfText: string;
  pdfSummary: string;
  pdfKeyPoints: string[];
  pdfSlides: string[];
  generatedImages: { url: string; title: string; description: string }[];
  relatedDocuments: RelatedDocument[];
  isLoading: boolean;
  processingStep: string;
  isPdfVisible: boolean;
  darkMode: boolean;
  sidebarOpen: boolean;
  setPdfFile: (file: File | null) => void;
  setPdfText: (text: string) => void;
  setPdfSummary: (summary: string) => void;
  setPdfKeyPoints: (keyPoints: string[]) => void;
  setPdfSlides: (slides: string[]) => void;
  setGeneratedImages: (images: { url: string; title: string; description: string }[]) => void;
  setRelatedDocuments: (documents: RelatedDocument[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setProcessingStep: (step: string) => void;
  setIsPdfVisible: (isVisible: boolean) => void;
  setDarkMode: (darkMode: boolean) => void;
  setSidebarOpen: (sidebarOpen: boolean) => void;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

export const PDFProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>('');
  const [pdfSummary, setPdfSummary] = useState<string>('');
  const [pdfKeyPoints, setPdfKeyPoints] = useState<string[]>([]);
  const [pdfSlides, setPdfSlides] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<{ url: string; title: string; description: string }[]>([]);
  const [relatedDocuments, setRelatedDocuments] = useState<RelatedDocument[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [isPdfVisible, setIsPdfVisible] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <PDFContext.Provider
      value={{
        pdfFile,
        pdfText,
        pdfSummary,
        pdfKeyPoints,
        pdfSlides,
        generatedImages,
        relatedDocuments,
        isLoading,
        processingStep,
        isPdfVisible,
        darkMode,
        sidebarOpen,
        setPdfFile,
        setPdfText,
        setPdfSummary,
        setPdfKeyPoints,
        setPdfSlides,
        setGeneratedImages,
        setRelatedDocuments,
        setIsLoading,
        setProcessingStep,
        setIsPdfVisible,
        setDarkMode,
        setSidebarOpen
      }}
    >
      {children}
    </PDFContext.Provider>
  );
};

export const usePDF = (): PDFContextType => {
  const context = useContext(PDFContext);
  if (context === undefined) {
    throw new Error('usePDF must be used within a PDFProvider');
  }
  return context;
};
