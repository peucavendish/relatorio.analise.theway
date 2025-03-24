import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import Header from '@/components/layout/Header';
import GammaNavigation from '@/components/layout/GammaNavigation';
import FloatingActions from '@/components/layout/FloatingActions';
import CoverPage from '@/components/sections/CoverPage';
import FinancialSummary from '@/components/sections/FinancialSummary';
import RetirementPlanning from '@/components/sections/RetirementPlanning';

// Mock client data
const clientData = {
  cliente: {
    nome: "Roberto Silveira",
    idade: 43,
    estadoCivil: "Casado",
    regimeCasamento: "Comunhão Parcial",
    residencia: "São Paulo"
  },
  financas: {
    patrimonioLiquido: 3650000,
    excedenteMensal: 17000,
    rendaMensal: {
      clt: 25000,
      dividendos: 10000,
      total: 35000
    },
    despesasMensais: 18000,
    composicaoPatrimonial: {
      imoveis: 50,
      investimentos: 25,
      empresa: 25
    },
    ativos: [
      { tipo: "Imóvel residencial", valor: 1200000 },
      { tipo: "Apartamento alugado", valor: 800000 },
      { tipo: "Investimentos em Renda Fixa", valor: 450000 },
      { tipo: "Investimentos em Renda Variável", valor: 250000 },
      { tipo: "Previdência Privada (VGBL)", valor: 300000 },
      { tipo: "Participação em empresa (40%)", valor: 1000000 }
    ],
    passivos: [
      { tipo: "Financiamento imobiliário", valor: 350000 }
    ]
  },
  objetivos: [
    { tipo: "Aposentadoria", valor: "R$ 25.000 mensais", prazo: "aos 60 anos" },
    { tipo: "Casa de praia", valor: 800000, prazo: "5 anos" },
    { tipo: "Proteção patrimonial e sucessória", prazo: "imediato" },
    { tipo: "Otimização fiscal", prazo: "imediato" }
  ]
};

const IndexPage = () => {
  const [activeSection, setActiveSection] = useState('cover');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle section change
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    // Scroll to section (future implementation)
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-accent/30 mx-auto"></div>
          </div>
          <p className="text-muted-foreground animate-pulse">Carregando relatório...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen pb-28">
        <Header 
          title="Relatório Financeiro Visionário" 
          subtitle="Planejamento financeiro personalizado"
        />
        
        <main>
          {/* Cover Page */}
          <div id="cover">
            <CoverPage clientData={clientData.cliente} />
          </div>
          
          {/* Financial Summary */}
          <div id="summary">
            <FinancialSummary data={clientData.financas} />
          </div>
          
          {/* Retirement Planning */}
          <div id="retirement">
            <RetirementPlanning />
          </div>
          
          {/* Other sections would be added here */}
        </main>
        
        <FloatingActions />
        <GammaNavigation 
          activeSection={activeSection} 
          onChange={handleSectionChange} 
        />
      </div>
    </ThemeProvider>
  );
};

export default IndexPage;
