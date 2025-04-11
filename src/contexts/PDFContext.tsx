
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PDFContextType {
  pdfFile: File | null;
  pdfText: string;
  pdfSummary: string;
  pdfKeyPoints: string[];
  pdfSlides: string[];
  isLoading: boolean;
  processingStep: string;
  isPdfVisible: boolean;
  setPdfFile: (file: File | null) => void;
  setPdfText: (text: string) => void;
  setPdfSummary: (summary: string) => void;
  setPdfKeyPoints: (keyPoints: string[]) => void;
  setPdfSlides: (slides: string[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setProcessingStep: (step: string) => void;
  setIsPdfVisible: (isVisible: boolean) => void;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

export const PDFProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>('');
  const [pdfSummary, setPdfSummary] = useState<string>('');
  const [pdfKeyPoints, setPdfKeyPoints] = useState<string[]>([]);
  const [pdfSlides, setPdfSlides] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [isPdfVisible, setIsPdfVisible] = useState<boolean>(true);

  return (
    <PDFContext.Provider
      value={{
        pdfFile,
        pdfText,
        pdfSummary,
        pdfKeyPoints,
        pdfSlides,
        isLoading,
        processingStep,
        isPdfVisible,
        setPdfFile,
        setPdfText,
        setPdfSummary,
        setPdfKeyPoints,
        setPdfSlides,
        setIsLoading,
        setProcessingStep,
        setIsPdfVisible
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
