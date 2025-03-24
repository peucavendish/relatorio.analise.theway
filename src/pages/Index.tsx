import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import Header from '@/components/layout/Header';
import GammaNavigation from '@/components/layout/GammaNavigation';
import FloatingActions from '@/components/layout/FloatingActions';
import CoverPage from '@/components/sections/CoverPage';
import FinancialSummary from '@/components/sections/FinancialSummary';
import RetirementPlanning from '@/components/sections/RetirementPlanning';
import BeachHouse from '@/components/sections/BeachHouse';
import TaxPlanning from '@/components/sections/TaxPlanning';

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
  ],
  casaPraia: {
    objetivo: {
      valorImovel: 800000,
      prazoDesejado: 5
    },
    comparativoEstrategias: [
      {estrategia: "Consórcio", parcelaMensal: 5000, totalPago: 960000},
      {estrategia: "Financiamento", parcelaMensal: 6500, totalPago: 1290000},
      {estrategia: "Reserva Livre", parcelaMensal: 11000, totalPago: 800000}
    ],
    estrategiaRecomendada: "Consórcio",
    vantagens: [
      "Sem juros",
      "Menor custo total",
      "Flexibilidade para lance"
    ],
    desvantagens: [
      "Tempo de contemplação incerto",
      "Taxa administrativa"
    ],
    impactoFinanceiro: {
      excedenteMensalAtual: 17000,
      parcelaConsorcio: 5000,
      excedenteMensalApos: 12000,
      observacao: "O consórcio permite manter um excedente mensal significativo para outros objetivos financeiros, principalmente a aposentadoria."
    }
  },
  tributario: {
    resumo: {
      objetivo: "Otimização fiscal e redução da carga tributária",
      potencialEconomia: "Até 50% de redução em impostos",
      prazoImplementacao: "90 dias"
    },
    estruturacaoPatrimonial: [
      "Holding Familiar",
      "Previdência VGBL",
      "Doações com usufruto"
    ],
    investimentosIsentos: [
      {"tipo": "LCI/LCA", "limite": "Até R$250 mil por CPF", "tributacao": "Isento de IR"},
      {"tipo": "Dividendos de ações", "limite": "Sem limite", "tributacao": "Isento de IR"},
      {"tipo": "FIIs", "limite": "Sem limite para pessoa física", "tributacao": "Isento de IR para dividendos"}
    ],
    deducoes: [
      {"tipo": "PGBL", "percentual": "12% da renda tributável", "valor": "R$ 36.000/ano", "beneficio": "Dedução na base de cálculo do IR"},
      {"tipo": "Dependentes", "quantidade": "2 filhos", "valor": "R$ 4.550/ano", "beneficio": "Dedução na base de cálculo do IR"},
      {"tipo": "Despesas médicas", "limite": "Sem limite", "beneficio": "Dedução integral na base de cálculo do IR"}
    ],
    holdingFamiliar: {
      "descricao": "Estrutura societária para centralização de bens e investimentos da família",
      "custoConstrucao": 30000,
      "tempoImplementacao": "60-90 dias",
      "beneficios": [
        "Redução de ITCMD (imposto sobre herança)",
        "Simplificação do processo de inventário",
        "Proteção patrimonial contra credores",
        "Gestão centralizada dos ativos familiares"
      ],
      "recomendacao": "Recomendado para os imóveis e participação empresarial, representando 75% do patrimônio total"
    },
    previdenciaVGBL: {
      "descricao": "Produto financeiro com vantagens tributárias e sucessórias",
      "valorAtual": 300000,
      "recomendacaoAdicional": "Aumento de aportes para otimização fiscal",
      "vantagensSucessorias": [
        "Não entra em inventário (pagamento via beneficiários indicados)",
        "Tributa apenas o rendimento (não o capital principal)",
        "Tabela regressiva de IR (mínimo 10% após 10 anos)"
      ]
    },
    cidadaniaItaliana: {
      "status": "Em processo",
      "implicacoesFiscais": {
        "impostoBrasilSP": "8% de imposto de herança",
        "impostoItalia": "4-8% de imposto de herança",
        "oportunidades": "Possibilidade de otimização fiscal internacional no planejamento sucessório"
      }
    },
    economiaTributaria: {
      "semPlanejamento": 320000,
      "comPlanejamento": 160000,
      "economia": 160000,
      "periodoEstimado": "10 anos",
      "itensConsiderados": [
        "ITCMD em sucessão",
        "IR sobre ganho de capital",
        "Otimização de deduções fiscais"
      ]
    }
  }
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
          
          {/* Beach House */}
          <div id="beach-house">
            <BeachHouse data={clientData} />
          </div>
          
          {/* Tax Planning */}
          <div id="tax">
            <TaxPlanning data={clientData} />
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
