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
  hideControls?: boolean;
}

const HideableCard: React.FC<HideableCardProps> = ({
  id,
  isVisible,
  onToggleVisibility,
  children,
  className,
  hideControls = false,
}) => {
  if (hideControls && !isVisible) {
    return null;
  }

  return (
    <Card id={id} className={cn('relative', className)}>
      {!hideControls && (
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
      )}

      {children}

      {!isVisible && (
        <div className="absolute bottom-1 right-1 text-[10px] text-muted-foreground/40">
          oculto para cliente
        </div>
      )}
    </Card>
  );
};

export default HideableCard;
