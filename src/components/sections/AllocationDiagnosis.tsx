import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import HideableCard from '@/components/ui/HideableCard';
import StatusChip from '@/components/ui/StatusChip';
import ProgressBar from '@/components/ui/ProgressBar';
import { BarChart3, PieChart, TrendingUp, TrendingDown, Globe, DollarSign, Target, AlertTriangle, CheckCircle, XCircle, BarChart, Activity, Shield, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useCardVisibility } from '@/context/CardVisibilityContext';

export interface Ativo {
  nome: string;
  classe: string;
  valor: number;
  obs?: string;
}

export interface Consolidado {
  classe: string;
  valor: number;
  percentual: string;
}

export interface Liquidez {
  faixa: string;
  valor: number;
  percentual: string;
}

export interface Comparativo {
  classe: string;
  atual: string;
  ideal: string;
  situacao: string;
}


export interface ModeloIdeal {
  classe: string;
  exemplo: string;
  percentual: string;
  liquidez: string;
  tipoInvestidor?: 'IQ' | 'IG' | 'AMBOS';
}

export interface AllocationDiagnosisProps {
  identificacao: {
    nome?: string;
    tipo: string;
    perfil: number;
    pdf: boolean;
    pjDetalhe?: string;
    codigoXP?: string;
    assessor?: string;
    email?: string;
    qualificacao?: string;
    suitability?: string;
    instituicao?: string;
    dataAnalise?: string;
    perfilModelo?: string;
  };
  patrimonioTotal: number;
  patrimonioCarteiraBrasil: number; // Patrimônio da carteira brasileira (sem conta internacional)
  ativos: Ativo[];
  consolidado: Consolidado[];
  liquidez: Liquidez[];
  liquidezInfo?: { prazoMedio?: string; classificacao?: string };
  internacional: {
    valor: number;
    percentual: string;
    recomendado: string;
    hedge?: { naoHedgeado: number; hedgeado: number };
  };
  comparativo: Comparativo[];
  modeloIdealFeeBased: ModeloIdeal[];
  modeloIdealCommissionBased: ModeloIdeal[];
  macro: {
    brasil: string;
    mundo: string;
    implicacoes: string;
  };
  hideControls?: boolean;
}

// Função para obter carteira Fee Based baseada no perfil
const getCarteiraFeeBased = (perfil: number) => {
  const carteiras = {
    1: [ // SUPER CONSERVADOR
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BANCÁRIO ISENTO S1', percentual: '13.28%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO %CDI', percentual: '6.64%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO CDI+', percentual: '13.28%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BRADESCO ZUPO FIC FIRF LP CP (IQ E IG)', percentual: '10.00%', liquidez: '6 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'SPX SEAHAWK DEBÊNTURES INCENTIVADAS D45 FIF CIC INFRA RF CP LP RL (IQ E IG)', percentual: '10.00%', liquidez: '46 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'SULAMÉRICA CRÉDITO ESG FIRF CP LP IS (IQ) / SULAMÉRICA CRÉDITO ATIVO FIRF CP LP (IG)', percentual: '10.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'ROOT CAPITAL CRÉDITO HG PLUS FIC DE FIF MULTIMERCADO CP RL (IQ) / NOVUS CRÉDITO FIM CP LP (IG)', percentual: '10.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CAPITANIA YIELD 120 FIC FIDC (IQ) / VALORA VANGUARD FIC DE FIDC RL (IG)', percentual: '5.00%', liquidez: '120 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'JIVE BOSSANOVA HIGH YIELD ADVISORY FIC FIDC (IQ) / JIVEMAUA BOSSANOVA 90 FIDC (IG)', percentual: '4.80%', liquidez: '362 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'CRÉDITO PRIVADO IPCA OFERTA', percentual: '8.40%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL (IQ E IG)', percentual: '3.60%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'CRÉDITO PRIVADO PRÉ', percentual: '2.50%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'BANCÁRIO', percentual: '2.50%', liquidez: '1 dia', tipoInvestidor: 'IG' }
    ],
    2: [ // CONSERVADOR
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BANCÁRIO ISENTO S1', percentual: '11.20%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO %CDI', percentual: '5.60%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO CDI+', percentual: '11.20%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BRADESCO ZUPO FIC FIRF LP CP (IQ E IG)', percentual: '5.00%', liquidez: '6 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'SPX SEAHAWK DEBÊNTURES INCENTIVADAS D45 FIF CIC INFRA RF CP LP RL (IQ E IG)', percentual: '10.00%', liquidez: '46 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'SULAMÉRICA CRÉDITO ESG FIRF CP LP IS (IQ) / SULAMÉRICA CRÉDITO ATIVO FIRF CP LP (IG)', percentual: '10.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'ROOT CAPITAL CRÉDITO HG PLUS FIC DE FIF MULTIMERCADO CP RL (IQ) / NOVUS CRÉDITO FIM CP LP (IG)', percentual: '9.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CAPITANIA YIELD 120 FIC FIDC (IQ) / VALORA VANGUARD FIC DE FIDC RL (IG)', percentual: '4.00%', liquidez: '120 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'JIVE BOSSANOVA HIGH YIELD ADVISORY FIC FIDC (IQ) / JIVEMAUA BOSSANOVA 90 FIDC (IG)', percentual: '4.00%', liquidez: '362 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'CRÉDITO PRIVADO IPCA OFERTA', percentual: '10.50%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL (IQ E IG)', percentual: '4.50%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'CRÉDITO PRIVADO PRÉ', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'BANCÁRIO', percentual: '3.00%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Multimercado', exemplo: 'VINLAND 2 ATIVO DEBENTURES DE INFRA FI RF (IQ E IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Internacional', exemplo: 'WHG GLOBAL LONG BIASED BRL FIC FIA IE (IQ) / WELLINGTON VENTURA ADVISORY CI AÇÕES IE RL (IG)', percentual: '2.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Internacional', exemplo: 'GAMA PEARL DIVER GLOBAL FLOATING INCOME BRL FIC FIM IE RL (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' }
    ],
    3: [ // MODERADO
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BANCÁRIO ISENTO S1', percentual: '6.72%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO %CDI', percentual: '3.36%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO CDI+', percentual: '6.72%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BRADESCO ZUPO FIC FIRF LP CP (IQ E IG)', percentual: '0.00%', liquidez: '6 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'SPX SEAHAWK DEBÊNTURES INCENTIVADAS D45 FIF CIC INFRA RF CP LP RL (IQ E IG)', percentual: '7.20%', liquidez: '46 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'SULAMÉRICA CRÉDITO ESG FIRF CP LP IS (IQ) / SULAMÉRICA CRÉDITO ATIVO FIRF CP LP (IG)', percentual: '0.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'ROOT CAPITAL CRÉDITO HG PLUS FIC DE FIF MULTIMERCADO CP RL (IQ) / NOVUS CRÉDITO FIM CP LP (IG)', percentual: '8.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CAPITANIA YIELD 120 FIC FIDC (IQ) / VALORA VANGUARD FIC DE FIDC RL (IG)', percentual: '5.00%', liquidez: '120 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'JIVE BOSSANOVA HIGH YIELD ADVISORY FIC FIDC (IQ) / JIVEMAUA BOSSANOVA 90 FIDC (IG)', percentual: '5.00%', liquidez: '362 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'CRÉDITO PRIVADO IPCA OFERTA', percentual: '14.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL (IQ E IG)', percentual: '6.00%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'CRÉDITO PRIVADO PRÉ', percentual: '4.50%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'BANCÁRIO', percentual: '4.50%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA MENSAL DE AÇÕES LEVANTE', percentual: '0.85%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA TOP DIVIDENDOS XP', percentual: '1.26%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'PRODUTOS ESTRUTURADOS', percentual: '1.14%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'REAL INVESTOR FIC DE FIF EM AÇÕES RL (IQ E IG)', percentual: '1.25%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Variável - Brasil', exemplo: 'TARPON GT 90 FIF FIA (IQ E IG)', percentual: '1.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Variável - Brasil', exemplo: 'ALPHAKEY AÇÕES FIF EM COTAS DE FIA RL (IQ) / AZ QUEST TOP LONG BIASED FIC FIF AÇÕES (IG)', percentual: '1.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Fundo Imobiliário', exemplo: 'FIIs - Carteira recomendada', percentual: '3.00%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Multimercado', exemplo: 'V8 SPEEDWAY LONG SHORT FIF FIF MULTIMERCADO (IQ E IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Multimercado', exemplo: 'VINLAND 2 ATIVO DEBENTURES DE INFRA FI RF (IQ E IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Alternativo', exemplo: 'Alternativos - Carteira recomendada', percentual: '2.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Internacional', exemplo: 'WHG GLOBAL LONG BIASED BRL FIC FIA IE (IQ) / WELLINGTON VENTURA ADVISORY CI AÇÕES IE RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Internacional', exemplo: 'GAMA PEARL DIVER GLOBAL FLOATING INCOME BRL FIC FIM IE RL (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Internacional', exemplo: 'OAKTREE GLOBAL CREDIT BRL FIC FIM (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'IQ' },
      { classe: 'Criptomoedas', exemplo: 'HASH11 (IQ E IG)', percentual: '0.50%', liquidez: '1 dia', tipoInvestidor: 'AMBOS' }
    ],
    4: [ // ARROJADO
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BANCÁRIO ISENTO S1', percentual: '3.68%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO %CDI', percentual: '1.84%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO CDI+', percentual: '3.68%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BRADESCO ZUPO FIC FIRF LP CP (IQ E IG)', percentual: '0.00%', liquidez: '6 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'SPX SEAHAWK DEBÊNTURES INCENTIVADAS D45 FIF CIC INFRA RF CP LP RL (IQ E IG)', percentual: '3.80%', liquidez: '46 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'SULAMÉRICA CRÉDITO ESG FIRF CP LP IS (IQ) / SULAMÉRICA CRÉDITO ATIVO FIRF CP LP (IG)', percentual: '0.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'ROOT CAPITAL CRÉDITO HG PLUS FIC DE FIF MULTIMERCADO CP RL (IQ) / NOVUS CRÉDITO FIM CP LP (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CAPITANIA YIELD 120 FIC FIDC (IQ) / VALORA VANGUARD FIC DE FIDC RL (IG)', percentual: '3.00%', liquidez: '120 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'JIVE BOSSANOVA HIGH YIELD ADVISORY FIC FIDC (IQ) / JIVEMAUA BOSSANOVA 90 FIDC (IG)', percentual: '3.00%', liquidez: '362 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'CRÉDITO PRIVADO IPCA OFERTA', percentual: '17.50%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL (IQ E IG)', percentual: '7.50%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'CRÉDITO PRIVADO PRÉ', percentual: '5.50%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'BANCÁRIO', percentual: '5.50%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA MENSAL DE AÇÕES LEVANTE', percentual: '1.05%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA TOP DIVIDENDOS XP', percentual: '1.56%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'PRODUTOS ESTRUTURADOS', percentual: '1.66%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'TRADE IDEAS', percentual: '0.48%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'REAL INVESTOR FIC DE FIF EM AÇÕES RL (IQ E IG)', percentual: '1.75%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Variável - Brasil', exemplo: 'TARPON GT 90 FIF FIA (IQ E IG)', percentual: '1.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Variável - Brasil', exemplo: 'ALPHAKEY AÇÕES FIF EM COTAS DE FIA RL (IQ) / AZ QUEST TOP LONG BIASED FIC FIF AÇÕES (IG)', percentual: '2.00%', liquidez: '30 dias', tipoInvestidor: 'IQ' },
      
      { classe: 'Fundo Imobiliário', exemplo: 'FIIs - Carteira recomendada', percentual: '3.75%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Multimercado', exemplo: 'KAPITALO K10 ADVISORY FIF EM COTAS DE FIM (IQ E IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Multimercado', exemplo: 'V8 SPEEDWAY LONG SHORT FIF FIF MULTIMERCADO (IQ E IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Multimercado', exemplo: 'VINLAND 2 ATIVO DEBENTURES DE INFRA FI RF (IQ E IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Alternativo', exemplo: 'Alternativos - Carteira recomendada', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Internacional', exemplo: 'WHG GLOBAL LONG BIASED BRL FIC FIA IE (IQ) / WELLINGTON VENTURA ADVISORY CI AÇÕES IE RL (IG)', percentual: '6.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Internacional', exemplo: 'GAMA PEARL DIVER GLOBAL FLOATING INCOME BRL FIC FIM IE RL (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Internacional', exemplo: 'OAKTREE GLOBAL CREDIT BRL FIC FIM (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'IQ' },
   
      { classe: 'Criptomoedas', exemplo: 'HASH11 (IQ E IG)', percentual: '0.75%', liquidez: '1 dia', tipoInvestidor: 'AMBOS' }
    ],
    5: [ // AGRESSIVO
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BANCÁRIO ISENTO S1', percentual: '0.80%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO %CDI', percentual: '1.60%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO CDI+', percentual: '1.60%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BRADESCO ZUPO FIC FIRF LP CP (IQ E IG)', percentual: '0.00%', liquidez: '6 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'SPX SEAHAWK DEBÊNTURES INCENTIVADAS D45 FIF CIC INFRA RF CP LP RL (IQ E IG)', percentual: '0.00%', liquidez: '46 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'SULAMÉRICA CRÉDITO ESG FIRF CP LP IS (IQ) / SULAMÉRICA CRÉDITO ATIVO FIRF CP LP (IG)', percentual: '0.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'ROOT CAPITAL CRÉDITO HG PLUS FIC DE FIF MULTIMERCADO CP RL (IQ) / NOVUS CRÉDITO FIM CP LP (IG)', percentual: '0.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CAPITANIA YIELD 120 FIC FIDC (IQ) / VALORA VANGUARD FIC DE FIDC RL (IG)', percentual: '3.00%', liquidez: '120 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'JIVE BOSSANOVA HIGH YIELD ADVISORY FIC FIDC (IQ) / JIVEMAUA BOSSANOVA 90 FIDC (IG)', percentual: '3.00%', liquidez: '362 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'CRÉDITO PRIVADO IPCA OFERTA', percentual: '18.90%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'BANCÁRIO IPCA', percentual: '0.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL (IQ E IG)', percentual: '8.10%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'CRÉDITO PRIVADO PRÉ', percentual: '6.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'BANCÁRIO', percentual: '6.00%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA MENSAL DE AÇÕES LEVANTE', percentual: '1.45%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA TOP DIVIDENDOS XP', percentual: '2.17%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'PRODUTOS ESTRUTURADOS', percentual: '2.18%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'TRADE IDEAS', percentual: '1.45%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'REAL INVESTOR FIC DE FIF EM AÇÕES RL (IQ E IG)', percentual: '2.25%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Variável - Brasil', exemplo: 'TARPON GT 90 FIF FIA (IQ E IG)', percentual: '2.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Variável - Brasil', exemplo: 'ALPHAKEY AÇÕES FIF EM COTAS DE FIA RL (IQ) / AZ QUEST TOP LONG BIASED FIC FIF AÇÕES (IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Fundo Imobiliário', exemplo: 'FIIs - Carteira recomendada', percentual: '4.50%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Multimercado', exemplo: 'KAPITALO K10 ADVISORY FIF EM COTAS DE FIM (IQ E IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Multimercado', exemplo: 'V8 SPEEDWAY LONG SHORT FIF FIF MULTIMERCADO (IQ E IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Multimercado', exemplo: 'VINLAND 2 ATIVO DEBENTURES DE INFRA FI RF (IQ E IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Alternativo', exemplo: 'Alternativos - Carteira recomendada', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Internacional', exemplo: 'WHG GLOBAL LONG BIASED BRL FIC FIA IE (IQ) / WELLINGTON VENTURA ADVISORY CI AÇÕES IE RL (IG)', percentual: '8.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Internacional', exemplo: 'GAMA PEARL DIVER GLOBAL FLOATING INCOME BRL FIC FIM IE RL (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Internacional', exemplo: 'OAKTREE GLOBAL CREDIT BRL FIC FIM (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Criptomoedas', exemplo: 'HASH11 (IQ E IG)', percentual: '1.00%', liquidez: '1 dia', tipoInvestidor: 'AMBOS' }
    ]
  };
  
  return carteiras[perfil as keyof typeof carteiras] || carteiras[5]; // Default para Agressivo
};

// Função para obter carteira Commission Based baseada no perfil
const getCarteiraCommissionBased = (perfil: number) => {
  const carteiras = {
    1: [ // SUPER CONSERVADOR
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BANCÁRIO ISENTO S1', percentual: '13.28%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO %CDI', percentual: '6.64%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO CDI+', percentual: '13.28%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'AZ QUEST LOW VOL FIF MULTIMERCADO (IQ E IG)', percentual: '10.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'SPX SEAHAWK DEBÊNTURES INCENTIVADAS D45 FIF CIC INFRA RF CP LP RL (IQ E IG)', percentual: '10.00%', liquidez: '46 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'XP CORPORATE TOP CP FIF FIRF LP RL (IQ E IG)', percentual: '10.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'ROOT CAPITAL CRÉDITO HG PLUS FIC DE FIF MULTIMERCADO CP RL (IQ) / NOVUS CRÉDITO FIM CP LP (IG)', percentual: '10.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'XP CRÉDITO ESTRUTURADO 120 FIC DE FIF MULTIMERCADO CP RL (IQ) / VALORA VANGUARD FIC DE FIDC RL (IG)', percentual: '5.00%', liquidez: '120 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'JIVE BOSSANOVA HIGH YIELD ADVISORY FIC FIDC (IQ) / JIVEMAJA BOSSANOVA 90 FIDC (IG)', percentual: '4.80%', liquidez: '362 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'CRÉDITO PRIVADO IPCA OFERTA', percentual: '8.40%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL (IQ E IG)', percentual: '3.60%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'CRÉDITO PRIVADO PRÉ', percentual: '2.50%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'BANCÁRIO', percentual: '2.50%', liquidez: '1 dia', tipoInvestidor: 'IG' }
    ],
    2: [ // CONSERVADOR
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BANCÁRIO ISENTO S1', percentual: '11.20%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO %CDI', percentual: '5.60%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO CDI+', percentual: '11.20%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'AZ QUEST LOW VOL FIF MULTIMERCADO (IQ E IG)', percentual: '5.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'SPX SEAHAWK DEBÊNTURES INCENTIVADAS D45 FIF CIC INFRA RF CP LP RL (IQ E IG)', percentual: '10.00%', liquidez: '46 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'XP CORPORATE TOP CP FIF FIRF LP RL (IQ E IG)', percentual: '10.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'ROOT CAPITAL CRÉDITO HG PLUS FIC DE FIF MULTIMERCADO CP RL (IQ) / NOVUS CRÉDITO FIM CP LP (IG)', percentual: '9.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'XP CRÉDITO ESTRUTURADO 120 FIC DE FIF MULTIMERCADO CP RL (IQ) / VALORA VANGUARD FIC DE FIDC RL (IG)', percentual: '4.00%', liquidez: '120 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'JIVE BOSSANOVA HIGH YIELD ADVISORY FIC FIDC (IQ) / JIVEMAJA BOSSANOVA 90 FIDC (IG)', percentual: '4.00%', liquidez: '362 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'CRÉDITO PRIVADO IPCA OFERTA', percentual: '10.50%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL (IQ E IG)', percentual: '4.50%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'CRÉDITO PRIVADO PRÉ', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'BANCÁRIO', percentual: '3.00%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Multimercado', exemplo: 'VINLAND 2 ATIVO DEBENTURES DE INFRA FI RF (IQ E IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Internacional', exemplo: 'WHG GLOBAL LONG BIASED BRL FIC FIA IE (IQ) / WELLINGTON VENTURA ADVISORY CI AÇÕES IE RL (IG)', percentual: '2.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Internacional', exemplo: 'GAMA PEARL DIVER GLOBAL FLOATING INCOME BRL FIC FIM IE RL (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' }
    ],
    3: [ // MODERADO
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BANCÁRIO ISENTO S1', percentual: '7.40%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO %CDI', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO CDI+', percentual: '7.40%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'AZ QUEST LOW VOL FIF MULTIMERCADO (IQ E IG)', percentual: '0.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'SPX SEAHAWK DEBÊNTURES INCENTIVADAS D45 FIF CIC INFRA RF CP LP RL (IQ E IG)', percentual: '7.20%', liquidez: '46 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'XP CORPORATE TOP CP FIF FIRF LP RL (IQ E IG)', percentual: '0.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'ROOT CAPITAL CRÉDITO HG PLUS FIC DE FIF MULTIMERCADO CP RL (IQ) / NOVUS CRÉDITO FIM CP LP (IG)', percentual: '8.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'XP CRÉDITO ESTRUTURADO 120 FIC DE FIF MULTIMERCADO CP RL (IQ) / VALORA VANGUARD FIC DE FIDC RL (IG)', percentual: '5.00%', liquidez: '120 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'JIVE BOSSANOVA HIGH YIELD ADVISORY FIC FIDC (IQ) / JIVEMAJA BOSSANOVA 90 FIDC (IG)', percentual: '5.00%', liquidez: '362 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'CRÉDITO PRIVADO IPCA OFERTA', percentual: '14.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL (IQ E IG)', percentual: '6.00%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'CRÉDITO PRIVADO PRÉ', percentual: '4.50%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'BANCÁRIO', percentual: '4.50%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA MENSAL DE AÇÕES LEVANTE', percentual: '0.85%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA TOP DIVIDENDOS XP', percentual: '1.27%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'PRODUTOS ESTRUTURADOS', percentual: '1.14%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'REAL INVESTOR FIC DE FIF EM AÇÕES RL (IQ E IG)', percentual: '1.25%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Variável - Brasil', exemplo: 'TARPON GT 90 FIF FIA (IQ E IG)', percentual: '1.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Variável - Brasil', exemplo: 'ALPHAKEY AÇÕES FIF EM COTAS DE FIA RL (IQ) / AZ QUEST TOP LONG BIASED FIC FIF AÇÕES (IG)', percentual: '1.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Fundo Imobiliário', exemplo: 'FIIs - Carteira recomendada', percentual: '2.00%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Multimercado', exemplo: 'V8 SPEEDWAY LONG SHORT FIF FIF MULTIMERCADO (IQ E IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Multimercado', exemplo: 'VINLAND 2 ATIVO DEBENTURES DE INFRA FI RF (IQ E IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Alternativo', exemplo: 'Alternativos - Carteira recomendada', percentual: '2.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Internacional', exemplo: 'WHG GLOBAL LONG BIASED BRL FIC FIA IE (IQ) / WELLINGTON VENTURA ADVISORY CI AÇÕES IE RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Internacional', exemplo: 'GAMA PEARL DIVER GLOBAL FLOATING INCOME BRL FIC FIM IE RL (IQ)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'IQ' },
      { classe: 'Internacional', exemplo: 'OAKTREE GLOBAL CREDIT BRL FIC FIM (IQ)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'IQ' },
      { classe: 'Criptomoedas', exemplo: 'HASHDEX 100 NASDAQ CRYPTO INDEX FIM RL (IQ E IG)', percentual: '0.50%', liquidez: '1 dia', tipoInvestidor: 'AMBOS' }
    ],
    4: [ // ARROJADO
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BANCÁRIO ISENTO S1', percentual: '3.68%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO %CDI', percentual: '1.84%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO CDI+', percentual: '3.68%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'AZ QUEST LOW VOL FIF MULTIMERCADO (IQ E IG)', percentual: '0.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'SPX SEAHAWK DEBÊNTURES INCENTIVADAS D45 FIF CIC INFRA RF CP LP RL (IQ E IG)', percentual: '3.80%', liquidez: '46 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'XP CORPORATE TOP CP FIF FIRF LP RL (IQ E IG)', percentual: '0.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'ROOT CAPITAL CRÉDITO HG PLUS FIC DE FIF MULTIMERCADO CP RL (IQ) / NOVUS CRÉDITO FIM CP LP (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'XP CRÉDITO ESTRUTURADO 120 FIC DE FIF MULTIMERCADO CP RL (IQ) / VALORA VANGUARD FIC DE FIDC RL (IG)', percentual: '3.00%', liquidez: '120 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'JIVE BOSSANOVA HIGH YIELD ADVISORY FIC FIDC (IQ) / JIVEMAJA BOSSANOVA 90 FIDC (IG)', percentual: '3.00%', liquidez: '362 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'CRÉDITO PRIVADO IPCA OFERTA', percentual: '17.50%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL (IQ E IG)', percentual: '7.50%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'CRÉDITO PRIVADO PRÉ', percentual: '5.50%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'BANCÁRIO', percentual: '5.50%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA MENSAL DE AÇÕES LEVANTE', percentual: '1.05%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA TOP DIVIDENDOS XP', percentual: '1.57%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'PRODUTOS ESTRUTURADOS', percentual: '1.66%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'TRADE IDEAS', percentual: '0.48%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'REAL INVESTOR FIC DE FIF EM AÇÕES RL (IQ E IG)', percentual: '1.75%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Variável - Brasil', exemplo: 'TARPON GT 90 FIF FIA (IQ E IG) / ALPHAKEY AÇÕES FIF EM COTAS DE FIA RL (IQ)', percentual: '1.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Variável - Brasil', exemplo: 'AZ QUEST TOP LONG BIASED FIC FIF AÇÕES (IG)', percentual: '2.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Fundo Imobiliário', exemplo: 'FIIs - Carteira recomendada', percentual: '3.00%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Multimercado', exemplo: 'KAPITALO K10 ADVISORY FIF EM COTAS DE FIM (IQ E IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Multimercado', exemplo: 'V8 SPEEDWAY LONG SHORT FIF FIF MULTIMERCADO (IQ E IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Multimercado', exemplo: 'VINLAND 2 ATIVO DEBENTURES DE INFRA FI RF (IQ E IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Alternativo', exemplo: 'Alternativos - Carteira recomendada', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Internacional', exemplo: 'WHG GLOBAL LONG BIASED BRL FIC FIA IE (IQ) / WELLINGTON VENTURA ADVISORY CI AÇÕES IE RL (IG)', percentual: '6.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Internacional', exemplo: 'GAMA PEARL DIVER GLOBAL FLOATING INCOME BRL FIC FIM IE RL (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Internacional', exemplo: 'OAKTREE GLOBAL CREDIT BRL FIC FIM (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'IQ' },
      { classe: 'Criptomoedas', exemplo: 'HASHDEX 100 NASDAQ CRYPTO INDEX FIM RL (IQ E IG)', percentual: '0.75%', liquidez: '1 dia', tipoInvestidor: 'AMBOS' }
    ],
    5: [ // AGRESSIVO
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO %CDI', percentual: '2.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO CDI+', percentual: '2.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'AZ QUEST LOW VOL FIF MULTIMERCADO (IQ E IG)', percentual: '0.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'SPX SEAHAWK DEBÊNTURES INCENTIVADAS D45 FIF CIC INFRA RF CP LP RL (IQ E IG)', percentual: '0.00%', liquidez: '46 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'XP CORPORATE TOP CP FIF FIRF LP RL (IQ E IG)', percentual: '0.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'ROOT CAPITAL CRÉDITO HG PLUS FIC DE FIF MULTIMERCADO CP RL (IQ) / NOVUS CRÉDITO FIM CP LP (IG)', percentual: '0.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'XP CRÉDITO ESTRUTURADO 120 FIC DE FIF MULTIMERCADO CP RL (IQ) / VALORA VANGUARD FIC DE FIDC RL (IG)', percentual: '3.00%', liquidez: '120 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pós-fixado', exemplo: 'JIVE BOSSANOVA HIGH YIELD ADVISORY FIC FIDC (IQ) / JIVEMAJA BOSSANOVA 90 FIDC (IG)', percentual: '3.00%', liquidez: '362 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'CRÉDITO PRIVADO IPCA OFERTA', percentual: '18.90%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - IPCA', exemplo: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL (IQ E IG)', percentual: '8.10%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'CRÉDITO PRIVADO PRÉ', percentual: '6.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Renda Fixa - Pré-fixado', exemplo: 'BANCÁRIO', percentual: '6.00%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA MENSAL DE AÇÕES LEVANTE', percentual: '1.45%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA TOP DIVIDENDOS XP', percentual: '2.18%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'PRODUTOS ESTRUTURADOS', percentual: '2.18%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'TRADE IDEAS', percentual: '1.45%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Renda Variável - Brasil', exemplo: 'REAL INVESTOR FIC DE FIF EM AÇÕES RL (IQ E IG)', percentual: '2.25%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Variável - Brasil', exemplo: 'TARPON GT 90 FIF FIA (IQ E IG)', percentual: '2.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Renda Variável - Brasil', exemplo: 'ALPHAKEY AÇÕES FIF EM COTAS DE FIA RL (IQ) / AZ QUEST TOP LONG BIASED FIC FIF AÇÕES (IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Fundo Imobiliário', exemplo: 'FIIs - Carteira recomendada', percentual: '4.50%', liquidez: '1 dia', tipoInvestidor: 'IG' },
      { classe: 'Multimercado', exemplo: 'KAPITALO K10 ADVISORY FIF EM COTAS DE FIM (IQ E IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Multimercado', exemplo: 'V8 SPEEDWAY LONG SHORT FIF FIF MULTIMERCADO (IQ E IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Multimercado', exemplo: 'VINLAND 2 ATIVO DEBENTURES DE INFRA FI RF (IQ E IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Alternativo', exemplo: 'Alternativos - Carteira recomendada', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
      { classe: 'Internacional', exemplo: 'WHG GLOBAL LONG BIASED BRL FIC FIA IE (IQ) / WELLINGTON VENTURA ADVISORY CI AÇÕES IE RL (IG)', percentual: '8.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Internacional', exemplo: 'GAMA PEARL DIVER GLOBAL FLOATING INCOME BRL FIC FIM IE RL (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
      { classe: 'Internacional', exemplo: 'OAKTREE GLOBAL CREDIT BRL FIC FIM (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'IQ' },
      { classe: 'Criptomoedas', exemplo: 'HASHDEX 100 NASDAQ CRYPTO INDEX FIM RL (IQ E IG)', percentual: '1.00%', liquidez: '1 dia', tipoInvestidor: 'AMBOS' }
    ]
  };
  
  return carteiras[perfil as keyof typeof carteiras] || carteiras[5]; // Default para Agressivo
};

export const AllocationDiagnosis: React.FC<AllocationDiagnosisProps> = ({
  identificacao,
  patrimonioTotal,
  patrimonioCarteiraBrasil,
  ativos,
  consolidado,
  liquidez,
  internacional,
  comparativo,
  modeloIdealFeeBased,
  modeloIdealCommissionBased,
  macro,
  hideControls,
}) => {
  // Estado para controlar a ordenação do item 6
  const [sortBy, setSortBy] = useState<'ideal' | 'atual' | 'delta' | 'situacao' | 'faltam'>('ideal');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Estado para controlar o tipo de carteira no item 7
  const [portfolioType, setPortfolioType] = useState<'fee-based' | 'commission-based'>('commission-based');
  
  
  // Usar automaticamente o perfil do cliente do relatório
  const selectedProfile = identificacao.perfil;
  
  // Estado para controlar classes colapsadas/expandidas no item 7
  const [collapsedClasses, setCollapsedClasses] = useState<Set<string>>(new Set());
  
  // Função para alternar colapso/expansão de uma classe
  const toggleClassCollapse = (classe: string) => {
    setCollapsedClasses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(classe)) {
        newSet.delete(classe);
      } else {
        newSet.add(classe);
      }
      return newSet;
    });
  };

  // Função para colapsar/expandir todas as classes
  const toggleAllClasses = () => {
    const carteiraAtual = portfolioType === 'fee-based' 
      ? getCarteiraFeeBased(selectedProfile)
      : getCarteiraCommissionBased(selectedProfile);
    
    // Filtrar produtos com percentual > 0
    const filteredCarteira = carteiraAtual.filter(item => parsePercent(item.percentual) > 0);
    
    // Agrupar por classe
    const groupedByClass = filteredCarteira.reduce((acc, item) => {
      const classe = item.classe;
      if (!acc[classe]) {
        acc[classe] = [];
      }
      acc[classe].push(item);
      return acc;
    }, {} as Record<string, typeof filteredCarteira>);

    const allClasses = Object.keys(groupedByClass);
    const allCollapsed = allClasses.every(classe => collapsedClasses.has(classe));
    
    if (allCollapsed) {
      // Se todas estão colapsadas, expandir todas
      setCollapsedClasses(new Set());
    } else {
      // Se nem todas estão colapsadas, colapsar todas
      setCollapsedClasses(new Set(allClasses));
    }
  };
  
  const headerRef = useScrollAnimation();
  const scoreCardRef = useScrollAnimation();
  const macroCardRef = useScrollAnimation();
  const ativosCardRef = useScrollAnimation();
  const consolidadoCardRef = useScrollAnimation();
  const liquidezCardRef = useScrollAnimation();
  const internacionalCardRef = useScrollAnimation();
  const comparativoCardRef = useScrollAnimation();
  const modeloIdealCardRef = useScrollAnimation();

  const { isCardVisible, toggleCardVisibility } = useCardVisibility();

  const getSituacaoIcon = (situacao: string) => {
    if (situacao.includes('✅')) return <CheckCircle size={16} className="text-green-500" />;
    if (situacao.includes('⚠️')) return <AlertTriangle size={16} className="text-yellow-500" />;
    if (situacao.includes('❌')) return <XCircle size={16} className="text-red-500" />;
    return null;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTotalPatrimonio = () => {
    return patrimonioTotal;
  };

  const getScoreAlocacao = () => {
    const scores = comparativo.map(item => {
      if (item.situacao.includes('✅')) return 100;
      if (item.situacao.includes('⚠️')) return 50;
      if (item.situacao.includes('❌')) return 0;
      return 75;
    });
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const getScoreLiquidez = () => {
    const liquidezRapida = liquidez.filter(item => 
      item.faixa === 'D+0' || item.faixa === 'D+1-4'
    ).reduce((sum, item) => sum + parseFloat(item.percentual), 0);
    
    return Math.min(100, Math.round(liquidezRapida * 2)); // Normaliza para 100
  };

  // Helpers para Consolidação por Classe
  const parsePercent = (pct: string) => {
    try {
      return Number(String(pct).toString().replace('%', '').trim()) || 0;
    } catch {
      return 0;
    }
  };

  const getClassColor = (classe: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    // Buscar o item correspondente no comparativo
    const comparativoItem = comparativo.find(item => 
      item.classe.toLowerCase().includes(classe.toLowerCase()) || 
      classe.toLowerCase().includes(item.classe.toLowerCase())
    );
    
    if (comparativoItem) {
      const situacao = comparativoItem.situacao.toLowerCase();
      
      // Determinar cor baseada na situação
      if (situacao.includes('sobrealocado') || situacao.includes('excesso')) {
        return 'danger'; // Vermelho para excesso
      } else if (situacao.includes('subalocado') || situacao.includes('abaixo') || situacao.includes('faltam')) {
        return 'warning'; // Amarelo para abaixo
      } else if (situacao.includes('em linha') || situacao.includes('neutro')) {
        return 'success'; // Verde para em linha
      }
    }
    
    // Fallback para classes sem dados de comparação
    const key = (classe || '').toLowerCase();
    if (key.includes('pós') || key.includes('pos')) return 'warning'; // CDI / Pós-fixado
    if (key.includes('prefixada') || key.includes('pré') || key.includes('pre')) return 'danger'; // Pré-fixado
    if (key.includes('inflação') || key.includes('inflacao') || key.includes('ipca')) return 'info'; // IPCA
    if (key.includes('multimercado')) return 'info'; // Multimercado
    if (key.includes('variável') || key.includes('variavel') || key.includes('renda variável')) return 'success'; // Ações
    if (key.includes('internacional')) return 'success'; // Internacional
    if (key.includes('imobiliário') || key.includes('imobiliario') || key.includes('fii')) return 'info'; // Imobiliário
    if (key.includes('alternativo')) return 'warning'; // Alternativo
    if (key.includes('moedas')) return 'default'; // Moedas
    if (key.includes('derivativos')) return 'danger'; // Derivativos
    if (key.includes('caixa')) return 'default'; // Caixa
    return 'default'; // Outros
  };

  // Usar apenas os dados consolidados que realmente existem (com valor > 0)
  const sortedConsolidado = consolidado
    .filter(item => item.valor > 0) // Filtrar apenas classes com valor > 0
    .sort((a, b) => parsePercent(b.percentual) - parsePercent(a.percentual));

  const totalPatrimonio = getTotalPatrimonio();

  const getDiffFinanceiro = (atualPctStr: string, idealPctStr: string) => {
    const atualPct = parsePercent(atualPctStr);
    const idealPct = parsePercent(idealPctStr);
    const diffPct = idealPct - atualPct; // >0 falta; <0 excesso
    // Todas as classes da carteira brasileira usam patrimônio da carteira brasileira
    const diffValue = (patrimonioCarteiraBrasil * diffPct) / 100;
    if (Math.abs(diffValue) < 0.005) return { label: '-', value: 0 };
    return {
      label: diffPct > 0 ? 'Faltam' : 'Excesso',
      value: Math.abs(diffValue)
    };
  };

  // Função para ordenar o comparativo
  const sortComparativo = (a: any, b: any) => {
    let valueA: number, valueB: number;
    
    switch (sortBy) {
      case 'atual':
        valueA = parsePercent(a.atual);
        valueB = parsePercent(b.atual);
        break;
      case 'ideal':
        valueA = parsePercent(a.ideal);
        valueB = parsePercent(b.ideal);
        break;
      case 'delta':
        const deltaA = parsePercent(a.ideal) - parsePercent(a.atual);
        const deltaB = parsePercent(b.ideal) - parsePercent(b.atual);
        valueA = deltaA; // Manter o sinal para ordenação correta
        valueB = deltaB; // Manter o sinal para ordenação correta
        break;
      case 'situacao':
        // Ordenar por situação: Em linha < Subalocado < Sobrealocado
        const situacaoOrder = { 
          'Em linha': 0, 
          'Subalocado': 1, 
          'Sobrealocado': 2,
          'Abaixo do ideal': 1,
          'Acima do ideal': 2
        };
        const situacaoA = a.situacao.replace(/[✅⚠️❌]/g, '').trim();
        const situacaoB = b.situacao.replace(/[✅⚠️❌]/g, '').trim();
        valueA = situacaoOrder[situacaoA as keyof typeof situacaoOrder] ?? 0;
        valueB = situacaoOrder[situacaoB as keyof typeof situacaoOrder] ?? 0;
        break;
      case 'faltam':
        const diffA = getDiffFinanceiro(a.atual, a.ideal);
        const diffB = getDiffFinanceiro(b.atual, b.ideal);
        valueA = diffA.value;
        valueB = diffB.value;
        break;
      default:
        return 0;
    }
    
    return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
  };

  // Função para alternar ordenação
  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  // --- Plano de Rebalanceamento ---
  const canonicalClass = (raw: string) => {
    const k = (raw || '').toLowerCase();
    if (k.includes('pós') || k.includes('pos')) return 'RF Pós-Fixado';
    if (k.includes('inflação') || k.includes('inflacao') || k.includes('ipca')) return 'RF Inflação';
    if (k.includes('pré') || k.includes('pre')) return 'RF Pré-Fixado';
    if (k.includes('multimercado')) return 'Multimercado';
    if (k.includes('rv') || k.includes('variável') || k.includes('variavel')) return 'RV Brasil';
    if (k.includes('fii')) return 'FII';
    if (k.includes('internacional')) return 'Internacional';
    if (k.includes('alternativo')) return 'Alternativo';
    return raw || 'Outros';
  };

  // Deltas por classe
  const deltas = comparativo.map(c => {
    const atual = parsePercent(c.atual);
    const ideal = parsePercent(c.ideal);
    const diffPct = ideal - atual;
    // Todas as classes da carteira brasileira usam patrimônio da carteira brasileira
    return {
      classe: canonicalClass(c.classe),
      diffPct,
      diffValue: (patrimonioCarteiraBrasil * diffPct) / 100
    };
  });

  // Agrupar modelo ideal por classe canônica
  const idealByClass: Record<string, { exemplo: string; pct: number }[]> = {};
  const modeloIdealAtual = portfolioType === 'fee-based' ? modeloIdealFeeBased : modeloIdealCommissionBased;
  modeloIdealAtual.forEach(mi => {
    const classeKey = canonicalClass(mi.classe);
    if (!idealByClass[classeKey]) idealByClass[classeKey] = [];
    idealByClass[classeKey].push({ exemplo: mi.exemplo, pct: parsePercent(mi.percentual) });
  });

  // Compras: distribuir faltas entre produtos do modelo conforme peso relativo dentro da classe
  const compras = deltas
    .filter(d => d.diffValue > 0.005)
    .flatMap(d => {
      const items = idealByClass[d.classe] || [];
      const totalPctClasse = items.reduce((s, it) => s + it.pct, 0) || 1;
      return items.map(it => ({
        classe: d.classe,
        produto: it.exemplo,
        valor: (d.diffValue * it.pct) / totalPctClasse
      }));
    })
    .filter(r => r.valor > 0.01);

  // Totais para o Modelo de Carteira baseado no tipo selecionado
  const totalPctModelo = modeloIdealAtual.reduce((s, mi) => s + parsePercent(mi.percentual), 0);
  // Modelo ideal calculado sobre patrimônio da carteira brasileira
  const totalValorAlocado = (patrimonioCarteiraBrasil * totalPctModelo) / 100;
  const totalComprar = compras.reduce((s, c) => s + c.valor, 0);

  // Totais do comparativo (Excesso / Falta / Em linha)
  const totalExcesso = comparativo.reduce((sum, item) => {
    const d = getDiffFinanceiro(item.atual, item.ideal);
    return sum + (d.label === 'Excesso' ? d.value : 0);
  }, 0);
  const totalFalta = comparativo.reduce((sum, item) => {
    const d = getDiffFinanceiro(item.atual, item.ideal);
    return sum + (d.label === 'Faltam' ? d.value : 0);
  }, 0);
  const totalEmLinha = Math.max(0, totalPatrimonio - totalExcesso - totalFalta);

  return (
    <section className="py-20 px-6 print:py-2 print:px-2" id="analise-carteira">
      <div className="max-w-7xl mx-auto space-y-10 print:max-w-none print:space-y-4">
        {/* Header */}
        <div
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="text-center animate-on-scroll print:mb-2"
        >
          <div className="inline-block print:block">
            <div className="flex items-center justify-center mb-5 print:mb-2 print:hidden">
              <div className="p-3 rounded-full ring-2 ring-financial-warning/40 bg-secondary print:p-1">
                <BarChart3 size={28} className="text-primary print:w-4 print:h-4" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-primary print:text-xl print:mb-2">Análise de Carteira</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-base print:text-xs print:max-w-none print:mb-2">
              Análise técnica da carteira atual, comparação com o perfil ideal e recomendações para otimização.
            </p>
          </div>
        </div>

        {/* Score Geral (simplificado: apenas Patrimônio) */}
        <div
          ref={scoreCardRef as React.RefObject<HTMLDivElement>}
          className="animate-on-scroll"
        >
          <HideableCard
            id="score-geral"
            isVisible={isCardVisible("score-geral")}
            onToggleVisibility={() => toggleCardVisibility("score-geral")}
            hideControls={hideControls}
          >
            <div className="p-8 print:p-4">
              <h3 className="text-2xl font-semibold mb-6 text-primary print:text-lg print:mb-3">1. Parâmetros Iniciais</h3>
              <div className="flex justify-center">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2 text-primary print:text-2xl print:mb-1">{formatCurrency(getTotalPatrimonio())}</div>
                  <div className="text-lg text-muted-foreground print:text-sm">Patrimônio Total (Nacional + Internacional)</div>
                </div>
              </div>
            </div>
          </HideableCard>
        </div>

        {/* Identificação consolidada ao bloco de Parâmetros Iniciais acima */}

        {/* Cenário Macroeconômico */}
        <div
          ref={macroCardRef as React.RefObject<HTMLDivElement>}
          className="animate-on-scroll"
        >
          <HideableCard
            id="macro-alocacao"
            isVisible={isCardVisible("macro-alocacao")}
            onToggleVisibility={() => toggleCardVisibility("macro-alocacao")}
            hideControls={hideControls}
          >
            <div className="p-8 print:p-4">
              <h3 className="text-2xl font-semibold mb-8 text-primary print:text-lg print:mb-4">2. Cenário Macroeconômico 2025</h3>
              
              <div className="space-y-6 print:space-y-3">
                {/* Brasil */}
                <div className="space-y-3 print:space-y-1">
                  <div className="flex items-center gap-3 mb-2 print:mb-1">
                    <div className="bg-blue-100 p-2 rounded-full print:p-1">
                    <Activity size={20} className="text-green-600 print:w-3 print:h-3" />
                    </div>
                    <h4 className="font-semibold text-lg print:text-sm">Brasil</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-11 print:text-xs print:pl-6 print:leading-tight">{macro.brasil}</p>
                </div>

                {/* Mundo */}
                <div className="space-y-3 print:space-y-1">
                  <div className="flex items-center gap-3 mb-2 print:mb-1">
                    <div className="bg-green-100 p-2 rounded-full print:p-1">
                      <Globe size={20} className="text-blue-600 print:w-3 print:h-3" />
                    </div>
                    <h4 className="font-semibold text-lg print:text-sm">Mundo</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-11 print:text-xs print:pl-6 print:leading-tight">{macro.mundo}</p>
                </div>

                {/* Implicações */}
                <div className="bg-secondary/50 p-6 rounded-xl mt-6 print:p-3 print:mt-3">
                  <h4 className="font-semibold text-base mb-3 flex items-center gap-2 print:text-sm print:mb-2">
                    <Target size={18} className="print:w-3 print:h-3" />
                    Implicações para Alocação
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed print:text-xs print:leading-tight">{macro.implicacoes}</p>
                </div>
              </div>
            </div>
          </HideableCard>
        </div>

        {/* Ativos */}
        <div
          ref={ativosCardRef as React.RefObject<HTMLDivElement>}
          className="animate-on-scroll"
        >
          <HideableCard
            id="ativos-alocacao"
            isVisible={isCardVisible("ativos-alocacao")}
            onToggleVisibility={() => toggleCardVisibility("ativos-alocacao")}
            hideControls={hideControls}
          >
            <div className="p-8 print:p-4">
              <h3 className="text-2xl font-semibold mb-6 text-primary print:text-lg print:mb-3">3. Ativos Classificados</h3>
              <div className="space-y-6 print:space-y-3">
                {(() => {
                  // Agrupar ativos por classe
                  const ativosPorClasse = ativos.reduce((acc, ativo) => {
                    const classe = ativo.classe;
                    if (!acc[classe]) {
                      acc[classe] = [];
                    }
                    acc[classe].push(ativo);
                    return acc;
                  }, {} as Record<string, typeof ativos>);

                  // Renderizar cada classe com seus ativos
                  return Object.entries(ativosPorClasse).map(([classe, ativosClasse]) => {
                    // Calcular subtotal da classe
                    const subtotalClasse = ativosClasse.reduce((sum, ativo) => sum + ativo.valor, 0);
                    const percentualClasse = patrimonioCarteiraBrasil > 0 ? (subtotalClasse / patrimonioCarteiraBrasil) * 100 : 0;
                    
                    return (
                      <div key={classe} className="space-y-3 print:space-y-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-base text-primary border-b pb-2 print:text-sm print:pb-1">{classe}</h4>
                          <div className="text-right">
                            <div className="font-bold text-primary text-sm print:text-xs">
                              {formatCurrency(subtotalClasse)}
                            </div>
                            <div className="text-xs text-muted-foreground print:text-xs">
                              {percentualClasse.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 print:space-y-1">
                          {ativosClasse
                            .sort((a, b) => b.valor - a.valor) // Ordenar do maior para o menor
                            .map((ativo, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors print:p-2 print:bg-transparent print:hover:bg-transparent">
                              <div className="flex-1">
                                <div className="font-medium text-sm print:text-xs">{ativo.nome}</div>
                                {ativo.obs && (
                                  <div className="text-xs text-blue-600 mt-1 print:text-xs print:mt-0">{ativo.obs}</div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-primary print:text-xs">{formatCurrency(ativo.valor)}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
                
                {/* Totalizador Geral */}
                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <span className="font-bold text-lg">TOTAL GERAL</span>
                    <div className="text-right">
                      <div className="font-bold text-lg text-primary">
                        {formatCurrency(ativos.reduce((sum, ativo) => sum + ativo.valor, 0))}
                      </div>
                      <div className="text-sm font-semibold text-muted-foreground">
                        {patrimonioCarteiraBrasil > 0 ? 
                          ((ativos.reduce((sum, ativo) => sum + ativo.valor, 0) / patrimonioCarteiraBrasil) * 100).toFixed(1) : 
                          '0.0'
                        }%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </HideableCard>
        </div>

        {/* Consolidação */}
        <div
          ref={consolidadoCardRef as React.RefObject<HTMLDivElement>}
          className="animate-on-scroll"
        >
          <HideableCard
            id="consolidado-alocacao"
            isVisible={isCardVisible("consolidado-alocacao")}
            onToggleVisibility={() => toggleCardVisibility("consolidado-alocacao")}
            hideControls={hideControls}
          >
            <div className="p-8 print:p-4">
              <h3 className="text-2xl font-semibold mb-6 text-primary print:text-lg print:mb-3">4. Consolidação por Classe</h3>
              <div className="space-y-4">
                {sortedConsolidado.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.classe}</span>
                      <div className="text-right">
                        <div className="font-semibold text-primary">{formatCurrency(item.valor)}</div>
                        <div className="text-sm text-muted-foreground">{item.percentual}</div>
                      </div>
                    </div>
                    <ProgressBar 
                      value={parsePercent(item.percentual)} 
                      max={100} 
                      size="md" 
                      color={getClassColor(item.classe)}
                    />
                  </div>
                ))}
                
                {/* Totalizador */}
                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <span className="font-bold text-lg">TOTAL</span>
                    <div className="text-right">
                      <div className="font-bold text-lg text-primary">
                        {formatCurrency(sortedConsolidado.reduce((sum, item) => sum + item.valor, 0))}
                      </div>
                      <div className="text-sm font-semibold text-muted-foreground">
                        {sortedConsolidado.reduce((sum, item) => sum + parsePercent(item.percentual), 0).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </HideableCard>
        </div>

        {/* Liquidez (oculto) */}
        {false && (
          <div
            ref={liquidezCardRef as React.RefObject<HTMLDivElement>}
            className="animate-on-scroll"
          >
            <HideableCard
              id="liquidez-alocacao"
              isVisible={isCardVisible("liquidez-alocacao")}
              onToggleVisibility={() => toggleCardVisibility("liquidez-alocacao")}
              hideControls={hideControls}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">5. Análise de Liquidez</h3>
                <div className="space-y-4">
                  {liquidez.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.faixa}</span>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(item.valor)}</div>
                          <div className="text-xs text-muted-foreground">{item.percentual}</div>
                        </div>
                      </div>
                      <ProgressBar 
                        value={parseFloat(item.percentual)} 
                        max={100} 
                        size="sm" 
                        color={item.faixa === 'D+0' ? "success" : item.faixa === '>D+60' ? "danger" : "warning"}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </HideableCard>
          </div>
        )}

        {/* Internacional */}
        <div
          ref={internacionalCardRef as React.RefObject<HTMLDivElement>}
          className="animate-on-scroll"
        >
          <HideableCard
            id="internacional-alocacao"
            isVisible={isCardVisible("internacional-alocacao")}
            onToggleVisibility={() => toggleCardVisibility("internacional-alocacao")}
            hideControls={hideControls}
          >
            <div className="p-8">
              <h3 className="text-2xl font-semibold mb-6 text-primary">5. Conta Internacional</h3>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-primary">{formatCurrency(internacional.valor)}</div>
                <div className="text-xl mb-4">{internacional.percentual}</div>
                <div className="mb-4">
                  <ProgressBar 
                    value={parseFloat(internacional.percentual)} 
                    max={20} 
                    size="lg" 
                    color={parseFloat(internacional.percentual) < 5 ? "danger" : "success"}
                  />
                </div>
                <StatusChip 
                  status={parseFloat(internacional.percentual) < 5 ? "danger" : "success"} 
                  label="Recomendado: 18%" 
                  icon={<Globe size={14} />}
                />
              </div>
            </div>
          </HideableCard>
        </div>

        {/* Comparativo */}
        <div
          ref={comparativoCardRef as React.RefObject<HTMLDivElement>}
          className="animate-on-scroll"
        >
          <HideableCard
            id="comparativo-alocacao"
            isVisible={isCardVisible("comparativo-alocacao")}
            onToggleVisibility={() => toggleCardVisibility("comparativo-alocacao")}
            hideControls={hideControls}
          >
            <div className="p-8">
              <h3 className="text-2xl font-semibold mb-6 text-primary">6. Comparativo: Atual vs. Ideal</h3>
              
              {/* Controles de Ordenação */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-muted-foreground mr-2">Ordenar por:</span>
                  <Button
                    variant={sortBy === 'ideal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSort('ideal')}
                    className="text-xs"
                  >
                    % Ideal {sortBy === 'ideal' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </Button>
                  <Button
                    variant={sortBy === 'atual' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSort('atual')}
                    className="text-xs"
                  >
                    % Atual {sortBy === 'atual' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </Button>
                  <Button
                    variant={sortBy === 'situacao' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSort('situacao')}
                    className="text-xs"
                  >
                    Situação {sortBy === 'situacao' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </Button>
                  <Button
                    variant={sortBy === 'faltam' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSort('faltam')}
                    className="text-xs"
                  >
                    Faltam/Excesso {sortBy === 'faltam' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm md:text-base">
                    <thead>
                      <tr className="border-b bg-secondary/50">
                        <th className="text-left py-3 uppercase tracking-wide text-xs text-muted-foreground">Classe</th>
                        <th className="text-center py-3 uppercase tracking-wide text-xs text-muted-foreground">% Atual</th>
                        <th className="text-center py-3 uppercase tracking-wide text-xs text-muted-foreground">% Ideal</th>
                        <th className="text-center py-3 uppercase tracking-wide text-xs text-muted-foreground">Situação</th>
                        <th className="text-center py-3 uppercase tracking-wide text-xs text-muted-foreground">Faltam/Excesso (R$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparativo
                        .sort(sortComparativo)
                        .map((item, index) => {
                        const diff = getDiffFinanceiro(item.atual, item.ideal);
                        const atualPct = parsePercent(item.atual);
                        const idealPct = parsePercent(item.ideal);
                        const deltaPct = idealPct - atualPct;
                        return (
                        <tr key={index} className="border-b border-border/50 hover:bg-secondary/30">
                          <td className="py-4 font-medium">
                            {item.classe}
                            {item.classe.toLowerCase().includes('internacional') && (
                              <span className="text-xs text-muted-foreground ml-1">*</span>
                            )}
                          </td>
                          <td className="py-4 text-center">{item.atual}</td>
                          <td className="py-4 text-center">{item.ideal}</td>
                          <td className="py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {getSituacaoIcon(item.situacao)}
                              <span className="text-sm">{item.situacao.replace(/[✅⚠️❌]/g, '').trim()}</span>
                            </div>
                          </td>
                          <td className="py-4 text-center">
                            {diff.label === '-' ? (
                              <span className="text-green-700 font-medium">-</span>
                            ) : (
                              <span className={diff.label === 'Faltam' ? 'text-red-600 font-medium' : 'text-yellow-600 font-medium'}>
                                {formatCurrency(diff.value)}
                              </span>
                            )}
                          </td>
                        </tr>
                        );
                      })}
                      {/* Linha de Total */}
                      <tr className="bg-secondary/40 border-t-2 border-primary/20">
                        <td className="py-4 font-semibold text-primary">TOTAL</td>
                        <td className="py-4 text-center font-semibold text-primary">
                          {(() => {
                            const totalAtual = comparativo.reduce((sum, item) => sum + parsePercent(item.atual), 0);
                            // Arredondar para 100.0% se estiver entre 99.8% e 100.2%
                            if (totalAtual >= 99.8 && totalAtual <= 100.2) {
                              return '100.0%';
                            }
                            return totalAtual.toFixed(1) + '%';
                          })()}
                        </td>
                        <td className="py-4 text-center font-semibold text-primary">
                          {comparativo.reduce((sum, item) => sum + parsePercent(item.ideal), 0).toFixed(1)}%
                        </td>
                        <td className="py-4 text-center font-semibold text-primary">-</td>
                        <td className="py-4 text-center font-semibold text-primary">
                          {(() => {
                            const totalFalta = comparativo.reduce((sum, item) => {
                              const d = getDiffFinanceiro(item.atual, item.ideal);
                              return sum + (d.label === 'Faltam' ? d.value : 0);
                            }, 0);
                            const totalExcesso = comparativo.reduce((sum, item) => {
                              const d = getDiffFinanceiro(item.atual, item.ideal);
                              return sum + (d.label === 'Excesso' ? d.value : 0);
                            }, 0);
                            const neto = totalFalta - totalExcesso;
                            if (Math.abs(neto) < 0.01) return '-';
                            return neto > 0 ? 
                              <span className="text-red-600">Faltam {formatCurrency(neto)}</span> :
                              <span className="text-yellow-600">Excesso {formatCurrency(Math.abs(neto))}</span>;
                          })()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* Nota explicativa */}
                <div className="mt-4 text-xs text-muted-foreground">
                  <span className="font-medium">*</span> A alocação internacional na carteira brasileira refere-se à exposição a ativos globais para melhorar a diversificação geográfica e reduzir a concentração de risco no mercado doméstico.
                </div>
                {/* Cards laterais removidos para a tabela ocupar o grid inteiro */}
              </div>
            </div>
          </HideableCard>
        </div>

        {/* Plano de Rebalanceamento - REMOVIDO a pedido: manter apenas destaque no modelo */}


        {/* Modelo Ideal */}
        <div
          ref={modeloIdealCardRef as React.RefObject<HTMLDivElement>}
          className="animate-on-scroll"
        >
          <HideableCard
            id="modelo-ideal-alocacao"
            isVisible={isCardVisible("modelo-ideal-alocacao")}
            onToggleVisibility={() => toggleCardVisibility("modelo-ideal-alocacao")}
            hideControls={hideControls}
          >
            <div className="p-8">
              <h3 className="text-2xl font-semibold mb-6 text-primary">7. Modelo de Carteira Ideal</h3>
              
              {/* Controles de Tipo de Carteira */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-medium text-muted-foreground mr-2">Tipo de Carteira:</span>
                    <Button
                      variant={portfolioType === 'fee-based' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPortfolioType('fee-based')}
                      className="text-xs"
                    >
                      Fee Based
                    </Button>
                    <Button
                      variant={portfolioType === 'commission-based' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPortfolioType('commission-based')}
                      className="text-xs"
                    >
                      Commission Based
                    </Button>
                  </div>
                  
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-medium text-muted-foreground mr-2">Perfil do Cliente:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedProfile === 1 ? 'bg-blue-100 text-blue-800' :
                      selectedProfile === 2 ? 'bg-green-100 text-green-800' :
                      selectedProfile === 3 ? 'bg-yellow-100 text-yellow-800' :
                      selectedProfile === 4 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedProfile === 1 && 'Super Conservador'}
                      {selectedProfile === 2 && 'Conservador'}
                      {selectedProfile === 3 && 'Moderado'}
                      {selectedProfile === 4 && 'Arrojado'}
                      {selectedProfile === 5 && 'Agressivo'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Volatilidade:</span>
                      <span className="text-sm text-gray-600">
                        {selectedProfile === 1 && '0,10% - 0,80%'}
                        {selectedProfile === 2 && '0,20% - 1,50%'}
                        {selectedProfile === 3 && '1,50% - 4,00%'}
                        {selectedProfile === 4 && '4,00% - 7,00%'}
                        {selectedProfile === 5 && '7,00% - 12,00%'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Horizonte:</span>
                      <span className="text-sm text-gray-600">
                        {selectedProfile <= 2 && '3 anos'}
                        {selectedProfile >= 3 && '5 anos'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Rentabilidade Alvo:</span>
                      <span className="text-sm text-gray-600">
                        {selectedProfile === 1 && '107,5% - 112,5% CDI'}
                        {selectedProfile === 2 && '115,0% - 120,0% CDI'}
                        {selectedProfile === 3 && '122,5% - 127,5% CDI'}
                        {selectedProfile === 4 && '130,0% - 140,0% CDI'}
                        {selectedProfile === 5 && '+ 140,0% CDI'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleAllClasses}
                      className="text-xs flex items-center gap-2"
                    >
                      {(() => {
                        const carteiraAtual = portfolioType === 'fee-based' 
                          ? getCarteiraFeeBased(selectedProfile)
                          : getCarteiraCommissionBased(selectedProfile);
                        const filteredCarteira = carteiraAtual.filter(item => parsePercent(item.percentual) > 0);
                        const groupedByClass = filteredCarteira.reduce((acc, item) => {
                          const classe = item.classe;
                          if (!acc[classe]) {
                            acc[classe] = [];
                          }
                          acc[classe].push(item);
                          return acc;
                        }, {} as Record<string, typeof filteredCarteira>);
                        const allClasses = Object.keys(groupedByClass);
                        const allCollapsed = allClasses.every(classe => collapsedClasses.has(classe));
                        return allCollapsed ? (
                          <>
                            <ChevronRight className="h-3 w-3" />
                            Expandir Todas
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3" />
                            Colapsar Todas
                          </>
                        );
                      })()}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm md:text-base">
                  <thead>
                    <tr className="border-b bg-secondary/50">
                      <th className="text-left py-3 uppercase tracking-wide text-xs text-muted-foreground">Classe</th>
                      <th className="text-left py-3 uppercase tracking-wide text-xs text-muted-foreground">Exemplo</th>
                      <th className="text-center py-3 uppercase tracking-wide text-xs text-muted-foreground">% Alocação</th>
                      <th className="text-center py-3 uppercase tracking-wide text-xs text-muted-foreground">Valor Alocado (R$)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      // Obter carteira baseada no tipo selecionado e perfil escolhido
                      let carteiraAtual = portfolioType === 'fee-based' 
                        ? getCarteiraFeeBased(selectedProfile)
                        : getCarteiraCommissionBased(selectedProfile);
                      
                      // Mostrar todos os produtos sem filtro por tipo de investidor
                      
                      // Filtrar produtos com percentual 0%
                      carteiraAtual = carteiraAtual.filter(item => 
                        parsePercent(item.percentual) > 0
                      );
                      
                      // Agrupar por classe
                      const groupedByClass = carteiraAtual.reduce((acc, item) => {
                        const classe = item.classe;
                        if (!acc[classe]) {
                          acc[classe] = [];
                        }
                        acc[classe].push(item);
                        return acc;
                      }, {} as Record<string, typeof carteiraAtual>);

                      // Renderizar grupos com subtotais
                      const rows: JSX.Element[] = [];
                      let totalPct = 0;
                      let totalValor = 0;

                      Object.entries(groupedByClass).forEach(([classe, items], groupIndex) => {
                        let classePct = 0;
                        let classeValor = 0;
                        const isCollapsed = collapsedClasses.has(classe);

                        // Calcular totais da classe
                        items.forEach((item) => {
                          const pct = parsePercent(item.percentual);
                          const valor = (patrimonioCarteiraBrasil * pct) / 100;
                          classePct += pct;
                          classeValor += valor;
                        });

                        // Adicionar cabeçalho da classe com botão de colapso
                        rows.push(
                          <tr 
                            key={`header-${groupIndex}`} 
                            className="bg-secondary/30 border-b-2 border-primary/30 cursor-pointer hover:bg-secondary/50 transition-colors"
                            onClick={() => toggleClassCollapse(classe)}
                          >
                            <td className="py-4 font-bold text-primary flex items-center gap-2 pl-4">
                              {isCollapsed ? (
                                <ChevronRight className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                              {classe}
                              {classe.toLowerCase().includes('internacional') && (
                                <span className="text-xs text-muted-foreground ml-1">*</span>
                              )}
                            </td>
                            <td className="py-4 text-sm text-muted-foreground">
                              {isCollapsed ? (
                                `${items.length} produto${items.length !== 1 ? 's' : ''}`
                              ) : (
                                'Clique para colapsar'
                              )}
                            </td>
                            <td className="py-4 text-center font-bold text-primary">
                              {classePct.toFixed(2)}%
                            </td>
                            <td className="py-4 text-center font-bold text-primary">
                              {formatCurrency(classeValor)}
                            </td>
                          </tr>
                        );

                        // Adicionar produtos da classe (só se não estiver colapsada)
                        if (!isCollapsed) {
                          items.forEach((item, itemIndex) => {
                            const pct = parsePercent(item.percentual);
                            const valor = (patrimonioCarteiraBrasil * pct) / 100;

                            rows.push(
                              <tr key={`${groupIndex}-${itemIndex}`} className="border-b border-border/50 hover:bg-secondary/30">
                                <td className="py-4 font-medium pl-8 text-sm text-muted-foreground">
                                  {item.classe}
                                </td>
                                <td className="py-4 text-sm">
                                  {item.exemplo}
                                </td>
                                <td className="py-4 text-center font-semibold">{item.percentual}</td>
                                <td className="py-4 text-center font-semibold text-primary">{formatCurrency(valor)}</td>
                              </tr>
                            );
                          });
                        }

                        totalPct += classePct;
                        totalValor += classeValor;
                      });

                      return rows;
                    })()}
                    {/* Totais */}
                    <tr className="bg-secondary/40">
                      <td className="py-4 font-semibold" colSpan={2}>Total</td>
                      <td className="py-4 text-center font-semibold">{(() => {
                        const carteiraAtual = portfolioType === 'fee-based' 
                          ? getCarteiraFeeBased(selectedProfile)
                          : getCarteiraCommissionBased(selectedProfile);
                        let filteredCarteira = carteiraAtual;
                        // Mostrar todos os produtos sem filtro por tipo de investidor
                        filteredCarteira = carteiraAtual;
                        const totalPct = filteredCarteira.reduce((sum, item) => sum + parsePercent(item.percentual), 0);
                        // Mostrar o total real calculado sem casas decimais
                        return Math.round(totalPct).toString();
                      })()}%</td>
                      <td className="py-4 text-center font-semibold text-primary">{(() => {
                        const carteiraAtual = portfolioType === 'fee-based' 
                          ? getCarteiraFeeBased(selectedProfile)
                          : getCarteiraCommissionBased(selectedProfile);
                        let filteredCarteira = carteiraAtual;
                        // Mostrar todos os produtos sem filtro por tipo de investidor
                        filteredCarteira = carteiraAtual;
                        const totalPct = filteredCarteira.reduce((sum, item) => sum + parsePercent(item.percentual), 0);
                        // Calcular valor baseado no total real
                        const totalValor = (patrimonioCarteiraBrasil * totalPct) / 100;
                        return formatCurrency(totalValor);
                      })()}</td>
                    </tr>
                  </tbody>
                </table>
                {/* Nota explicativa */}
                <div className="mt-4 text-xs text-muted-foreground">
                  <span className="font-medium">*</span> A alocação internacional na carteira brasileira refere-se à exposição a ativos globais para melhorar a diversificação geográfica e reduzir a concentração de risco no mercado doméstico.
                </div>
              </div>
            </div>
          </HideableCard>
        </div>
      </div>
    </section>
  );
};

export default AllocationDiagnosis; 