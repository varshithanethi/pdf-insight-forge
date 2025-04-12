
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText } from 'lucide-react';
import { usePDF } from '@/contexts/PDFContext';
import { extractTextFromPdf } from '@/utils/pdfUtils';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const PDFUploader = () => {
  const { setPdfFile, setIsLoading, setProcessingStep, setPdfText, darkMode } = usePDF();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;

      if (files.length > 0) {
        const file = files[0];
        await handleFile(file);
      }
    },
    [setPdfFile, setIsLoading, setProcessingStep, setPdfText]
  );

  const handleFileInput = useCallback(
    async (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        await handleFile(file);
      }
    },
    [setPdfFile, setIsLoading, setProcessingStep, setPdfText]
  );

  const handleFile = async (file) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setPdfFile(file);
    setIsLoading(true);
    setProcessingStep('Extracting text from PDF...');

    try {
      const text = await extractTextFromPdf(file);
      setPdfText(text);
      toast.success('PDF uploaded successfully');
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast.error('Failed to process PDF');
    } finally {
      setIsLoading(false);
      setProcessingStep('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card
        className={`border-2 border-dashed p-10 text-center transition-all ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        } ${darkMode ? 'dark bg-slate-800' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <motion.div 
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FileText className="h-8 w-8 text-primary" />
        </motion.div>
        
        <h3 className="mb-2 text-xl font-semibold">Upload Your PDF</h3>
        <p className="mb-6 text-muted-foreground">
          Drag and drop your PDF file here, or click to browse
        </p>
        
        <div className="mt-4">
          <input
            type="file"
            id="pdf-upload"
            accept=".pdf"
            onChange={handleFileInput}
            className="hidden"
          />
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button 
              onClick={() => document.getElementById('pdf-upload')?.click()}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <Upload className="mr-2 h-4 w-4" />
              Select PDF
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PDFUploader;
