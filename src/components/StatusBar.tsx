
import React from 'react';
import { Loader2 } from 'lucide-react';
import { usePDF } from '@/contexts/PDFContext';

const StatusBar: React.FC = () => {
  const { isLoading, processingStep, pdfFile } = usePDF();
  
  return (
    <div className="border-t py-2 px-4 text-sm text-muted-foreground flex items-center justify-between">
      <div className="flex items-center">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>{processingStep}</span>
          </>
        ) : (
          <span>
            {pdfFile ? `File loaded: ${pdfFile.name}` : 'No file loaded'}
          </span>
        )}
      </div>
      
      <div>
        <span className="text-xs opacity-50">PDF Insight Forge v1.0</span>
      </div>
    </div>
  );
};

export default StatusBar;
