
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getSlideIconName, generateSlideTheme } from '@/utils/pdfUtils';
import { BookOpen, FileText, ListChecks, Clipboard, BarChart, PieChart, Map, Lightbulb, CheckCircle, Flag, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const SlideCard = ({ slideContent, index, onDownload }) => {
  const iconMap = {
    'BookOpen': <BookOpen className="h-5 w-5" />,
    'FileText': <FileText className="h-5 w-5" />,
    'ListChecks': <ListChecks className="h-5 w-5" />,
    'Clipboard': <Clipboard className="h-5 w-5" />,
    'BarChart': <BarChart className="h-5 w-5" />,
    'PieChart': <PieChart className="h-5 w-5" />,
    'Map': <Map className="h-5 w-5" />,
    'Lightbulb': <Lightbulb className="h-5 w-5" />,
    'CheckCircle': <CheckCircle className="h-5 w-5" />,
    'Flag': <Flag className="h-5 w-5" />
  };

  const getSlideTitle = () => {
    const titleMatch = slideContent.match(/^# ([^\\n]+)/);
    return titleMatch ? titleMatch[1] : `Slide ${index + 1}`;
  };

  const formatSlideContent = () => {
    const lines = slideContent.split('\n');
    let inTitle = false;
    
    return (
      <>
        {lines.map((line, i) => {
          if (line.startsWith('# ')) {
            inTitle = true;
            return null; // Skip title line as we display it separately
          }
          
          if (line.startsWith('• ')) {
            return (
              <div key={i} className="flex items-start mt-2">
                <div className="h-2 w-2 rounded-full bg-white/80 mt-2 mr-2 flex-shrink-0"></div>
                <p className="text-sm">{line.substring(2)}</p>
              </div>
            );
          }
          
          if (line.trim() === '') {
            inTitle = false;
            return <div key={i} className="h-2"></div>;
          }
          
          return (
            <p key={i} className={`${inTitle ? 'text-sm font-medium' : 'text-sm'} mb-1`}>{line}</p>
          );
        })}
      </>
    );
  };

  const iconName = getSlideIconName(slideContent);
  const theme = generateSlideTheme(index);
  const slideTitle = getSlideTitle();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-white/10">
        <div className={`bg-gradient-to-r ${theme} p-3 text-white flex items-center gap-2 border-b border-white/10`}>
          <div className="bg-white/20 p-1.5 rounded-full">
            {iconMap[iconName] || <FileText className="h-5 w-5" />}
          </div>
          <h3 className="font-semibold">{slideTitle}</h3>
          <div className="ml-auto text-xs bg-white/20 rounded-full px-2 py-0.5">
            {index + 1}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="prose prose-sm max-w-none text-card-foreground">
            {formatSlideContent()}
          </div>
          
          {onDownload && (
            <div className="mt-4 flex justify-end">
              <Button 
                size="sm" 
                variant="ghost" 
                className="flex items-center gap-1 text-xs opacity-70 hover:opacity-100"
                onClick={() => onDownload(slideContent, `slide-${index + 1}.md`)}
              >
                <Download className="h-3 w-3" /> 
                Download
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SlideCard;
