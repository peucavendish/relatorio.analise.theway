import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EyeToggleProps {
  isVisible: boolean;
  onClick: () => void;
  className?: string;
}

const EyeToggle: React.FC<EyeToggleProps> = ({ 
  isVisible, 
  onClick, 
  className 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center p-1 rounded-full bg-background/80 hover:bg-background border border-border/50 transition-colors",
        className
      )}
      aria-label={isVisible ? "Ocultar informações" : "Mostrar informações"}
      title={isVisible ? "Ocultar informações" : "Mostrar informações"}
    >
      {isVisible ? (
        <Eye size={16} className="text-muted-foreground" />
      ) : (
        <EyeOff size={16} className="text-muted-foreground" />
      )}
    </button>
  );
};

export default EyeToggle;
