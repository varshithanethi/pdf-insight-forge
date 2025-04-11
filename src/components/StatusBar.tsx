
import React from 'react';
import { Loader2, User, FileText, CheckCircle2, Clock, Activity, Shield, Image } from 'lucide-react';
import { usePDF } from '@/contexts/PDFContext';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const StatusBar: React.FC = () => {
  const { isLoading, processingStep, pdfFile, generatedImages } = usePDF();
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="border-t border-border/40 py-2 px-4 text-sm text-muted-foreground flex items-center justify-between bg-background/70 backdrop-blur-sm">
      <div className="flex items-center">
        {isLoading ? (
          <div className="flex items-center gap-4 animate-pulse">
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-accent" />
            <span className="text-accent">{processingStep}</span>
            <Progress value={45} className="w-24 h-2" />
          </div>
        ) : (
          <div className="flex items-center">
            {pdfFile ? (
              <div className="flex items-center text-primary/80">
                <CheckCircle2 className="mr-2 h-4 w-4 text-accent" />
                <span className="font-medium">{pdfFile.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({Math.round(pdfFile.size / 1024)} KB)
                </span>
                {generatedImages.length > 0 && (
                  <Badge variant="outline" className="ml-3 text-xs flex items-center">
                    <Image className="h-3 w-3 mr-1" />
                    {generatedImages.length} images
                  </Badge>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>No file loaded</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        {isAuthenticated && (
          <div className="flex items-center mr-4 px-2 py-1 rounded-full bg-primary/5 border border-primary/10">
            <User className="h-3 w-3 mr-2 text-accent" />
            <span className="text-xs mr-2">{user?.email}</span>
            {user?.role === "Admin" ? (
              <Badge variant="accent" className="h-5 px-1.5 py-0 flex items-center text-[10px]">
                <Shield className="h-2.5 w-2.5 mr-1" />
                Admin
              </Badge>
            ) : (
              <Badge variant="secondary" className="h-5 px-1.5 py-0 flex items-center text-[10px]">
                User
              </Badge>
            )}
          </div>
        )}
        <div className="flex items-center gap-2">
          <Activity className="h-3 w-3 text-accent" />
          <span className="text-xs opacity-70">PDF Insight Forge v1.2</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
