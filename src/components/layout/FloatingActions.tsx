
import React from 'react';
import { Sun, Moon, Download } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

interface FloatingActionsProps {
  className?: string;
}

const FloatingActions: React.FC<FloatingActionsProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div 
      className={cn(
        'fixed bottom-24 right-6 z-50 flex flex-col gap-3',
        className
      )}
    >
      <button
        onClick={() => {
          // This is where PDF export logic would go
          alert('Export to PDF functionality would be implemented here');
        }}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-accent text-white shadow-lg hover:bg-accent/90 transition-colors"
        aria-label="Export to PDF"
      >
        <Download size={18} />
      </button>
      <button
        onClick={toggleTheme}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-card border border-border shadow-lg hover:bg-secondary/80 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>
    </div>
  );
};

export default FloatingActions;
