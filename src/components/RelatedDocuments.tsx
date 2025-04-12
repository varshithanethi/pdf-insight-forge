
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { usePDF } from '@/contexts/PDFContext';

const RelatedDocuments: React.FC = () => {
  const { relatedDocuments } = usePDF();

  if (relatedDocuments.length === 0) {
    return null;
  }

  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-card to-secondary/30 backdrop-blur-sm">
      <CardHeader className="border-b border-border/40">
        <CardTitle className="text-gradient font-bold">Related Documents</CardTitle>
        <CardDescription>
          Documents similar to your current PDF
        </CardDescription>
      </CardHeader>
      
      <CardContent className="overflow-auto pt-6">
        <div className="space-y-4">
          {relatedDocuments.map((doc) => (
            <div key={doc.id} className="flex items-start p-4 rounded-lg border border-border/40 bg-card/50 hover:bg-card/80 transition-colors animate-fade-in">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 mr-4 flex-shrink-0">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-md font-medium truncate">{doc.title}</h3>
                  <Badge variant="secondary" className="ml-2 flex-shrink-0">
                    {Math.round(doc.similarity * 100)}% match
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {doc.description}
                </p>
                <div className="flex mt-3 gap-2">
                  <Button variant="outline" size="sm" className="text-xs" asChild>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      View
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs" asChild>
                    <a href={doc.url} download>
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedDocuments;
