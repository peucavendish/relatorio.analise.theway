import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full py-3 animate-fade-in">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          {theme === 'light' ? (
            <img 
              src="/logo-light.png" 
              alt="Logo" 
              width={80} 
              height={24} 
              className="h-6 w-auto object-contain"
            />
          ) : (
            <img 
              src="/logo-dark.png" 
              alt="Logo" 
              width={80} 
              height={24} 
              className="h-6 w-auto object-contain"
            />
          )}
          {title && (
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
            </div>
          )}
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
