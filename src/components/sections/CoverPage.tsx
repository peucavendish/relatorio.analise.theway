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
    <section id="cover" className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div 
          ref={headerRef as React.RefObject<HTMLDivElement>} 
          className="text-center mb-8 animate-on-scroll"
        >
          <div className="mb-2 inline-block">
            <div className="text-sm font-medium text-accent mb-2 tracking-wider">
              ALTA VISTA INVESTIMENTOS
            </div>
            <h1 className="text-5xl font-bold mb-2">Resumo da Carteira</h1>
            <p className="text-muted-foreground">
              Preparado especialmente para <span className="font-medium text-foreground">{clientData.nome}</span>
            </p>
          </div>
        </div>
        
        {/* Client Info Card */}
        <div 
          ref={cardRef1 as React.RefObject<HTMLDivElement>} 
          className="mb-8 animate-on-scroll delay-1"
        >
          <Card className="p-8 bg-gradient-to-br from-card to-card/80 border-2 border-accent/20 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-2">Informações do Cliente</h2>
              <div className="w-16 h-1 bg-accent mx-auto rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Cliente */}
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <User size={24} className="text-accent" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Cliente</h3>
                <p className="text-xl font-bold text-primary">
                  {clientData.nome || `Cliente ${clientData.codigoXP || 'XP'}`}
                </p>
              </div>

              {/* Código XP */}
              {clientData.codigoXP && (
                <div className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users size={24} className="text-accent" />
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Código XP</h3>
                  <p className="text-xl font-bold text-primary font-mono">{clientData.codigoXP}</p>
                </div>
              )}
              
              {/* Data do Relatório */}
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Calendar size={24} className="text-accent" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Data do Relatório</h3>
                <p className="text-xl font-bold text-primary">{date}</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* About This Report */}
        <div 
          ref={cardRef2 as React.RefObject<HTMLDivElement>} 
          className="animate-on-scroll delay-2"
        >
          <CardWithHighlight highlight className="p-8 bg-gradient-to-br from-accent/5 to-accent/10 border-2 border-accent/30 shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-primary mb-3">Sobre este relatório</h2>
              <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
            </div>
            
            <div className="space-y-4 text-center max-w-4xl mx-auto">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Este documento apresenta um <span className="font-semibold text-primary">diagnóstico completo</span> da sua carteira de investimentos, 
                elaborado especificamente para analisar a alocação atual e compará-la com o perfil ideal.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Ele contempla <span className="font-semibold text-primary">análises técnicas</span>, comparações e recomendações para otimizar sua alocação.
              </p>
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
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
