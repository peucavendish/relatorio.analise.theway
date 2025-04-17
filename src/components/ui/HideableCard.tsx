import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardProps } from './card';
import { cn } from '@/lib/utils';

interface HideableCardProps extends CardProps {
  id: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const HideableCard: React.FC<HideableCardProps> = ({
  id,
  isVisible,
  onToggleVisibility,
  children,
  className,
  ...props
}) => {
  return (
    <Card id={id} className={cn('relative', className)} {...props}>
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
      
      {isVisible ? (
        children
      ) : (
        <div className="p-6 flex items-center justify-center min-h-[150px]">
          <p className="text-muted-foreground text-sm">
            Informações ocultas
          </p>
        </div>
      )}
    </Card>
  );
};

export default HideableCard;
