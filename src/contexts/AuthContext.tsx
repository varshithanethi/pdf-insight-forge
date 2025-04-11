
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "Admin" | "User";
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email?: string, name?: string, role?: "Admin" | "User") => void;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('pdf-insight-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('pdf-insight-user');
      }
    }
  }, []);

  const login = (email?: string, name?: string, role: "Admin" | "User" = "User") => {
    // Create a more personalized user object
    const mockUser = {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      name: name || 'Demo User',
      email: email || 'demo@example.com',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Demo User')}&background=6E59A5&color=fff`,
      role: role
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('pdf-insight-user', JSON.stringify(mockUser));
    toast.success(`Signed in as ${role}`);
    setShowAuthModal(false);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('pdf-insight-user');
    toast.success('Signed out successfully');
  };

  const isAdmin = user?.role === "Admin";

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        showAuthModal,
        setShowAuthModal,
        isAdmin
      }}
    >
      {children}
      <AuthModal />
    </AuthContext.Provider>
  );
};

const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, login } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"Admin" | "User">("User");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, name, role);
  };

  return (
    <Sheet open={showAuthModal} onOpenChange={setShowAuthModal}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-gradient">Sign In</SheetTitle>
          <SheetDescription>
            Create an account to save your insights and access more features.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleLogin} className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              placeholder="Enter your name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="bg-background/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="bg-background/50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={role} 
              onValueChange={(value: "Admin" | "User") => setRole(value)}
            >
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User">User</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            Continue
          </Button>
          <div className="text-xs text-center text-muted-foreground mt-4">
            This is a demo app. No real authentication is performed.
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
