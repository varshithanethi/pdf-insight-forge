
import React from 'react';
import { FileText, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            PDF Insight Forge
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Aksh414/DocumentSearchAssistant"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
