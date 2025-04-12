
import React, { useEffect } from 'react';
import { PDFProvider, usePDF } from '@/contexts/PDFContext';
import PDFUploader from '@/components/PDFUploader';
import PDFViewer from '@/components/PDFViewer';
import PDFProcessor from '@/components/PDFProcessor';
import Header from '@/components/Header';
import StatusBar from '@/components/StatusBar';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';

const AppContent = () => {
  const { pdfFile, isPdfVisible, darkMode, sidebarOpen } = usePDF();
  const { isAuthenticated } = useAuth();
  
  // Apply dark mode to the root html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark bg-slate-900 text-slate-100' : ''}`}>
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {pdfFile && <Sidebar />}
        
        <main className={`flex-1 overflow-hidden transition-all duration-300 ${sidebarOpen && pdfFile ? 'ml-64' : 'ml-0'}`}>
          <div className="container mx-auto p-4 md:p-6 h-full">
            {!pdfFile ? (
              <div className="flex items-center justify-center h-full">
                <div className="max-w-md w-full zoom-in">
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
      </div>
      
      <StatusBar />
    </div>
  );
};

const Index = () => {
  return (
    <PDFProvider>
      <AppContent />
    </PDFProvider>
  );
};

export default Index;
