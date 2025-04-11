
import React from 'react';
import { PDFProvider } from '@/contexts/PDFContext';
import PDFUploader from '@/components/PDFUploader';
import PDFViewer from '@/components/PDFViewer';
import PDFProcessor from '@/components/PDFProcessor';
import Header from '@/components/Header';
import StatusBar from '@/components/StatusBar';
import { usePDF } from '@/contexts/PDFContext';

const AppContent: React.FC = () => {
  const { pdfFile, isPdfVisible } = usePDF();
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <main className="flex-1 overflow-hidden">
        <div className="container mx-auto p-4 md:p-6 h-full">
          {!pdfFile ? (
            <div className="flex items-center justify-center h-full">
              <div className="max-w-md w-full fade-in">
                <PDFUploader />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full fade-in">
              {isPdfVisible && (
                <div className="h-full overflow-hidden">
                  <PDFViewer />
                </div>
              )}
              <div className={`h-full overflow-hidden ${isPdfVisible ? '' : 'md:col-span-2'}`}>
                <PDFProcessor />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <StatusBar />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <PDFProvider>
      <AppContent />
    </PDFProvider>
  );
};

export default Index;
