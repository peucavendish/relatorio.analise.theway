import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card } from './card';
import { cn } from '@/lib/utils';

interface HideableCardProps {
  id: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
  children: React.ReactNode;
  className?: string;
}

const HideableCard: React.FC<HideableCardProps> = ({
  id,
  isVisible,
  onToggleVisibility,
  children,
  className,
}) => {
  return (
    <Card id={id} className={cn('relative', className)}>
      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute top-3 right-3 z-10 flex items-center justify-center p-1 rounded-full bg-background/80 hover:bg-background border border-border/50 transition-colors"
        aria-label={isVisible ? "Ocultar informações" : "Mostrar informações"}
        title={isVisible ? "Ocultar informações" : "Mostrar informações"}
      >
        {isVisible ? (
          <Eye size={16} className="text-muted-foreground" />
        ) : (
          <EyeOff size={16} className="text-muted-foreground" />
        )}
      </button>

      {children}
    </Card>
  );
};

export default HideableCard;
