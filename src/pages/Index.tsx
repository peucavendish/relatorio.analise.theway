import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { CardVisibilityProvider } from '@/context/CardVisibilityContext';
import { SectionVisibilityProvider } from '@/context/SectionVisibilityContext';
import Header from '@/components/layout/Header';
import CoverPage from '@/components/sections/CoverPage';
import AllocationDiagnosis from '@/components/sections/AllocationDiagnosis';
import { PDFGeneratorButton } from '@/components/ui/PDFGeneratorButton';
import FloatingActions from '@/components/layout/FloatingActions';
import { useSectionObserver } from '@/hooks/useSectionObserver';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import HideableSection from '@/components/ui/HideableSection';

interface IndexPageProps {
  accessor?: boolean;
  clientPropect?: boolean;
}

const IndexPage: React.FC<IndexPageProps> = ({ accessor, clientPropect }) => {
  const { activeSection, navigateToSection } = useSectionObserver();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userReports, setUserReports] = useState(null);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  
  // Obter sessionId atual da URL
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('sessionId');

  const getClientData = () => ({
    cliente: {
      nome: userReports?.cliente?.nome || `Cliente ${userReports?.cliente?.codigo_xp || 'XP'}`,
      idade: userReports?.cliente?.idade || 0,
      codigoXP: userReports?.cliente?.codigo_xp || "",
      perfil: userReports?.cliente?.perfil_av || 0,
      tipo: userReports?.cliente?.tipo || "Pessoa Física",
      qualificacao: userReports?.cliente?.qualificacao_investidor || ""
    },
    financas: {
      patrimonioLiquido: userReports?.financas?.resumo?.patrimonio_liquido || 0,
      excedenteMensal: userReports?.financas?.resumo?.excedente_mensal || 0,
      rendas: userReports?.financas?.rendas || [],
      despesasMensais: userReports?.financas?.resumo?.despesas_mensais || 0,
      composicaoPatrimonial: userReports?.financas?.composicao_patrimonial || {},
      ativos: userReports?.financas?.ativos?.map(a => ({
        tipo: a.tipo,
        valor: a.valor,
        classe: a.classe
      })) || [],
      passivos: userReports?.financas?.passivos || []
    }
  });

    // Função para obter alocações ideais por perfil
    const getAlocacoesIdeaisByPerfil = (perfil: number) => {
    const alocacoes = {
      1: { // SUPER CONSERVADOR
        'RF - Pós-fixado': 83,
        'RF - IPCA': 12,
        'RF - Pré-fixado': 5,
        'Renda Variável - Brasil': 0,
        'Fundo Imobiliário': 0,
        'Multimercado': 0,
        'Moedas': 0,
        'Alternativo': 0,
        'Internacional': 0,
        'Outros': 0,
        'Criptomoedas': 0,
        'Derivativos': 0,
        'Caixa': 0
      },
      2: { // CONSERVADOR
        'RF - Pós-fixado': 70,
        'RF - IPCA': 15,
        'RF - Pré-fixado': 6,
        'Multimercado': 3,
        'Internacional': 6,
        'Renda Variável - Brasil': 0,
        'Fundo Imobiliário': 0,
        'Moedas': 0,
        'Alternativo': 0,
        'Outros': 0,
        'Criptomoedas': 0,
        'Derivativos': 0,
        'Caixa': 0
      },
      3: { // MODERADO
        'RF - Pós-fixado': 43,
        'RF - IPCA': 20,
        'RF - Pré-fixado': 9,
        'Multimercado': 7,
        'Renda Variável - Brasil': 6.5,
        'Internacional': 10,
        'Fundo Imobiliário': 2,
        'Alternativo': 2,
        'Moedas': 0,
        'Outros': 0,
        'Criptomoedas': 0.5,
        'Derivativos': 0,
        'Caixa': 0
      },
      4: { // ARROJADO
        'RF - Pós-fixado': 23,
        'RF - IPCA': 25,
        'RF - Pré-fixado': 11,
        'Renda Variável - Brasil': 9.5,
        'Fundo Imobiliário': 3,
        'Multimercado': 11,
        'Internacional': 14,
        'Alternativo': 3,
        'Moedas': 0,
        'Outros': 0,
        'Criptomoedas': 0.75,
        'Derivativos': 0,
        'Caixa': 0
      },
      5: { // AGRESSIVO
        'RF - Pós-fixado': 10,
        'RF - IPCA': 27,
        'RF - Pré-fixado': 12,
        'Renda Variável - Brasil': 14.5,
        'Fundo Imobiliário': 4.5,
        'Multimercado': 11,
        'Internacional': 16,
        'Alternativo': 4,
        'Moedas': 0,
        'Outros': 0,
        'Criptomoedas': 1,
        'Derivativos': 0,
        'Caixa': 0
      }
    };
    
    return alocacoes[perfil as keyof typeof alocacoes] || alocacoes[5]; // Default para Agressivo
  };

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
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'JIVE BOSSANOVA HIGH YIELD ADVISORY FIC FIDC (IQ) / JIVEMAJA BOSSANOVA 90 FIDC (IG)', percentual: '4.00%', liquidez: '362 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - IPCA', exemplo: 'CRÉDITO PRIVADO IPCA OFERTA', percentual: '10.50%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - IPCA', exemplo: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL (IQ E IG)', percentual: '4.50%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - Pré-fixado', exemplo: 'CRÉDITO PRIVADO PRÉ', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - Pré-fixado', exemplo: 'BANCÁRIO', percentual: '3.00%', liquidez: '1 dia', tipoInvestidor: 'IG' },
        { classe: 'Multimercado', exemplo: 'KAPITALO K10 ADVISORY FIF EM COTAS DE FIM (IQ E IG)', percentual: '1.50%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Multimercado', exemplo: 'V8 SPEEDWAY LONG SHORT FIF FIF MULTIMERCADO (IQ E IG)', percentual: '1.50%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Internacional', exemplo: 'WHG GLOBAL LONG BIASED BRL FIC FIA IE (IQ) / WELLINGTON VENTURA ADVISORY CI AÇÕES IE RL (IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Internacional', exemplo: 'GAMA PEARL DIVER GLOBAL FLOATING INCOME BRL FIC FIM IE RL (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' }
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
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'JIVE BOSSANOVA HIGH YIELD ADVISORY FIC FIDC (IQ) / JIVEMAJA BOSSANOVA 90 FIDC (IG)', percentual: '5.00%', liquidez: '362 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - IPCA', exemplo: 'CRÉDITO PRIVADO IPCA OFERTA', percentual: '14.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - IPCA', exemplo: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL (IQ E IG)', percentual: '6.00%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - Pré-fixado', exemplo: 'CRÉDITO PRIVADO PRÉ', percentual: '4.50%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - Pré-fixado', exemplo: 'BANCÁRIO', percentual: '4.50%', liquidez: '1 dia', tipoInvestidor: 'IG' },
        { classe: 'Renda Variável - Brasil', exemplo: 'REAL INVESTOR FIC DE FIF EM AÇÕES RL (IQ E IG)', percentual: '2.25%', liquidez: '29 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Variável - Brasil', exemplo: 'TARPON GT 90 FIF FIA (IQ E IG)', percentual: '2.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Variável - Brasil', exemplo: 'ALPHAKEY AÇÕES FIF EM COTAS DE FIA RL (IQ) / AZ QUEST TOP LONG BIASED FIC FIF AÇÕES (IG)', percentual: '2.25%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Fundo Imobiliário', exemplo: 'FIIs - Carteira recomendada (IG)', percentual: '3.00%', liquidez: '2 dias', tipoInvestidor: 'IG' },
        { classe: 'Multimercado', exemplo: 'KAPITALO K10 ADVISORY FIF EM COTAS DE FIM (IQ E IG)', percentual: '2.50%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Multimercado', exemplo: 'V8 SPEEDWAY LONG SHORT FIF FIF MULTIMERCADO (IQ E IG)', percentual: '2.50%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Multimercado', exemplo: 'VINLAND 2 ATIVO DEBENTURES DE INFRA FI RF (IQ E IG)', percentual: '2.00%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Alternativo', exemplo: 'INVESTIMENTOS ALTERNATIVOS', percentual: '2.00%', liquidez: '-' },
        { classe: 'Internacional', exemplo: 'WHG GLOBAL LONG BIASED BRL FIC FIA IE (IQ) / WELLINGTON VENTURA ADVISORY CI AÇÕES IE RL (IG)', percentual: '5.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Internacional', exemplo: 'GAMA PEARL DIVER GLOBAL FLOATING INCOME BRL FIC FIM IE RL (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '5.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
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
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'JIVE BOSSANOVA HIGH YIELD ADVISORY FIC FIDC (IQ) / JIVEMAJA BOSSANOVA 90 FIDC (IG)', percentual: '3.00%', liquidez: '362 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - IPCA', exemplo: 'CRÉDITO PRIVADO IPCA OFERTA', percentual: '17.50%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - IPCA', exemplo: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL (IQ E IG)', percentual: '7.50%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - Pré-fixado', exemplo: 'CRÉDITO PRIVADO PRÉ', percentual: '5.50%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - Pré-fixado', exemplo: 'BANCÁRIO', percentual: '5.50%', liquidez: '1 dia', tipoInvestidor: 'IG' },
        { classe: 'Renda Variável - Brasil', exemplo: 'REAL INVESTOR FIC DE FIF EM AÇÕES RL (IQ E IG)', percentual: '3.00%', liquidez: '29 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Variável - Brasil', exemplo: 'TARPON GT 90 FIF FIA (IQ E IG)', percentual: '2.50%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Variável - Brasil', exemplo: 'ALPHAKEY AÇÕES FIF EM COTAS DE FIA RL (IQ) / AZ QUEST TOP LONG BIASED FIC FIF AÇÕES (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Fundo Imobiliário', exemplo: 'FIIs - Carteira recomendada (IG)', percentual: '3.75%', liquidez: '2 dias', tipoInvestidor: 'IG' },
        { classe: 'Multimercado', exemplo: 'KAPITALO K10 ADVISORY FIF EM COTAS DE FIM (IQ E IG)', percentual: '3.50%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Multimercado', exemplo: 'V8 SPEEDWAY LONG SHORT FIF FIF MULTIMERCADO (IQ E IG)', percentual: '3.50%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Multimercado', exemplo: 'VINLAND 2 ATIVO DEBENTURES DE INFRA FI RF (IQ E IG)', percentual: '3.00%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Alternativo', exemplo: 'INVESTIMENTOS ALTERNATIVOS', percentual: '3.00%', liquidez: '-' },
        { classe: 'Internacional', exemplo: 'WHG GLOBAL LONG BIASED BRL FIC FIA IE (IQ) / WELLINGTON VENTURA ADVISORY CI AÇÕES IE RL (IG)', percentual: '7.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Internacional', exemplo: 'GAMA PEARL DIVER GLOBAL FLOATING INCOME BRL FIC FIM IE RL (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '7.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
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
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'JIVE BOSSANOVA HIGH YIELD ADVISORY FIC FIDC (IQ) / JIVEMAJA BOSSANOVA 90 FIDC (IG)', percentual: '3.00%', liquidez: '362 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - IPCA', exemplo: 'CRÉDITO PRIVADO IPCA OFERTA', percentual: '18.90%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - IPCA', exemplo: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL (IQ E IG)', percentual: '8.10%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - Pré-fixado', exemplo: 'CRÉDITO PRIVADO PRÉ', percentual: '6.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - Pré-fixado', exemplo: 'BANCÁRIO', percentual: '6.00%', liquidez: '1 dia', tipoInvestidor: 'IG' },
        { classe: 'Renda Variável - Brasil', exemplo: 'REAL INVESTOR FIC DE FIF EM AÇÕES RL (IQ E IG)', percentual: '4.50%', liquidez: '29 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Variável - Brasil', exemplo: 'TARPON GT 90 FIF FIA (IQ E IG)', percentual: '3.50%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Variável - Brasil', exemplo: 'ALPHAKEY AÇÕES FIF EM COTAS DE FIA RL (IQ) / AZ QUEST TOP LONG BIASED FIC FIF AÇÕES (IG)', percentual: '6.50%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Fundo Imobiliário', exemplo: 'FIIs - Carteira recomendada (IG)', percentual: '4.50%', liquidez: '2 dias', tipoInvestidor: 'IG' },
        { classe: 'Multimercado', exemplo: 'KAPITALO K10 ADVISORY FIF EM COTAS DE FIM (IQ E IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Multimercado', exemplo: 'V8 SPEEDWAY LONG SHORT FIF FIF MULTIMERCADO (IQ E IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Multimercado', exemplo: 'VINLAND 2 ATIVO DEBENTURES DE INFRA FI RF (IQ E IG)', percentual: '3.00%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Alternativo', exemplo: 'INVESTIMENTOS ALTERNATIVOS', percentual: '4.00%', liquidez: '-' },
        { classe: 'Internacional', exemplo: 'WHG GLOBAL LONG BIASED BRL FIC FIA IE (IQ) / WELLINGTON VENTURA ADVISORY CI AÇÕES IE RL (IG)', percentual: '8.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Internacional', exemplo: 'GAMA PEARL DIVER GLOBAL FLOATING INCOME BRL FIC FIM IE RL (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '8.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
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
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BANCÁRIO ISENTO S1', percentual: '11.20%', liquidez: '1 dia' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO %CDI', percentual: '5.60%', liquidez: '30 dias' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO CDI+', percentual: '11.20%', liquidez: '30 dias' },
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
        { classe: 'Multimercado', exemplo: 'VINLAND 2 ATIVO DEBENTURES DE INFRA FI RF (IQ E IG)', percentual: '3.00%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Internacional', exemplo: 'WHG GLOBAL LONG BIASED BRL FIC FIA IE (IQ) / WELLINGTON VENTURA ADVISORY CI AÇÕES IE RL (IG)', percentual: '2.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Internacional', exemplo: 'GAMA PEARL DIVER GLOBAL FLOATING INCOME BRL FIC FIM IE RL (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' }
      ],
      3: [ // MODERADO
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BANCÁRIO ISENTO S1', percentual: '7.04%', liquidez: '1 dia', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO %CDI', percentual: '3.52%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO CDI+', percentual: '7.04%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'SPX SEAHAWK DEBÊNTURES INCENTIVADAS D45 FIF CIC INFRA RF CP LP RL (IQ E IG)', percentual: '7.20%', liquidez: '46 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'ROOT CAPITAL CRÉDITO HG PLUS FIC DE FIF MULTIMERCADO CP RL (IQ) / NOVUS CRÉDITO FIM CP LP (IG)', percentual: '8.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'XP CRÉDITO ESTRUTURADO 120 FIC DE FIF MULTIMERCADO CP RL (IQ) / VALORA VANGUARD FIC DE FIDC RL (IG)', percentual: '5.00%', liquidez: '120 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'JIVE BOSSANOVA HIGH YIELD ADVISORY FIC FIDC (IQ) / JIVEMAJA BOSSANOVA 90 FIDC (IG)', percentual: '5.00%', liquidez: '362 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - IPCA', exemplo: 'CRÉDITO PRIVADO IPCA OFERTA', percentual: '14.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - IPCA', exemplo: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL (IQ E IG)', percentual: '6.00%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - Pré-fixado', exemplo: 'CRÉDITO PRIVADO PRÉ', percentual: '4.50%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - Pré-fixado', exemplo: 'BANCÁRIO', percentual: '4.50%', liquidez: '1 dia', tipoInvestidor: 'IG' },
        { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA MENSAL DE AÇÕES LEVANTE (IQ)', percentual: '0.85%', liquidez: '1 dia', tipoInvestidor: 'IQ' },
        { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA TOP DIVIDENDOS XP (IG)', percentual: '1.27%', liquidez: '1 dia', tipoInvestidor: 'IG' },
        { classe: 'Renda Variável - Brasil', exemplo: 'PRODUTOS ESTRUTURADOS (IQ)', percentual: '1.14%', liquidez: '30 dias', tipoInvestidor: 'IQ' },
        { classe: 'Renda Variável - Brasil', exemplo: 'REAL INVESTOR FIC DE FIF EM AÇÕES RL (IQ E IG)', percentual: '1.25%', liquidez: '29 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Variável - Brasil', exemplo: 'TARPON GT 90 FIF FIA (IQ E IG)', percentual: '1.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Variável - Brasil', exemplo: 'ALPHAKEY AÇÕES FIF EM COTAS DE FIA RL (IQ) / AZ QUEST TOP LONG BIASED FIC FIF AÇÕES (IG)', percentual: '1.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Fundo Imobiliário', exemplo: 'FIIs - Carteira recomendada (IG)', percentual: '2.00%', liquidez: '2 dias', tipoInvestidor: 'IG' },
        { classe: 'Multimercado', exemplo: 'V8 SPEEDWAY LONG SHORT FIF FIF MULTIMERCADO (IQ E IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Multimercado', exemplo: 'VINLAND 2 ATIVO DEBENTURES DE INFRA FI RF (IQ E IG)', percentual: '3.00%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Alternativo', exemplo: 'INVESTIMENTOS ALTERNATIVOS', percentual: '2.00%', liquidez: '-' },
        { classe: 'Internacional', exemplo: 'WHG GLOBAL LONG BIASED BRL FIC FIA IE (IQ) / WELLINGTON VENTURA ADVISORY CI AÇÕES IE RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Internacional', exemplo: 'GAMA PEARL DIVER GLOBAL FLOATING INCOME BRL FIC FIM IE RL (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Internacional', exemplo: 'OAKTREE GLOBAL CREDIT BRL FIC FIM (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Criptomoedas', exemplo: 'HASHDEX 100 NASDAQ CRYPTO INDEX FIM RL (IQ E IG)', percentual: '0.50%', liquidez: '1 dia', tipoInvestidor: 'AMBOS' }
      ],
      4: [ // ARROJADO
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BANCÁRIO ISENTO S1', percentual: '3.68%', liquidez: '1 dia', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO %CDI', percentual: '1.84%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO CDI+', percentual: '3.68%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'SPX SEAHAWK DEBÊNTURES INCENTIVADAS D45 FIF CIC INFRA RF CP LP RL (IQ E IG)', percentual: '3.80%', liquidez: '46 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'ROOT CAPITAL CRÉDITO HG PLUS FIC DE FIF MULTIMERCADO CP RL (IQ) / NOVUS CRÉDITO FIM CP LP (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'XP CRÉDITO ESTRUTURADO 120 FIC DE FIF MULTIMERCADO CP RL (IQ) / VALORA VANGUARD FIC DE FIDC RL (IG)', percentual: '3.00%', liquidez: '120 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'JIVE BOSSANOVA HIGH YIELD ADVISORY FIC FIDC (IQ) / JIVEMAJA BOSSANOVA 90 FIDC (IG)', percentual: '3.00%', liquidez: '362 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - IPCA', exemplo: 'CRÉDITO PRIVADO IPCA OFERTA', percentual: '17.50%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - IPCA', exemplo: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL (IQ E IG)', percentual: '7.50%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - Pré-fixado', exemplo: 'CRÉDITO PRIVADO PRÉ', percentual: '5.50%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - Pré-fixado', exemplo: 'BANCÁRIO', percentual: '5.50%', liquidez: '1 dia', tipoInvestidor: 'IG' },
        { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA MENSAL DE AÇÕES LEVANTE (IQ)', percentual: '1.05%', liquidez: '1 dia', tipoInvestidor: 'IQ' },
        { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA TOP DIVIDENDOS XP (IG)', percentual: '1.57%', liquidez: '1 dia', tipoInvestidor: 'IG' },
        { classe: 'Renda Variável - Brasil', exemplo: 'PRODUTOS ESTRUTURADOS (IQ)', percentual: '1.66%', liquidez: '30 dias', tipoInvestidor: 'IQ' },
        { classe: 'Renda Variável - Brasil', exemplo: 'TRADE IDEAS (IQ)', percentual: '0.48%', liquidez: '1 dia', tipoInvestidor: 'IQ' },
        { classe: 'Renda Variável - Brasil', exemplo: 'REAL INVESTOR FIC DE FIF EM AÇÕES RL (IQ E IG)', percentual: '1.75%', liquidez: '29 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Variável - Brasil', exemplo: 'TARPON GT 90 FIF FIA (IQ E IG)', percentual: '1.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Variável - Brasil', exemplo: 'ALPHAKEY AÇÕES FIF EM COTAS DE FIA RL (IQ) / AZ QUEST TOP LONG BIASED FIC FIF AÇÕES (IG)', percentual: '2.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Fundo Imobiliário', exemplo: 'FIIs - Carteira recomendada (IG)', percentual: '3.00%', liquidez: '2 dias', tipoInvestidor: 'IG' },
        { classe: 'Multimercado', exemplo: 'KAPITALO K10 ADVISORY FIF EM COTAS DE FIM (IQ E IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Multimercado', exemplo: 'V8 SPEEDWAY LONG SHORT FIF FIF MULTIMERCADO (IQ E IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Multimercado', exemplo: 'VINLAND 2 ATIVO DEBENTURES DE INFRA FI RF (IQ E IG)', percentual: '3.00%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Alternativo', exemplo: 'INVESTIMENTOS ALTERNATIVOS', percentual: '3.00%', liquidez: '-' },
        { classe: 'Internacional', exemplo: 'WHG GLOBAL LONG BIASED BRL FIC FIA IE (IQ) / WELLINGTON VENTURA ADVISORY CI AÇÕES IE RL (IG)', percentual: '6.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Internacional', exemplo: 'GAMA PEARL DIVER GLOBAL FLOATING INCOME BRL FIC FIM IE RL (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Internacional', exemplo: 'OAKTREE GLOBAL CREDIT BRL FIC FIM (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Criptomoedas', exemplo: 'HASHDEX 100 NASDAQ CRYPTO INDEX FIM RL (IQ E IG)', percentual: '0.75%', liquidez: '1 dia', tipoInvestidor: 'AMBOS' }
      ],
      5: [ // AGRESSIVO
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'BANCÁRIO ISENTO S1', percentual: '0.00%', liquidez: '1 dia', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO %CDI', percentual: '1.60%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'CRÉDITO PRIVADO CDI+', percentual: '1.60%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'ROOT CAPITAL CRÉDITO HG PLUS FIC DE FIF MULTIMERCADO CP RL (IQ) / NOVUS CRÉDITO FIM CP LP (IG)', percentual: '0.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'XP CRÉDITO ESTRUTURADO 120 FIC DE FIF MULTIMERCADO CP RL (IQ) / VALORA VANGUARD FIC DE FIDC RL (IG)', percentual: '3.00%', liquidez: '120 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - Pós-fixado', exemplo: 'JIVE BOSSANOVA HIGH YIELD ADVISORY FIC FIDC (IQ) / JIVEMAJA BOSSANOVA 90 FIDC (IG)', percentual: '3.00%', liquidez: '362 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - IPCA', exemplo: 'CRÉDITO PRIVADO IPCA OFERTA', percentual: '18.90%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - IPCA', exemplo: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL (IQ E IG)', percentual: '8.10%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Fixa - Pré-fixado', exemplo: 'CRÉDITO PRIVADO PRÉ', percentual: '6.00%', liquidez: '30 dias', tipoInvestidor: 'IG' },
        { classe: 'Renda Fixa - Pré-fixado', exemplo: 'BANCÁRIO', percentual: '6.00%', liquidez: '1 dia', tipoInvestidor: 'IG' },
        { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA MENSAL DE AÇÕES LEVANTE (IQ)', percentual: '1.45%', liquidez: '1 dia', tipoInvestidor: 'IQ' },
        { classe: 'Renda Variável - Brasil', exemplo: 'CARTEIRA TOP DIVIDENDOS XP (IG)', percentual: '2.18%', liquidez: '1 dia', tipoInvestidor: 'IG' },
        { classe: 'Renda Variável - Brasil', exemplo: 'PRODUTOS ESTRUTURADOS (IQ)', percentual: '2.18%', liquidez: '30 dias', tipoInvestidor: 'IQ' },
        { classe: 'Renda Variável - Brasil', exemplo: 'TRADE IDEAS (IQ)', percentual: '1.45%', liquidez: '1 dia', tipoInvestidor: 'IQ' },
        { classe: 'Renda Variável - Brasil', exemplo: 'REAL INVESTOR FIC DE FIF EM AÇÕES RL (IQ E IG)', percentual: '2.25%', liquidez: '29 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Variável - Brasil', exemplo: 'TARPON GT 90 FIF FIA (IQ E IG)', percentual: '2.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Renda Variável - Brasil', exemplo: 'ALPHAKEY AÇÕES FIF EM COTAS DE FIA RL (IQ) / AZ QUEST TOP LONG BIASED FIC FIF AÇÕES (IG)', percentual: '3.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Fundo Imobiliário', exemplo: 'FIIs - Carteira recomendada (IG)', percentual: '4.50%', liquidez: '2 dias', tipoInvestidor: 'IG' },
        { classe: 'Multimercado', exemplo: 'KAPITALO K10 ADVISORY FIF EM COTAS DE FIM (IQ E IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Multimercado', exemplo: 'V8 SPEEDWAY LONG SHORT FIF FIF MULTIMERCADO (IQ E IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Multimercado', exemplo: 'VINLAND 2 ATIVO DEBENTURES DE INFRA FI RF (IQ E IG)', percentual: '3.00%', liquidez: '31 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Alternativo', exemplo: 'INVESTIMENTOS ALTERNATIVOS', percentual: '4.00%', liquidez: '-' },
        { classe: 'Internacional', exemplo: 'WHG GLOBAL LONG BIASED BRL FIC FIA IE (IQ) / WELLINGTON VENTURA ADVISORY CI AÇÕES IE RL (IG)', percentual: '8.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Internacional', exemplo: 'GAMA PEARL DIVER GLOBAL FLOATING INCOME BRL FIC FIM IE RL (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Internacional', exemplo: 'OAKTREE GLOBAL CREDIT BRL FIC FIM (IQ) / AXA WF US DYNAMIC HIGH YIELD BONDS CLASSE FIC CLASSES FIM CP RL (IG)', percentual: '4.00%', liquidez: '30 dias', tipoInvestidor: 'AMBOS' },
        { classe: 'Criptomoedas', exemplo: 'HASHDEX 100 NASDAQ CRYPTO INDEX FIM RL (IQ E IG)', percentual: '1.00%', liquidez: '1 dia', tipoInvestidor: 'AMBOS' }
      ]
    };
    
    return carteiras[perfil as keyof typeof carteiras] || carteiras[5]; // Default para Agressivo
  };

  // Função para obter carteira modelo baseada no perfil
  const getModeloIdealByPerfil = (perfil: number) => {
    const perfis = {
      1: [ // SUPER CONSERVADOR
        { classe: 'RF - Pós-fixada', exemplo: 'Bradesco Zupo FIC FIRF LP CP', percentual: '10%', liquidez: '6 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'Títulos RF PÓS', percentual: '20%', liquidez: '-' },
        { classe: 'RF - Pós-fixada', exemplo: 'Compass Yield 30 FIF RF CP LP RL', percentual: '10%', liquidez: '30 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'Itaú Sinfonia All Distribuidores FIF CIC Mult CP Resp Limta', percentual: '10%', liquidez: '10 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'Valora Guardian Advisory FIDC RL', percentual: '7%', liquidez: '76 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'Capitânia Yield 120 CP FIC FIM CP', percentual: '7%', liquidez: '120 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'Jive BossaNova High Yield Advisory FIC FIDC', percentual: '5%', liquidez: '362 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'ARX Fuji FIC de FIF RF CP RL', percentual: '15%', liquidez: '1 dia' },
        { classe: 'RF - Inflação', exemplo: 'Títulos RF IPCA', percentual: '6%', liquidez: '-' },
        { classe: 'RF - Inflação', exemplo: 'ARX Elbrus Advisory FIC Incentivado FIF em Infra RF RL', percentual: '5%', liquidez: '31 dias' },
        { classe: 'RF - Prefixada', exemplo: 'Títulos RF PRÉ', percentual: '5%', liquidez: '-' }
      ],
      2: [ // CONSERVADOR
        { classe: 'RF - Pós-fixada', exemplo: 'Bradesco Zupo FIC FIRF LP CP', percentual: '15%', liquidez: '6 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'Títulos RF PÓS', percentual: '10%', liquidez: '-' },
        { classe: 'RF - Pós-fixada', exemplo: 'Valora Guardian Advisory FIDC RL', percentual: '5%', liquidez: '76 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'Compass Yield 30 FIF RF CP LP RL', percentual: '10%', liquidez: '30 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'Capitânia Yield 120 CP FIC FIM CP', percentual: '5%', liquidez: '120 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'Jive BossaNova High Yield Advisory FIC FIDC', percentual: '5%', liquidez: '362 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'SPX Seahawk Debêntures Incentivadas D45 FIF CIC Infra RF CP LP RL', percentual: '10%', liquidez: '46 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'ARX Fuji FIC de FIF RF CP RL', percentual: '11%', liquidez: '1 dia' },
        { classe: 'RF - Inflação', exemplo: 'ARX Elbrus Advisory FIC Incentivado FIF em Infra RF RL', percentual: '5%', liquidez: '31 dias' },
        { classe: 'RF - Inflação', exemplo: 'Títulos RF IPCA', percentual: '9%', liquidez: '-' },
        { classe: 'RF - Prefixada', exemplo: 'Títulos RF PRÉ', percentual: '6%', liquidez: '-' },
        { classe: 'Multimercado', exemplo: 'Vinland Incentivado Investimento Debêntures Infraestr RF CP', percentual: '1.5%', liquidez: '31 dias' },
        { classe: 'Multimercado', exemplo: 'Absolute Vertex Advisory FIC FIM', percentual: '1.5%', liquidez: '45 dias' },
        { classe: 'Internacional', exemplo: 'WHG Global Long Biased BRL FIC FIA IE', percentual: '3%', liquidez: '30 dias' },
        { classe: 'Internacional', exemplo: 'Gama Pearl Diver Global Floating Income BRL FIC FIM IE RL', percentual: '3%', liquidez: '-' }
      ],
      3: [ // MODERADO
        { classe: 'RF - Pós-fixada', exemplo: 'SPX Seahawk Debêntures Incentivadas D45 FIF CIC Infra RF CP LP RL', percentual: '8%', liquidez: '46 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'Valora Guardian Advisory FIDC RL', percentual: '5%', liquidez: '76 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'Capitânia Yield 120 CP FIC FIM CP', percentual: '5%', liquidez: '120 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'Jive BossaNova High Yield Advisory FIC FIDC', percentual: '4%', liquidez: '362 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'Compass Yield 30 FIF RF CP LP RL', percentual: '8%', liquidez: '30 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'ARX Fuji FIC de FIF RF CP RL', percentual: '15%', liquidez: '1 dia' },
        { classe: 'RF - Inflação', exemplo: 'Títulos RF IPCA', percentual: '14%', liquidez: '-' },
        { classe: 'RF - Inflação', exemplo: 'ARX Elbrus Advisory FIC Incentivado FIF em Infra RF RL', percentual: '5%', liquidez: '31 dias' },
        { classe: 'RF - Prefixada', exemplo: 'Títulos RF PRÉ', percentual: '9%', liquidez: '-' },
        { classe: 'Multimercado', exemplo: 'Vinland Incentivado Investimento Debêntures Infraestr RF CP', percentual: '2.5%', liquidez: '31 dias' },
        { classe: 'Multimercado', exemplo: 'Absolute Vertex Advisory FIC FIM', percentual: '2.5%', liquidez: '45 dias' },
        { classe: 'Multimercado', exemplo: 'Quantitas FIC FIM Mallorca', percentual: '2%', liquidez: '15 dias' },
        { classe: 'Renda Variável', exemplo: 'Real Investor FIC de FIF em Ações RL', percentual: '3%', liquidez: '29 dias' },
        { classe: 'Renda Variável', exemplo: 'Mesa RV Alta Vista', percentual: '3%', liquidez: '-' },
        { classe: 'Internacional', exemplo: 'WHG Global Long Biased BRL FIC FIA IE', percentual: '5%', liquidez: '30 dias' },
        { classe: 'Internacional', exemplo: 'Gama Pearl Diver Global Floating Income BRL FIC FIM IE RL', percentual: '5%', liquidez: '-' },
        { classe: 'Imobiliário', exemplo: 'CARTEIRA DE FII', percentual: '2%', liquidez: '2 dias' },
        { classe: 'Alternativo', exemplo: 'INVESTIMENTOS ALTERNATIVOS', percentual: '2%', liquidez: '-' }
      ],
      4: [ // ARROJADO
        { classe: 'RF - Pós-fixada', exemplo: 'Capitânia Yield 120 CP FIC FIM CP', percentual: '5%', liquidez: '120 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'Jive BossaNova High Yield Advisory FIC FIDC', percentual: '5%', liquidez: '362 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'ARX Fuji FIC de FIF RF CP RL', percentual: '16%', liquidez: '1 dia' },
        { classe: 'RF - Inflação', exemplo: 'Títulos RF IPCA', percentual: '16%', liquidez: '-' },
        { classe: 'RF - Inflação', exemplo: 'ARX Elbrus Advisory FIC Incentivado FIF em Infra RF RL', percentual: '8%', liquidez: '31 dias' },
        { classe: 'RF - Prefixada', exemplo: 'Títulos RF PRÉ', percentual: '11%', liquidez: '-' },
        { classe: 'Multimercado', exemplo: 'Vinland Incentivado Investimento Debêntures Infraestr RF CP', percentual: '4%', liquidez: '31 dias' },
        { classe: 'Multimercado', exemplo: 'Absolute Vertex Advisory FIC FIM', percentual: '3%', liquidez: '45 dias' },
        { classe: 'Multimercado', exemplo: 'Quantitas FIC FIM Mallorca', percentual: '3%', liquidez: '15 dias' },
        { classe: 'Renda Variável', exemplo: 'Real Investor FIC de FIF em Ações RL', percentual: '4.5%', liquidez: '29 dias' },
        { classe: 'Renda Variável', exemplo: 'Mesa RV Alta Vista', percentual: '4.5%', liquidez: '-' },
        { classe: 'Internacional', exemplo: 'WHG Global Long Biased BRL FIC FIA IE', percentual: '7%', liquidez: '30 dias' },
        { classe: 'Internacional', exemplo: 'Gama Pearl Diver Global Floating Income BRL FIC FIM IE RL', percentual: '7%', liquidez: '-' },
        { classe: 'Imobiliário', exemplo: 'CARTEIRA DE FII', percentual: '3%', liquidez: '2 dias' },
        { classe: 'Alternativo', exemplo: 'INVESTIMENTOS ALTERNATIVOS', percentual: '3%', liquidez: '-' }
      ],
      5: [ // AGRESSIVO
        { classe: 'RF - Pós-fixada', exemplo: 'Capitânia Yield 120 CP FIC FIM CP', percentual: '4%', liquidez: '120 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'Jive BossaNova High Yield Advisory FIC FIDC', percentual: '4%', liquidez: '362 dias' },
        { classe: 'RF - Pós-fixada', exemplo: 'ARX Fuji FIC de FIF RF CP RL', percentual: '3%', liquidez: '1 dia' },
        { classe: 'RF - Inflação', exemplo: 'Títulos RF IPCA', percentual: '14%', liquidez: '-' },
        { classe: 'RF - Inflação', exemplo: 'ARX Elbrus Advisory FIC Incentivado FIF em Infra RF RL', percentual: '12%', liquidez: '31 dias' },
        { classe: 'RF - Prefixada', exemplo: 'Títulos RF PRÉ', percentual: '12%', liquidez: '-' },
        { classe: 'Multimercado', exemplo: 'Vinland Incentivado Investimento Debêntures Infraestr RF CP', percentual: '4%', liquidez: '31 dias' },
        { classe: 'Multimercado', exemplo: 'Absolute Vertex Advisory FIC FIM', percentual: '4%', liquidez: '45 dias' },
        { classe: 'Multimercado', exemplo: 'Quantitas FIC FIM Mallorca', percentual: '3%', liquidez: '15 dias' },
        { classe: 'Renda Variável', exemplo: 'Real Investor FIC de FIF em Ações RL', percentual: '10%', liquidez: '29 dias' },
        { classe: 'Renda Variável', exemplo: 'Mesa RV Alta Vista', percentual: '4%', liquidez: '-' },
        { classe: 'Internacional', exemplo: 'WHG Global Long Biased BRL FIC FIA IE', percentual: '9%', liquidez: '30 dias' },
        { classe: 'Internacional', exemplo: 'Gama Pearl Diver Global Floating Income BRL FIC FIM IE RL', percentual: '9%', liquidez: '-' },
        { classe: 'Imobiliário', exemplo: 'CARTEIRA DE FII', percentual: '4%', liquidez: '2 dias' },
        { classe: 'Alternativo', exemplo: 'INVESTIMENTOS ALTERNATIVOS', percentual: '4%', liquidez: '-' }
      ]
    };
    
    return perfis[perfil as keyof typeof perfis] || perfis[5]; // Default para Agressivo
  };

  // Mapper: JSON modelo -> props de AllocationDiagnosis
  const mapModelToAllocationProps = (model: any, investorType: string = 'qualified', portfolioType: string = 'regular', carteiraType: 'fee-based' | 'commission-based' = 'fee-based') => {
    const totalPatrimonio: number = model?.cliente?.patrimonio_total || 0;

    const normalizeClasse = (classeAv?: string, subclasseAv?: string) => {
      if (!classeAv) return 'Outros';
      const classe = classeAv.replace(/\s+/g, ' ').trim().toLowerCase();
      if (classe.includes('pós') || classe.includes('pos')) return 'Renda Fixa - Pós-fixado';
      if (classe.includes('prefixada') || classe.includes('pré') || classe.includes('pre')) return 'Renda Fixa - Pré-fixado';
      if (classe.includes('inflação') || classe.includes('inflacao') || classe.includes('ipca')) return 'Renda Fixa - IPCA';
      if (classe.includes('multimercado')) return 'Multimercado';
      if (classe.includes('variável') || classe.includes('variavel')) return 'Renda Variável - Brasil';
      if (classe.includes('internacional')) return 'Internacional';
      if (classe.includes('fii') || classe.includes('imobiliário') || classe.includes('imobiliario')) return 'Fundo Imobiliário';
      if (classe.includes('alternativo')) return 'Alternativo';
      if (classe.includes('criptomoedas') || classe.includes('cripto')) return 'Criptomoedas';
      if (classe.includes('moedas')) return 'Moedas';
      if (classe.includes('derivativos')) return 'Derivativos';
      if (classe.includes('caixa')) return 'Caixa';
      return 'Outros';
    };

    const produtos = model?.posicao_atual?.produtos || [];
    const ativos = produtos.map((p: any) => ({
      nome: p.nome_original,
      classe: normalizeClasse(p.classe_av, p.subclasse_av),
      valor: p.valor,
      obs: p.reclassificacao,
    }));

    // Consolidação (será recalculada depois de definir patrimônio nacional)
    const consolidacao = model?.posicao_atual?.consolidacao || {};
    const mapConsolKey = (k: string) => {
      if (k.toLowerCase().includes('pós') || k.toLowerCase().includes('pos')) return 'RF - Pós-fixada';
      if (k.toLowerCase().includes('prefixada') || k.toLowerCase().includes('pré') || k.toLowerCase().includes('pre') || k.toLowerCase() === 'rf - prefixada') return 'RF - Prefixada';
      if (k.toLowerCase().includes('inflação') || k.toLowerCase().includes('inflacao') || k.toLowerCase().includes('ipca')) return 'RF - Inflação';
      if (k.toLowerCase().includes('multimercado')) return 'Multimercado';
      if (k.toLowerCase().includes('renda variável') || k.toLowerCase().includes('renda variavel')) return 'Renda Variável';
      if (k.toLowerCase().includes('internacional')) return 'Internacional';
      if (k.toLowerCase().includes('imobiliário') || k.toLowerCase().includes('imobiliario') || k.toLowerCase().includes('fii')) return 'Imobiliário';
      if (k.toLowerCase().includes('alternativo')) return 'Alternativo';
      if (k.toLowerCase().includes('moedas')) return 'Moedas';
      if (k.toLowerCase().includes('derivativos')) return 'Derivativos';
      if (k.toLowerCase().includes('caixa')) return 'Caixa';
      return 'Outros';
    };
    // Calcular total da consolidação para calcular percentuais
    const totalConsolidacao = Object.values(consolidacao).reduce((sum: number, v: any) => sum + Number(v?.valor || 0), 0) as number;
    
    const consolidadoTemp = Object.entries(consolidacao).map(([k, v]: any) => {
      const valor = Number(v?.valor || 0);
      const percentual = (totalConsolidacao as number) > 0 ? (valor / (totalConsolidacao as number)) * 100 : 0;
      return {
        classe: mapConsolKey(k),
        valor: valor,
        percentual: `${percentual.toFixed(1)}%`,
      };
    });

    // Liquidez (aproximação por faixas a partir de percentual até 1 dia)
    // Nota: A liquidez é calculada sobre a carteira nacional (excluindo internacional)
    const pctAte1d: number = Number(model?.liquidez?.percentual_ate_1d ?? 0);
    const valorAte1d = totalPatrimonio * (pctAte1d / 100);
    const restante = Math.max(0, totalPatrimonio - valorAte1d);
    const liquidez = [
      { faixa: 'D+0', valor: 0, percentual: '0%' },
      { faixa: 'D+1-4', valor: valorAte1d, percentual: `${pctAte1d}%` },
      { faixa: 'D+5-30', valor: 0, percentual: '0%' },
      { faixa: 'D+31-60', valor: 0, percentual: '0%' },
      { faixa: '>D+60', valor: restante, percentual: `${restante > 0 ? ((restante / Math.max(1, totalPatrimonio)) * 100).toFixed(2) : '0'}%` },
    ];

    // Internacional
    const pctIntl: number = Number(model?.investimento_internacional?.percentual_sobre_patrimonio ?? 0);
    const valorIntl: number = Number(model?.investimento_internacional?.valor_brl_aprox ?? 0);
    const internacional = {
      valor: valorIntl > 0 ? valorIntl : (totalPatrimonio * (pctIntl / 100)),
      percentual: `${pctIntl.toFixed(1)}%`,
      recomendado: model?.carteira_modelo_referencia?.classes?.['Internacional'] ? `${model.carteira_modelo_referencia.classes['Internacional']}%` : '15-20%'
    };

    // Patrimônio da Carteira Brasileira = Total - Conta Internacional
    const patrimonioCarteiraBrasil = Math.max(0, totalPatrimonio - internacional.valor);

    // Usar os percentuais exatos do JSON da consolidação
    const consolidado = consolidadoTemp;

    // Função para arredondar percentuais quando o total estiver próximo de 100%
    const ajustarPercentuaisPara100 = (items: any[]) => {
      const totalAtual = items.reduce((sum, item) => sum + parseFloat(item.percentual), 0);
      
      console.log('Total atual antes do ajuste:', totalAtual);
      
      // Se o total estiver entre 99.0% e 101.0%, ajustar para 100%
      if (totalAtual >= 99.0 && totalAtual <= 101.0) {
        const fatorAjuste = 100 / totalAtual;
        console.log('Fator de ajuste:', fatorAjuste);
        
        const ajustados = items.map(item => ({
          ...item,
          percentual: `${(parseFloat(item.percentual) * fatorAjuste).toFixed(1)}%`
        }));
        
        const novoTotal = ajustados.reduce((sum, item) => sum + parseFloat(item.percentual), 0);
        console.log('Total após ajuste:', novoTotal);
        
        return ajustados;
      }
      
      return items;
    };

    // Aplicar ajuste de arredondamento
    const consolidadoAjustado = ajustarPercentuaisPara100(consolidado);

    // Criar consolidação completa com todas as classes na ordem especificada
    const ordemClasses = [
      'RF - Pós-fixado',
      'RF - Pré-fixado', 
      'RF - IPCA',
      'Multimercado',
      'Renda Variável - Brasil',
      'Fundo Imobiliário',
      'Internacional',
      'Alternativo',
      'Criptomoedas'
    ];

    // Mapear nomes das classes para os nomes usados na consolidação
    const mapearClasseParaConsolidacao = (classe: string) => {
      if (classe === 'RF - Pós-fixado') return 'RF - Pós-fixada';
      if (classe === 'RF - Pré-fixado') return 'RF - Prefixada';
      if (classe === 'RF - IPCA') return 'RF - Inflação';
      if (classe === 'Renda Variável - Brasil') return 'Renda Variável';
      if (classe === 'Fundo Imobiliário') return 'Imobiliário';
      return classe;
    };

    // Criar consolidação baseada nos produtos individuais (mesmo que o item 3)
    const consolidacaoPorClasse: { [key: string]: number } = {};
    produtos.forEach((produto: any) => {
      const classe = normalizeClasse(produto.classe_av, produto.subclasse_av);
      const valor = Number(produto.valor || 0);
      if (consolidacaoPorClasse[classe]) {
        consolidacaoPorClasse[classe] += valor;
      } else {
        consolidacaoPorClasse[classe] = valor;
      }
    });

    const totalPatrimonioConsolidacao = Object.values(consolidacaoPorClasse).reduce((sum: number, valor: number) => sum + valor, 0);

    // Criar consolidação baseada apenas nas classes presentes nos produtos (mesmo que item 3)
    const consolidadoCompleto = Object.entries(consolidacaoPorClasse)
      .filter(([classe, valor]) => valor > 0) // Apenas classes com valor > 0
      .map(([classe, valor]) => {
        const percentual = totalPatrimonioConsolidacao > 0 ? (valor / totalPatrimonioConsolidacao) * 100 : 0;
        return {
          classe: classe,
          valor: valor,
          percentual: `${percentual.toFixed(1)}%`
        };
      })
      .sort((a, b) => b.valor - a.valor); // Ordenar por valor decrescente

    // Comparativo: usar divergências e modelo de referência
    const diverg = model?.divergencias_vs_modelo || {};

    const buildSituacao = (status?: string, atual?: number, ideal?: number) => {
      if (status === 'Sobrealocado') return `⚠️ Acima do ideal`;
      if (status === 'Subalocado') return `❌ Abaixo do ideal`;
      if (Number(atual ?? 0) === 0 && Number(ideal ?? 0) > 0) return '❌ Ausente';
      return '✅ Em linha';
    };

    // Calcular RV Brasil atual a partir de produtos sem flag internacional
    const totalRVValor = produtos
      .filter((p: any) => (p.classe_av || '').toLowerCase().includes('renda'))
      .reduce((s: number, p: any) => s + Number(p.valor || 0), 0);
    const totalRVIntlValor = produtos
      .filter((p: any) => (p.classe_av || '').toLowerCase().includes('renda') && p.internacional)
      .reduce((s: number, p: any) => s + Number(p.valor || 0), 0);
    // RV Brasil calculado sobre carteira brasileira
    const rvBrasilPct = patrimonioCarteiraBrasil > 0 ? ((Math.max(0, totalRVValor - totalRVIntlValor) / patrimonioCarteiraBrasil) * 100) : 0;

    // Calcular Internacional da carteira brasileira (ex: TSLA34)
    const intlCarteiraBrasilValor = produtos
      .filter((p: any) => (p.classe_av || '').toLowerCase().includes('internacional'))
      .reduce((s: number, p: any) => s + Number(p.valor || 0), 0);
    const intlCarteiraBrasilPct = patrimonioCarteiraBrasil > 0 ? ((intlCarteiraBrasilValor / patrimonioCarteiraBrasil) * 100) : 0;

    // Função para obter percentual ajustado da consolidação
    const getPercentualAjustado = (classe: string) => {
      const item = consolidadoAjustado.find(item => item.classe === classe);
      return item ? parseFloat(item.percentual) : 0;
    };

    // Calcular RF Pré-Fixado atual a partir da consolidação
    const rfPrefixadaPct = getPercentualAjustado('RF - Prefixada');
    const rfPosPct = getPercentualAjustado('RF - Pós-fixada');
    const rfInflacaoPct = getPercentualAjustado('RF - Inflação');
    const multimercadoPct = getPercentualAjustado('Multimercado');
    const alternativoPct = getPercentualAjustado('Alternativo');

    // Obter alocações ideais baseadas no perfil
    const perfilCliente = Number(model?.cliente?.perfil_av ?? 5);
    const alocacoesIdeais = getAlocacoesIdeaisByPerfil(perfilCliente);

    // Criar comparativo com apenas as classes atuais do sistema
    const classesAtuais = [
      'RF - Pós-fixado',
      'RF - IPCA', 
      'RF - Pré-fixado',
      'Renda Variável - Brasil',
      'Fundo Imobiliário',
      'Multimercado',
      'Internacional',
      'Alternativo',
      'Criptomoedas',
      'Caixa'
    ];
    
    const comparativo = Object.entries(alocacoesIdeais)
      .filter(([classeAlocacao, percentualIdeal]) => classesAtuais.includes(classeAlocacao))
      .map(([classeAlocacao, percentualIdeal]) => {
        // Mapear classe da alocação ideal para o nome usado na consolidação
        const classeConsolidacao = (() => {
          if (classeAlocacao === 'RF - Pós-fixado') return 'Renda Fixa - Pós-fixado';
          if (classeAlocacao === 'RF - IPCA') return 'Renda Fixa - IPCA';
          if (classeAlocacao === 'RF - Pré-fixado') return 'Renda Fixa - Pré-fixado';
          if (classeAlocacao === 'Renda Variável - Brasil') return 'Renda Variável - Brasil';
          if (classeAlocacao === 'Fundo Imobiliário') return 'Fundo Imobiliário';
          if (classeAlocacao === 'Criptomoedas') return 'Criptomoedas';
          if (classeAlocacao === 'Caixa') return 'Caixa';
          return classeAlocacao;
        })();

        // Mapear nomes das classes para exibição padronizada
        const classePadronizada = (() => {
          if (classeAlocacao === 'RF - Pós-fixado') return 'Renda Fixa - Pós-fixado';
          if (classeAlocacao === 'RF - IPCA') return 'Renda Fixa - IPCA';
          if (classeAlocacao === 'RF - Pré-fixado') return 'Renda Fixa - Pré-fixado';
          if (classeAlocacao === 'Renda Variável - Brasil') return 'Renda Variável - Brasil';
          if (classeAlocacao === 'Fundo Imobiliário') return 'Fundo Imobiliário';
          if (classeAlocacao === 'Internacional') return 'Internacional';
          if (classeAlocacao === 'Alternativo') return 'Alternativo';
          if (classeAlocacao === 'Criptomoedas') return 'Criptomoedas';
          return classeAlocacao;
        })();

        // Obter valor atual da consolidação (0 se não existir)
        const valorAtual = consolidacaoPorClasse[classeConsolidacao] || 0;
        const percentualAtual = totalPatrimonioConsolidacao > 0 ? (valorAtual / totalPatrimonioConsolidacao) * 100 : 0;

        return {
          classe: classePadronizada,
          atual: `${percentualAtual.toFixed(1)}%`,
          ideal: `${percentualIdeal}%`,
          situacao: buildSituacao(
            percentualAtual > percentualIdeal ? 'Sobrealocado' : 
            percentualAtual < percentualIdeal ? 'Subalocado' : 'Em linha',
            percentualAtual,
            percentualIdeal
          )
        };
      })
      .sort((a, b) => parseFloat(b.ideal) - parseFloat(a.ideal)); // Ordenar por percentual ideal decrescente

    // Recomendações
    const recs: Array<{ acao: string; justificativa: string }> = [];
    (model?.recomendacoes?.reduzir || []).forEach((c: string) => {
      const ideal = alocacoesIdeais[c] ?? 0;
      recs.push({ acao: `Reduzir ${c}`, justificativa: `Ajustar para o ideal (${ideal}%).` });
    });
    (model?.recomendacoes?.aumentar || []).forEach((c: string) => {
      const ideal = alocacoesIdeais[c] ?? 0;
      recs.push({ acao: `Aumentar ${c}`, justificativa: `Aproximar do ideal (${ideal}%).` });
    });
    (model?.recomendacoes?.observacoes || []).forEach((o: string) => {
      recs.push({ acao: `Observação`, justificativa: o });
    });

    // Modelos ideais para ambos os tipos de carteira
    const modeloIdealFeeBased = getCarteiraFeeBased(perfilCliente);
    const modeloIdealCommissionBased = getCarteiraCommissionBased(perfilCliente);

    return {
      identificacao: {
        nome: model?.cliente?.nome || `Cliente ${model?.cliente?.codigo_xp || 'XP'}`,
        tipo: model?.cliente?.tipo === 'Pessoa Jurídica' ? 'PJ' : 'PF',
        perfil: Number(model?.cliente?.perfil_av ?? 0),
        pdf: Boolean(model?.cliente?.arquivo_posicao),
        codigoXP: model?.cliente?.codigo_xp || model?.cliente?.codigoXP || model?.cliente?.codigo || '',
        assessor: model?.cliente?.assessor || '',
        email: model?.cliente?.email || '',
        qualificacao: model?.cliente?.qualificacao_investidor || '',
        suitability: model?.cliente?.suitability || '',
        instituicao: model?.meta?.instituicao || '',
        dataAnalise: model?.meta?.data_analise || '',
        perfilModelo: model?.meta?.perfil_modelo || ''
      },
      patrimonioTotal: totalPatrimonio,
      patrimonioCarteiraBrasil: patrimonioCarteiraBrasil, // Patrimônio da carteira brasileira (sem conta internacional)
      ativos,
        consolidado: consolidadoCompleto,
      liquidez,
      liquidezInfo: {
        prazoMedio: model?.liquidez?.prazo_medio || '',
        classificacao: model?.liquidez?.classificacao || ''
      },
      internacional: {
        ...internacional,
        hedge: {
          naoHedgeado: Number(model?.investimento_internacional?.cambial_nao_hedgeada ?? 0),
          hedgeado: Number(model?.investimento_internacional?.cambial_hedgeada ?? 0)
        }
      },
      comparativo,
      recomendacoes: recs,
      modeloIdealFeeBased,
      modeloIdealCommissionBased,
      macro: {
        brasil: '📈 O Ibovespa subiu +4,2% em reais e +5,6% em dólares, superando os 145 mil pontos, enquanto o dólar recuou -2,0%. Destaques positivos: ELET3 +16,7%, MGLU3 +15,9%, COGN3 +14,4%. Maiores quedas: BRKM5 -27,8%, VAMO3 -17,9%, RAIZ4 -17,7%.',
        mundo: 'O mês foi marcado pelo corte de juros do Federal Reserve, o primeiro desde 2023, dando fôlego aos ativos de risco e ampliando o apetite global. Apesar das pressões fiscais no Brasil, o país brilhou com forte entrada de capital estrangeiro e renovação de recordes na bolsa.',
        implicacoes: 'O corte de juros do Fed e a entrada de capital estrangeiro no Brasil criam ambiente favorável para ativos de risco. Oportunidade de maior exposição em renda variável e internacional, mantendo seletividade em crédito privado.'
      }
    };
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('sessionId');

        if (sessionId) {
          const apiUrl = import.meta.env.VITE_API_THE_WAY;
          const response = await axios.get(`${apiUrl}/data-extract/${sessionId}`);
          setUser(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        }
      }
    };
    fetchUserData();
  }, []);

  // Monitorar mudanças na URL e limpar estados
  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('sessionId');
      
      if (sessionId !== currentSessionId) {
        setCurrentSessionId(sessionId);
        // Limpar todos os estados quando sessionId mudar
        setUserReports(null);
        setUser(null);
        setIsLoading(true);
        
        // Forçar limpeza do cache e recarregar a página
        if (currentSessionId !== null) {
          window.location.reload();
        }
      }
    };

    // Executar imediatamente
    handleUrlChange();

    // Adicionar listener para mudanças na URL
    window.addEventListener('popstate', handleUrlChange);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [currentSessionId]);

  useEffect(() => {
    const fetchUserReportsData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('sessionId');

        console.log('=== FETCHING WALLET REPORTS ===');
        console.log('SessionId from URL:', sessionId);
        console.log('Current SessionId state:', currentSessionId);

        if (sessionId) {
          const apiUrl = import.meta.env.VITE_API_THE_WAY;
          const requestUrl = `${apiUrl}/wallet-reports/${sessionId}`;
          console.log('Request URL:', requestUrl);
          
          const response = await axios.get(requestUrl);
          console.log('Response data:', response.data);
          console.log('Response data type:', typeof response.data);
          console.log('Response data[0]:', response.data[0]);

          // Verificar se os dados existem antes de fazer parse
          if (response.data && response.data[0]) {
            const rawData = response.data[0].wallet_data || response.data[0].report_data;
            console.log('Raw data:', rawData);
            console.log('Raw data type:', typeof rawData);
            
            if (rawData) {
              const reportData = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
              console.log('Parsed report data:', reportData);
              console.log('Cliente name:', reportData?.cliente?.nome);
              
              setUserReports(reportData);
            } else {
              console.error('No wallet_data or report_data found in response');
              setUserReports(null);
            }
          } else {
            console.error('Invalid response structure');
            setUserReports(null);
          }
        }
      } catch (error) {
        console.error('Error fetching wallet reports data:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
        }
        // Não definir dados mock - deixar null para mostrar que não há dados
        setUserReports(null);
      }
    };
    fetchUserReportsData();
  }, [currentSessionId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <CardVisibilityProvider>
        <SectionVisibilityProvider>
          <div className="relative h-screen overflow-hidden">
            <div className="no-print">
              <Header />
            </div>
            <main className="h-[calc(100vh-64px)] overflow-y-auto" id="main-report">
              <div className="min-h-screen">
                <CoverPage clientData={getClientData().cliente} />
              </div>
              
              <HideableSection sectionId="analise-carteira" hideControls={clientPropect}>
                {(() => {
                  const mapped = (userReports && (userReports as any)?.posicao_atual) ? mapModelToAllocationProps(userReports) : null;
                  
                  // Se não há dados, não renderizar o componente
                  if (!mapped) {
                    return (
                      <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center p-8">
                          <h3 className="text-2xl font-semibold mb-4">Nenhum dado disponível</h3>
                          <p className="text-muted-foreground">Por favor, carregue um relatório válido.</p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <AllocationDiagnosis
                      identificacao={mapped.identificacao}
                      patrimonioTotal={mapped.patrimonioTotal}
                      patrimonioCarteiraBrasil={mapped.patrimonioCarteiraBrasil}
                      ativos={mapped.ativos}
                      consolidado={mapped.consolidado}
                      liquidez={mapped.liquidez}
                      internacional={mapped.internacional}
                      comparativo={mapped.comparativo}
                      modeloIdealFeeBased={mapped.modeloIdealFeeBased}
                      modeloIdealCommissionBased={mapped.modeloIdealCommissionBased}
                      macro={mapped.macro}
                    />
                  );
                })()}
              </HideableSection>

              {/* Seção de Geração de PDF */}
              <div className="py-20 px-6 no-print">
                <div className="max-w-7xl mx-auto space-y-10">
                  <div className="bg-white rounded-lg shadow-sm border p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-semibold mb-2 text-primary">Gerar Relatório em PDF</h2>
                      <p className="text-muted-foreground">
                        Baixe o relatório completo em formato PDF para análise offline ou compartilhamento.
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <PDFGeneratorButton
                        elementId="main-report"
                        filename={`relatorio-alocacao-${userReports?.cliente?.codigo_xp || 'cliente'}.pdf`}
                        variant="default"
                        size="lg"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </main>
            <div className="no-print">
              <FloatingActions userReports={userReports} />
            </div>
          </div>
        </SectionVisibilityProvider>
      </CardVisibilityProvider>
    </ThemeProvider>
  );
};

export default IndexPage;