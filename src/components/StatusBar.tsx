
import React from 'react';
import { Loader2, User, FileText } from 'lucide-react';
import { usePDF } from '@/contexts/PDFContext';
import { useAuth } from '@/contexts/AuthContext';

const StatusBar: React.FC = () => {
  const { isLoading, processingStep, pdfFile } = usePDF();
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="border-t border-border/40 py-2 px-4 text-sm text-muted-foreground flex items-center justify-between bg-background/70 backdrop-blur-sm">
      <div className="flex items-center">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>{processingStep}</span>
          </>
        ) : (
          <div className="flex items-center">
            <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              {pdfFile ? `File loaded: ${pdfFile.name}` : 'No file loaded'}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        {isAuthenticated && (
          <div className="flex items-center mr-4">
            <User className="h-3 w-3 mr-2 text-accent" />
            <span className="text-xs">{user?.email}</span>
          </div>
        )}
        <span className="text-xs opacity-50">PDF Insight Forge v1.0</span>
      </div>
    </div>
  );
};

export default StatusBar;
