
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react';
import { usePDF } from '@/contexts/PDFContext';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer: React.FC = () => {
  const { pdfFile, isPdfVisible, setIsPdfVisible } = usePDF();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const nextPage = () => {
    if (numPages && pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const zoomIn = () => {
    setScale(scale + 0.1);
  };

  const zoomOut = () => {
    if (scale > 0.5) {
      setScale(scale - 0.1);
    }
  };

  if (!pdfFile || !isPdfVisible) {
    return null;
  }

  return (
    <Card className="h-full overflow-hidden">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={pageNumber <= 1}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm">
            Page {pageNumber} of {numPages || '?'}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={numPages === null || pageNumber >= numPages}
            className="ml-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={zoomOut}>
            -
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <Button variant="outline" size="sm" onClick={zoomIn}>
            +
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPdfVisible(!isPdfVisible)}
          >
            {isPdfVisible ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <CardContent className="pdf-container p-0">
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex h-96 items-center justify-center">
              <Skeleton className="h-96 w-full" />
            </div>
          }
        >
          <div className="page-container">
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={
                <Skeleton className="h-96 w-full" />
              }
            />
          </div>
        </Document>
      </CardContent>
    </Card>
  );
};

export default PDFViewer;
