
import React from 'react';
import { usePDF } from '@/contexts/PDFContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  ListFilter, 
  Clock, 
  BookOpen, 
  Settings, 
  User, 
  Shield 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { pdfFile, pdfText, sidebarOpen, setSidebarOpen, darkMode } = usePDF();
  const { isAuthenticated, user, isAdmin } = useAuth();
  
  if (!pdfFile) return null;
  
  // Calculate word count and reading time
  const wordCount = pdfText?.split(/\s+/).filter(Boolean).length || 0;
  const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
  
  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: -260, opacity: 0 }
  };
  
  return (
    <motion.div 
      className={`fixed left-0 top-16 bottom-0 w-64 bg-secondary/50 backdrop-blur-lg border-r border-border/40 z-10 ${darkMode ? 'dark bg-slate-800/90' : ''}`}
      initial={sidebarOpen ? "open" : "closed"}
      animate={sidebarOpen ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="absolute -right-4 top-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 rounded-full shadow-md bg-background"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="p-4 border-b border-border/40 flex items-center">
        <FileText className="h-5 w-5 mr-2 text-primary" />
        <div className="text-sm font-medium line-clamp-1">{pdfFile?.name}</div>
      </div>
      
      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="p-4">
          {/* Document Info */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Document Info</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Size</span>
                <span className="font-medium">{Math.round(pdfFile.size / 1024)} KB</span>
              </div>
              <div className="flex justify-between">
                <span>Word Count</span>
                <span className="font-medium">{wordCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Reading Time</span>
                <span className="font-medium">{readingTime} min</span>
              </div>
              <div className="flex justify-between">
                <span>Format</span>
                <span className="font-medium">PDF</span>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <ListFilter className="h-3.5 w-3.5 mr-2" />
                Filter Content
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Clock className="h-3.5 w-3.5 mr-2" />
                Recent Documents
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <BookOpen className="h-3.5 w-3.5 mr-2" />
                Saved Documents
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Settings className="h-3.5 w-3.5 mr-2" />
                Settings
              </Button>
            </div>
          </div>
          
          {/* User Section */}
          {isAuthenticated && (
            <div className="pt-4 border-t border-border/40">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{user?.name || 'User'}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </div>
                </div>
                {isAdmin && (
                  <Badge variant="accent" className="text-[10px] h-5 flex items-center">
                    <Shield className="h-2.5 w-2.5 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default Sidebar;
