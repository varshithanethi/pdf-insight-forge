
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getSlideIconName, generateSlideTheme } from '@/utils/pdfUtils';
import { BookOpen, FileText, ListChecks, Clipboard, BarChart, PieChart, Map, Lightbulb, CheckCircle, Flag } from 'lucide-react';

interface SlideCardProps {
  slideContent: string;
  index: number;
}

const SlideCard: React.FC<SlideCardProps> = ({ slideContent, index }) => {
  const iconMap: Record<string, React.ReactNode> = {
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

  const getSlideTitle = (): string => {
    const titleMatch = slideContent.match(/^# ([^\\n]+)/);
    return titleMatch ? titleMatch[1] : `Slide ${index + 1}`;
  };

  const formatSlideContent = (): JSX.Element => {
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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-white/10">
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
      </CardContent>
    </Card>
  );
};

export default SlideCard;
