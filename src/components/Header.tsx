
import React from 'react';
import { FileText, Github, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  
  return (
    <header className="border-b border-border/40 bg-background/70 backdrop-blur-sm sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-accent">
            PDF Insight Forge
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium hidden md:block">
                Hello, {user?.name || 'User'}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                <UserCircle className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={login} className="bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20">
              <UserCircle className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}
          
          <a
            href="https://github.com/Aksh414/DocumentSearchAssistant"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
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
