import { InvestorType } from '@/context/InvestorTypeContext';

// Dados das carteiras de Previdência para Investidor Qualificado (IQ)
export const pensionPortfoliosIQ = {
  1: { // SUPER CONSERVADOR
    'Pós-fixado': 91.10,
    'IPCA': 8.90,
    'Multimercado': 0.00,
    'RV Brasil': 0.00,
    'Internacional': 0.00,
    funds: [
      { classe: 'Pós-fixado', fundo: 'Itaú Sinfonia XP Seg', percentual: 13.50 },
      { classe: 'Pós-fixado', fundo: 'Jive Soul XP Seg', percentual: 5.00 },
      { classe: 'Pós-fixado', fundo: 'AZ Quest Altro XP Seg', percentual: 15.00 },
      { classe: 'Pós-fixado', fundo: 'Bradesco Ultra XP Seg', percentual: 15.00 },
      { classe: 'IPCA', fundo: 'Trend Inflação Curta XP Seg', percentual: 4.70 },
      { classe: 'IPCA', fundo: 'ARX K2 XP Seg', percentual: 4.20 },
      { classe: 'Pós-fixado', fundo: 'Valora Prev XP Seg', percentual: 14.30 },
      { classe: 'Pós-fixado', fundo: 'Sparta Prev Advisory XP Seg', percentual: 13.30 },
      { classe: 'Pós-fixado', fundo: 'Itaú High Yield', percentual: 15.00 }
    ]
  },
  2: { // CONSERVADOR
    'Pós-fixado': 82.30,
    'IPCA': 11.10,
    'Multimercado': 5.40,
    'RV Brasil': 1.20,
    'Internacional': 0.00,
    funds: [
      { classe: 'Pós-fixado', fundo: 'Itaú Sinfonia XP Seg', percentual: 15.00 },
      { classe: 'Pós-fixado', fundo: 'Jive Soul XP Seg', percentual: 5.00 },
      { classe: 'Pós-fixado', fundo: 'Bradesco Ultra XP Seg', percentual: 15.00 },
      { classe: 'IPCA', fundo: 'Trend Inflação Curta XP Seg', percentual: 6.70 },
      { classe: 'IPCA', fundo: 'ARX K2 XP Seg', percentual: 4.40 },
      { classe: 'Pós-fixado', fundo: 'Valora Prev XP Seg', percentual: 10.00 },
      { classe: 'Pós-fixado', fundo: 'Sparta Prev Advisory XP Seg', percentual: 10.00 },
      { classe: 'Multimercado', fundo: 'Genoa Cruise XP Seg', percentual: 1.50 },
      { classe: 'Multimercado', fundo: 'Absolute Vertex XP Seg', percentual: 1.50 },
      { classe: 'Internacional', fundo: 'Bolsa Americana 40 XP Seg', percentual: 15.00 },
      { classe: 'Pós-fixado', fundo: 'Itaú High Yield', percentual: 15.90 }
    ]
  },
  3: { // MODERADO
    'Pós-fixado': 65.10,
    'IPCA': 15.50,
    'Multimercado': 11.00,
    'RV Brasil': 8.40,
    'Internacional': 0.00,
    funds: [
      { classe: 'Pós-fixado', fundo: 'Itaú Sinfonia XP Seg', percentual: 10.20 },
      { classe: 'Pós-fixado', fundo: 'Jive Soul XP Seg', percentual: 5.00 },
      { classe: 'Pós-fixado', fundo: 'Bradesco Ultra XP Seg', percentual: 15.00 },
      { classe: 'IPCA', fundo: 'Trend Inflação Curta XP Seg', percentual: 8.42 },
      { classe: 'IPCA', fundo: 'ARX K2 XP Seg', percentual: 7.08 },
      { classe: 'Multimercado', fundo: 'Genoa Cruise XP Seg', percentual: 3.50 },
      { classe: 'Multimercado', fundo: 'Absolute Vertex XP Seg', percentual: 3.50 },
      { classe: 'Internacional', fundo: 'Bolsa Americana 40 XP Seg', percentual: 25.00 },
      { classe: 'RV Brasil', fundo: 'Real Investor 100 XP Seg', percentual: 6.40 },
      { classe: 'Pós-fixado', fundo: 'Itaú High Yield', percentual: 15.90 }
    ]
  },
  4: { // ARROJADO
    'Pós-fixado': 52.50,
    'IPCA': 19.50,
    'Multimercado': 15.60,
    'RV Brasil': 12.40,
    'Internacional': 0.00,
    funds: [
      { classe: 'Pós-fixado', fundo: 'AZ Quest Altro XP Seg', percentual: 11.55 },
      { classe: 'Pós-fixado', fundo: 'Jive Soul XP Seg', percentual: 5.00 },
      { classe: 'IPCA', fundo: 'Trend Inflação Curta XP Seg', percentual: 10.50 },
      { classe: 'IPCA', fundo: 'ARX K2 XP Seg', percentual: 9.00 },
      { classe: 'Multimercado', fundo: 'Genoa Cruise XP Seg', percentual: 3.00 },
      { classe: 'Multimercado', fundo: 'Absolute Vertex XP Seg', percentual: 3.00 },
      { classe: 'Multimercado', fundo: 'Kapitalo K10 XP Seg', percentual: 4.00 },
      { classe: 'Internacional', fundo: 'Bolsa Americana 40 XP Seg', percentual: 35.00 },
      { classe: 'RV Brasil', fundo: 'Real Investor 100 XP Seg', percentual: 5.60 },
      { classe: 'RV Brasil', fundo: 'Guepardo 100 XP Seg', percentual: 4.00 },
      { classe: 'Pós-fixado', fundo: 'Itaú High Yield', percentual: 9.35 }
    ]
  },
  5: { // AGRESSIVO
    'Pós-fixado': 42.10,
    'IPCA': 21.30,
    'Multimercado': 18.20,
    'RV Brasil': 18.40,
    'Internacional': 0.00,
    funds: [
      { classe: 'Pós-fixado', fundo: 'AZ Quest Altro XP Seg', percentual: 3.90 },
      { classe: 'Pós-fixado', fundo: 'Jive Soul XP Seg', percentual: 4.00 },
      { classe: 'IPCA', fundo: 'Trend Inflação Curta XP Seg', percentual: 11.40 },
      { classe: 'IPCA', fundo: 'ARX K2 XP Seg', percentual: 9.90 },
      { classe: 'Multimercado', fundo: 'Genoa Cruise XP Seg', percentual: 4.00 },
      { classe: 'Multimercado', fundo: 'Absolute Vertex XP Seg', percentual: 4.00 },
      { classe: 'Multimercado', fundo: 'Kapitalo K10 XP Seg', percentual: 3.00 },
      { classe: 'Internacional', fundo: 'Bolsa Americana 40 XP Seg', percentual: 45.00 },
      { classe: 'RV Brasil', fundo: 'Real Investor 100 XP Seg', percentual: 9.80 },
      { classe: 'RV Brasil', fundo: 'Guepardo 100 XP Seg', percentual: 5.00 }
    ]
  }
};

// Dados das carteiras de Previdência para Investidor Geral (IG)
export const pensionPortfoliosIG = {
  1: { // SUPER CONSERVADOR
    'Pós-fixado': 91.10,
    'IPCA': 8.90,
    'Multimercado': 0.00,
    'RV Brasil': 0.00,
    'Internacional': 0.00,
    funds: [
      { classe: 'Pós-fixado', fundo: 'Itaú High Yield XP Seg', percentual: 15.00 },
      { classe: 'Pós-fixado', fundo: 'AZ Quest Luce XP Seg', percentual: 15.00 },
      { classe: 'Pós-fixado', fundo: 'Sparta Prev Advisory XP Seg', percentual: 15.00 },
      { classe: 'Pós-fixado', fundo: 'Bradesco Ultra XP Seg', percentual: 15.00 },
      { classe: 'IPCA', fundo: 'Trend Inflação Curta XP Seg', percentual: 4.70 },
      { classe: 'IPCA', fundo: 'ARX K2 XP Seg', percentual: 4.20 },
      { classe: 'Pós-fixado', fundo: 'XP Liquidez 50 XP Seg', percentual: 16.10 },
      { classe: 'Pós-fixado', fundo: 'Itaú High Yield', percentual: 15.00 }
    ]
  },
  2: { // CONSERVADOR
    'Pós-fixado': 70.90,
    'IPCA': 11.10,
    'Multimercado': 3.00,
    'RV Brasil': 0.00,
    'Internacional': 15.00,
    funds: [
      { classe: 'Pós-fixado', fundo: 'Itaú High Yield XP Seg', percentual: 17.00 },
      { classe: 'Pós-fixado', fundo: 'AZ Quest Luce XP Seg', percentual: 16.30 },
      { classe: 'Pós-fixado', fundo: 'Sparta Prev Advisory XP Seg', percentual: 17.00 },
      { classe: 'Pós-fixado', fundo: 'Bradesco Ultra XP Seg', percentual: 17.00 },
      { classe: 'IPCA', fundo: 'Trend Inflação Curta XP Seg', percentual: 7.03 },
      { classe: 'IPCA', fundo: 'ARX K2 XP Seg', percentual: 4.07 },
      { classe: 'RV Brasil', fundo: 'Guepardo 70 XP Seg', percentual: 1.20 },
      { classe: 'Multimercado', fundo: 'Kapitalo K10 XP Seg', percentual: 3.00 },
      { classe: 'Multimercado', fundo: 'Genoa Cruise XP Seg', percentual: 2.40 },
      { classe: 'Pós-fixado', fundo: 'Itaú High Yield', percentual: 15.00 }
    ]
  },
  3: { // MODERADO
    'Pós-fixado': 46.10,
    'IPCA': 15.50,
    'Multimercado': 7.00,
    'RV Brasil': 6.40,
    'Internacional': 25.00,
    funds: [
      { classe: 'Pós-fixado', fundo: 'AZ Quest Luce XP Seg', percentual: 14.30 },
      { classe: 'Pós-fixado', fundo: 'Sparta Prev Advisory XP Seg', percentual: 16.00 },
      { classe: 'Pós-fixado', fundo: 'Bradesco Ultra XP Seg', percentual: 17.80 },
      { classe: 'IPCA', fundo: 'Trend Inflação Curta XP Seg', percentual: 8.70 },
      { classe: 'IPCA', fundo: 'ARX K2 XP Seg', percentual: 6.80 },
      { classe: 'RV Brasil', fundo: 'Guepardo 70 XP Seg', percentual: 8.40 },
      { classe: 'Multimercado', fundo: 'Kapitalo K10 XP Seg', percentual: 3.70 },
      { classe: 'Multimercado', fundo: 'Quantitas Capri XP Seg', percentual: 3.70 },
      { classe: 'Multimercado', fundo: 'Genoa Cruise XP Seg', percentual: 3.60 },
      { classe: 'Pós-fixado', fundo: 'Itaú High Yield', percentual: 17.00 }
    ]
  },
  4: { // ARROJADO
    'Pós-fixado': 25.90,
    'IPCA': 19.50,
    'Multimercado': 10.00,
    'RV Brasil': 9.60,
    'Internacional': 35.00,
    funds: [
      { classe: 'Pós-fixado', fundo: 'AZ Quest Luce XP Seg', percentual: 12.50 },
      { classe: 'Pós-fixado', fundo: 'Sparta Prev Advisory XP Seg', percentual: 15.00 },
      { classe: 'Pós-fixado', fundo: 'Bradesco Ultra XP Seg', percentual: 15.00 },
      { classe: 'IPCA', fundo: 'Trend Inflação Curta XP Seg', percentual: 10.00 },
      { classe: 'IPCA', fundo: 'ARX K2 XP Seg', percentual: 9.50 },
      { classe: 'RV Brasil', fundo: 'Guepardo 70 XP Seg', percentual: 12.40 },
      { classe: 'Multimercado', fundo: 'Kapitalo K10 XP Seg', percentual: 5.00 },
      { classe: 'Multimercado', fundo: 'Quantitas Capri XP Seg', percentual: 5.40 },
      { classe: 'Multimercado', fundo: 'Genoa Cruise XP Seg', percentual: 5.20 },
      { classe: 'Pós-fixado', fundo: 'Itaú High Yield', percentual: 10.00 }
    ]
  },
  5: { // AGRESSIVO
    'Pós-fixado': 7.90,
    'IPCA': 21.30,
    'Multimercado': 11.00,
    'RV Brasil': 14.80,
    'Internacional': 45.00,
    funds: [
      { classe: 'Pós-fixado', fundo: 'AZ Quest Luce XP Seg', percentual: 9.30 },
      { classe: 'Pós-fixado', fundo: 'Sparta Prev Advisory XP Seg', percentual: 13.60 },
      { classe: 'Pós-fixado', fundo: 'Bradesco Ultra XP Seg', percentual: 10.00 },
      { classe: 'IPCA', fundo: 'Trend Inflação Curta XP Seg', percentual: 11.40 },
      { classe: 'IPCA', fundo: 'ARX K2 XP Seg', percentual: 9.90 },
      { classe: 'RV Brasil', fundo: 'Guepardo 70 XP Seg', percentual: 18.40 },
      { classe: 'Multimercado', fundo: 'Kapitalo K10 XP Seg', percentual: 6.00 },
      { classe: 'Multimercado', fundo: 'Quantitas Capri XP Seg', percentual: 6.00 },
      { classe: 'Multimercado', fundo: 'Genoa Cruise XP Seg', percentual: 6.20 },
      { classe: 'Pós-fixado', fundo: 'Itaú High Yield', percentual: 9.20 }
    ]
  }
};

export const getPensionPortfolio = (investorType: InvestorType, profile: number) => {
  if (investorType === 'qualified') {
    return pensionPortfoliosIQ[profile as keyof typeof pensionPortfoliosIQ];
  } else {
    return pensionPortfoliosIG[profile as keyof typeof pensionPortfoliosIG];
  }
};
