
import React from 'react';
import { FileText, Github, UserCircle, LogOut, LogIn, BookText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout, setShowAuthModal } = useAuth();
  
  return (
    <header className="border-b border-border/40 bg-background/70 backdrop-blur-sm sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 transition-transform hover:scale-105 duration-300">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-accent">
            PDF Insight Forge
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/40 hover:bg-secondary/50 transition-colors cursor-pointer">
                  <Avatar className="h-6 w-6 border border-accent/20">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden md:block truncate max-w-[120px]">
                    {user?.name || 'User'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card backdrop-blur-lg">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Signed in as
                  </p>
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <BookText className="h-4 w-4" />
                  <span>My Documents</span>
                  <Badge variant="outline" className="ml-auto text-xs">Soon</Badge>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAuthModal(true)} 
              className="bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20"
            >
              <LogIn className="mr-2 h-4 w-4" />
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
