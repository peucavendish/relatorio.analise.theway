import React from 'react';
import { useSectionVisibility } from '@/context/SectionVisibilityContext';
import { cn } from '@/lib/utils';

interface HideableSectionProps {
  sectionId: string;
  children: React.ReactNode;
  className?: string;
  hideControls?: boolean;
}

const HideableSection: React.FC<HideableSectionProps> = ({
  sectionId,
  children,
  className,
  hideControls = false,
}) => {
  const { isSectionVisible } = useSectionVisibility();
  const isVisible = isSectionVisible(sectionId);

  // Se os controles estão ocultos e a seção não está visível, não renderiza nada
  if (hideControls && !isVisible) {
    return null;
  }

  // Se a seção não está visível, renderiza uma versão oculta
  if (!isVisible) {
    return (
      <div id={sectionId} className={cn("min-h-screen relative", className)}>
        <div className="absolute inset-0 bg-slate-100/30 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">👁️</div>
            <h3 className="text-xl font-medium text-slate-600 mb-2">
              Seção Ocultada
            </h3>
            <p className="text-slate-500">
              Esta seção foi ocultada do relatório do cliente
            </p>
            <div className="mt-4 text-xs text-slate-400">
              ID: {sectionId}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se a seção está visível, renderiza normalmente
  return (
    <div id={sectionId} className={cn("min-h-screen", className)}>
      {children}
    </div>
  );
};

export default HideableSection; 