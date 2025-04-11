
import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, FileText } from 'lucide-react';
import { usePDF } from '@/contexts/PDFContext';
import { extractTextFromPdf } from '@/utils/pdfUtils';
import { toast } from 'sonner';

const PDFUploader: React.FC = () => {
  const { setPdfFile, setIsLoading, setProcessingStep, setPdfText } = usePDF();
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
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
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        await handleFile(file);
      }
    },
    [setPdfFile, setIsLoading, setProcessingStep, setPdfText]
  );

  const handleFile = async (file: File) => {
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
    <Card
      className={`border-2 border-dashed p-10 text-center transition-all ${
        isDragging ? 'border-primary bg-primary/5' : 'border-border'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <FileText className="h-8 w-8 text-primary" />
      </div>
      
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
        <Button 
          onClick={() => document.getElementById('pdf-upload')?.click()}
          className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
        >
          <Upload className="mr-2 h-4 w-4" />
          Select PDF
        </Button>
      </div>
    </Card>
  );
};

export default PDFUploader;
