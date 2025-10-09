import React, { useEffect, useRef } from 'react';
import { Card } from '../ui/card';
import { Calendar, MapPin, User, Users } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface ClientData {
  nome: string;
  idade: number;
  codigoXP?: string;
}

interface CoverPageProps {
  clientData: ClientData;
  date?: string;
}

// Componente customizado que estende o Card básico
const CardWithHighlight = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { highlight?: boolean }
>(({ className, highlight, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm p-6",
      highlight && "border-accent/50 bg-accent/5",
      className
    )}
    {...props}
  />
));
CardWithHighlight.displayName = "CardWithHighlight";

const CoverPage: React.FC<CoverPageProps> = ({ 
  clientData,
  date = new Date().toLocaleDateString('pt-BR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}) => {
  const headerRef = useScrollAnimation();
  const cardRef1 = useScrollAnimation();
  const cardRef2 = useScrollAnimation();
  
  return (
    <section id="cover" className="min-h-screen flex flex-col items-center justify-center py-8 px-4 print:min-h-0 print:py-2 print:px-2">
      <div className="max-w-4xl w-full print:max-w-none">
        {/* Header */}
        <div 
          ref={headerRef as React.RefObject<HTMLDivElement>} 
          className="text-center mb-8 animate-on-scroll print:mb-4"
        >
          <div className="mb-2 inline-block print:mb-1">
            <div className="text-sm font-medium text-accent mb-2 tracking-wider print:text-xs print:mb-1">
              ALTA VISTA INVESTIMENTOS
            </div>
            <h1 className="text-5xl font-bold mb-2 print:text-2xl print:mb-1">Resumo da Carteira</h1>
            <p className="text-muted-foreground print:text-sm">
              Preparado especialmente para <span className="font-medium text-foreground">{clientData.nome}</span>
            </p>
          </div>
        </div>
        
        {/* Client Info Card */}
        <div 
          ref={cardRef1 as React.RefObject<HTMLDivElement>} 
          className="mb-8 animate-on-scroll delay-1 print:mb-4"
        >
          <Card className="p-8 bg-gradient-to-br from-card to-card/80 border-2 border-accent/20 shadow-xl print:p-4 print:shadow-none">
            <div className="text-center mb-8 print:mb-4">
              <h2 className="text-3xl font-bold text-primary mb-2 print:text-lg print:mb-1">Informações do Cliente</h2>
              <div className="w-16 h-1 bg-accent mx-auto rounded-full print:w-8 print:h-0.5"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 print:grid-cols-3 print:gap-4">
              {/* Cliente */}
              <div className="text-center group print:group-hover:scale-100">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 print:w-8 print:h-8 print:mb-2 print:group-hover:scale-100">
                  <User size={24} className="text-accent print:w-4 print:h-4" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 print:text-xs print:mb-1">Cliente</h3>
                <p className="text-xl font-bold text-primary print:text-sm">
                  {clientData.nome || `Cliente ${clientData.codigoXP || 'XP'}`}
                </p>
              </div>

              {/* Código XP */}
              {clientData.codigoXP && (
                <div className="text-center group print:group-hover:scale-100">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 print:w-8 print:h-8 print:mb-2 print:group-hover:scale-100">
                    <Users size={24} className="text-accent print:w-4 print:h-4" />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 print:text-xs print:mb-1">Código XP</h3>
                  <p className="text-xl font-bold text-primary font-mono print:text-sm">{clientData.codigoXP}</p>
                </div>
              )}
              
              {/* Data do Relatório */}
              <div className="text-center group print:group-hover:scale-100">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300 print:w-8 print:h-8 print:mb-2 print:group-hover:scale-100">
                  <Calendar size={24} className="text-accent print:w-4 print:h-4" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2 print:text-xs print:mb-1">Data do Relatório</h3>
                <p className="text-xl font-bold text-primary print:text-sm">{date}</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* About This Report */}
        <div 
          ref={cardRef2 as React.RefObject<HTMLDivElement>} 
          className="animate-on-scroll delay-2 print:hidden"
        >
          <CardWithHighlight highlight className="p-8 bg-gradient-to-br from-accent/5 to-accent/10 border-2 border-accent/30 shadow-lg print:p-4 print:shadow-none">
            <div className="text-center mb-6 print:mb-3">
              <h2 className="text-3xl font-bold text-primary mb-3 print:text-lg print:mb-1">Sobre este relatório</h2>
              <div className="w-20 h-1 bg-accent mx-auto rounded-full print:w-10 print:h-0.5"></div>
            </div>
            
            <div className="space-y-4 text-center max-w-4xl mx-auto print:space-y-2 print:max-w-none">
              <p className="text-lg leading-relaxed text-muted-foreground print:text-sm print:leading-tight">
                Este documento apresenta um <span className="font-semibold text-primary">diagnóstico completo</span> da sua carteira de investimentos, 
                elaborado especificamente para analisar a alocação atual e compará-la com o perfil ideal.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground print:text-sm print:leading-tight">
                Ele contempla <span className="font-semibold text-primary">análises técnicas</span>, comparações e recomendações para otimizar sua alocação.
              </p>
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20 print:mt-3 print:p-2 print:hidden">
                <p className="text-sm font-medium text-primary">
                  💡 Navegue pelas seções usando a barra inferior ou os botões de navegação para 
                  explorar cada aspecto do seu diagnóstico de carteira.
                </p>
              </div>
            </div>
          </CardWithHighlight>
        </div>
      </div>
    </section>
  );
};

export default CoverPage;
