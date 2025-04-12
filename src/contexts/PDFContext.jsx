
import React, { createContext, useContext, useState } from 'react';

const PDFContext = createContext(undefined);

export const PDFProvider = ({ children }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfText, setPdfText] = useState('');
  const [pdfSummary, setPdfSummary] = useState('');
  const [pdfKeyPoints, setPdfKeyPoints] = useState([]);
  const [pdfSlides, setPdfSlides] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [isPdfVisible, setIsPdfVisible] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <PDFContext.Provider
      value={{
        pdfFile,
        pdfText,
        pdfSummary,
        pdfKeyPoints,
        pdfSlides,
        generatedImages,
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

export const usePDF = () => {
  const context = useContext(PDFContext);
  if (context === undefined) {
    throw new Error('usePDF must be used within a PDFProvider');
  }
  return context;
};
