import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { CardVisibilityProvider } from '@/context/CardVisibilityContext';
import { SectionVisibilityProvider } from '@/context/SectionVisibilityContext';
import Header from '@/components/layout/Header';
import CoverPage from '@/components/sections/CoverPage';
import AllocationDiagnosis from '@/components/sections/AllocationDiagnosis';
import FloatingActions from '@/components/layout/FloatingActions';
import { DotNavigation, MobileDotNavigation } from '@/components/layout/DotNavigation';
import { useSectionObserver } from '@/hooks/useSectionObserver';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import SectionVisibilityControls from '@/components/layout/SectionVisibilityControls';
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
      nome: userReports?.cliente?.nome || 'Teste',
      idade: userReports?.cliente?.idade || 0,
      codigoXP: userReports?.cliente?.codigo_xp || "405703"
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

  // Mapper: JSON modelo -> props de AllocationDiagnosis
  const mapModelToAllocationProps = (model: any) => {
    const totalPatrimonio: number = model?.cliente?.patrimonio_total || 0;

    const normalizeClasse = (classeAv?: string, subclasseAv?: string) => {
      if (!classeAv) return 'Outros';
      const classe = classeAv.replace(/\s+/g, ' ').trim().toLowerCase();
      if (classe.includes('pós') || classe.includes('pos')) return 'RF - Pós-fixada';
      if (classe.includes('prefixada') || classe.includes('pré') || classe.includes('pre')) return 'RF - Prefixada';
      if (classe.includes('inflação') || classe.includes('inflacao')) return 'RF - Inflação';
      if (classe.includes('multimercado')) return 'Multimercado';
      if (classe.includes('variável') || classe.includes('variavel')) return 'Renda Variável';
      if (classe.includes('internacional')) return 'Internacional';
      if (classe.includes('fii') || classe.includes('imobiliário') || classe.includes('imobiliario')) return 'Imobiliário';
      if (classe.includes('alternativo')) return 'Alternativo';
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

    // Consolidação
    const consolidacao = model?.posicao_atual?.consolidacao || {};
    const mapConsolKey = (k: string) => {
      if (k.toLowerCase().includes('pós') || k.toLowerCase().includes('pos')) return 'RF - Pós-fixada';
      if (k.toLowerCase().includes('prefixada') || k.toLowerCase().includes('pré') || k.toLowerCase().includes('pre')) return 'RF - Prefixada';
      if (k.toLowerCase().includes('inflação') || k.toLowerCase().includes('inflacao')) return 'RF - Inflação';
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
    const consolidado = Object.entries(consolidacao).map(([k, v]: any) => ({
      classe: mapConsolKey(k),
      valor: Number(v?.valor || 0),
      percentual: `${Number(v?.percentual || 0).toFixed(1)}%`,
    }));

    // Liquidez (aproximação por faixas a partir de percentual até 1 dia)
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
    const pctIntl: number = Number(model?.exposicao_internacional?.percentual_internacional ?? 0);
    const internacional = {
      valor: totalPatrimonio * (pctIntl / 100),
      percentual: `${pctIntl}%`,
      recomendado: model?.carteira_modelo_referencia?.classes?.['Internacional'] ? `${model.carteira_modelo_referencia.classes['Internacional']}%` : '15-20%'
    };

    // Comparativo: usar divergências e modelo de referência
    const diverg = model?.divergencias_vs_modelo || {};
    const modeloClasses = model?.carteira_modelo_referencia?.classes || {};

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
    const rvBrasilPct = totalPatrimonio > 0 ? ((Math.max(0, totalRVValor - totalRVIntlValor) / totalPatrimonio) * 100) : 0;

    const comparativo = [
      {
        classe: 'RF Pós-Fixado',
        atual: `${diverg?.rf_pos?.atual ?? 0}%`,
        ideal: `${modeloClasses['RF - Pós-fixada'] ?? modeloClasses['Pós-fixado'] ?? 0}%`,
        situacao: buildSituacao(diverg?.rf_pos?.status, diverg?.rf_pos?.atual, modeloClasses['RF - Pós-fixada'] ?? modeloClasses['Pós-fixado'])
      },
      {
        classe: 'RF Inflação',
        atual: `${diverg?.rf_inflacao?.atual ?? 0}%`,
        ideal: `${modeloClasses['RF - Inflação'] ?? modeloClasses['IPCA'] ?? 0}%`,
        situacao: buildSituacao(diverg?.rf_inflacao?.status, diverg?.rf_inflacao?.atual, modeloClasses['RF - Inflação'] ?? modeloClasses['IPCA'])
      },
      {
        classe: 'RF Pré-Fixado',
        atual: `${diverg?.rf_pre?.atual ?? 0}%`,
        ideal: `${modeloClasses['Pré-fixado'] ?? 0}%`,
        situacao: buildSituacao(diverg?.rf_pre?.status, diverg?.rf_pre?.atual, modeloClasses['Pré-fixado'])
      },
      {
        classe: 'Multimercado',
        atual: `${diverg?.multimercado?.atual ?? 0}%`,
        ideal: `${modeloClasses['Multimercado'] ?? 0}%`,
        situacao: buildSituacao(diverg?.multimercado?.status, diverg?.multimercado?.atual, modeloClasses['Multimercado'])
      },
      {
        classe: 'RV Brasil',
        atual: `${rvBrasilPct.toFixed(1)}%`,
        ideal: `${modeloClasses['Renda Variável Brasil'] ?? 0}%`,
        situacao: buildSituacao(rvBrasilPct > (modeloClasses['Renda Variável Brasil'] ?? 0) ? 'Sobrealocado' : rvBrasilPct < (modeloClasses['Renda Variável Brasil'] ?? 0) ? 'Subalocado' : 'Em linha', rvBrasilPct, modeloClasses['Renda Variável Brasil'])
      },
      {
        classe: 'FII',
        atual: `${diverg?.fii?.atual ?? 0}%`,
        ideal: `${modeloClasses['FII'] ?? 0}%`,
        situacao: buildSituacao(diverg?.fii?.status, diverg?.fii?.atual, modeloClasses['FII'])
      },
      {
        classe: 'Internacional',
        atual: `${diverg?.internacional?.atual ?? pctIntl ?? 0}%`,
        ideal: `${modeloClasses['Internacional'] ?? 0}%`,
        situacao: buildSituacao(diverg?.internacional?.status, diverg?.internacional?.atual ?? pctIntl, modeloClasses['Internacional'])
      },
      {
        classe: 'Alternativo',
        atual: `${diverg?.alternativo?.atual ?? 0}%`,
        ideal: `${modeloClasses['Alternativo'] ?? 0}%`,
        situacao: buildSituacao(diverg?.alternativo?.status, diverg?.alternativo?.atual, modeloClasses['Alternativo'])
      }
    ];

    // Recomendações
    const recs: Array<{ acao: string; justificativa: string }> = [];
    (model?.recomendacoes?.reduzir || []).forEach((c: string) => {
      const ideal = modeloClasses[c] ?? 0;
      recs.push({ acao: `Reduzir ${c}`, justificativa: `Ajustar para o ideal (${ideal}%).` });
    });
    (model?.recomendacoes?.aumentar || []).forEach((c: string) => {
      const ideal = modeloClasses[c] ?? 0;
      recs.push({ acao: `Aumentar ${c}`, justificativa: `Aproximar do ideal (${ideal}%).` });
    });
    (model?.recomendacoes?.observacoes || []).forEach((o: string) => {
      recs.push({ acao: `Observação`, justificativa: o });
    });

    // Modelo ideal
    const modeloIdeal = (model?.carteira_recomendada || []).map((item: any) => ({
      classe: item.classe,
      exemplo: item.produto,
      percentual: `${item.percentual}%`,
      liquidez: '-'
    }));

    return {
      identificacao: {
        nome: model?.cliente?.nome || '',
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
      ativos,
      consolidado,
      liquidez,
      liquidezInfo: {
        prazoMedio: model?.liquidez?.prazo_medio || '',
        classificacao: model?.liquidez?.classificacao || ''
      },
      internacional: {
        ...internacional,
        hedge: {
          naoHedgeado: Number(model?.exposicao_internacional?.cambial_nao_hedgeada ?? 0),
          hedgeado: Number(model?.exposicao_internacional?.cambial_hedgeada ?? 0)
        }
      },
      comparativo,
      recomendacoes: recs,
      modeloIdeal,
      macro: {
        brasil: 'Selic projetada em 15% no 1º semestre, inflação 5,7%, PIB 2,3%, risco fiscal crescente, câmbio R$ 5,80/USD.',
        mundo: 'Juros altos em EUA/Europa, China crescendo 5%, dólar em desvalorização, commodities 20% abaixo de 2024.',
        implicacoes: 'Valorização de ativos atrelados ao CDI e inflação. Necessidade de maior exposição internacional e seletividade em crédito privado.'
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
            <Header />
            <main className="h-[calc(100vh-64px)] overflow-y-auto">
              <div className="min-h-screen">
                <CoverPage clientData={getClientData().cliente} />
              </div>
              
              <HideableSection sectionId="analise-carteira" hideControls={clientPropect}>
                {(() => {
                  const mapped = (userReports && (userReports as any)?.posicao_atual) ? mapModelToAllocationProps(userReports) : null;
                  return (
                    <AllocationDiagnosis
                      identificacao={mapped?.identificacao || { tipo: 'PF', perfil: 5, pdf: true }}
                      patrimonioTotal={mapped?.patrimonioTotal || 1415741.57}
                      ativos={mapped?.ativos || [
                        { nome: 'SPARTA MAX ADVISORY FIC DE FIF RF CP LP RL', classe: 'RF Pós-Fixada', valor: 208615.30 },
                        { nome: 'EMPÍRICA LÓTUS FIC FIM CP', classe: 'Multimercado', valor: 134777.51, obs: 'Reclassificado manualmente' },
                        { nome: 'RIZA LOTUS FIF RF - REFERENCIADA DI CP RL', classe: 'RF Pós-Fixada', valor: 118635.72 },
                        { nome: 'ARX DENALI ADVISORY FIC DE FIF RF CP RL', classe: 'RF Pós-Fixada', valor: 91528.92 },
                        { nome: 'TREND DI FIC RF SIMPLES RL', classe: 'RF Pós-Fixada', valor: 70744.86 },
                        { nome: 'ARX FUJI FIC DE FIF RF CP RL', classe: 'RF Pós-Fixada', valor: 13067.69 },
                        { nome: 'CDB WILL FINANCEIRA (MASTER) - MAR/2027', classe: 'RF Pós-Fixada', valor: 4689.20 },
                        { nome: 'SPARTA PREV ADVISORY XP SEG FIC RF CP RL', classe: 'Previdência', valor: 18427.72 },
                        { nome: 'ARX DENALI XP SEG PREV FIC FIRF CP RL', classe: 'Previdência', valor: 80370.32 },
                        { nome: 'XP CORPORATE TOP CP XP SEG PREV FIC FIM RL', classe: 'Previdência', valor: 41712.02 },
                        { nome: 'CDB AGIBANK - AGO/2025', classe: 'RF Inflação', valor: 148911.62 },
                        { nome: 'NTN-B - AGO/2050', classe: 'RF Inflação', valor: 286341.07 },
                        { nome: 'CDB BANCO C6 CONSIGNADO S.A. - JUL/2026', classe: 'RF Inflação', valor: 87081.71 },
                        { nome: 'ARX ELBRUS ADVISORY FIC INCENTIVADO FIF EM INFRA RF RL', classe: 'RF Inflação', valor: 87940.23 },
                        { nome: 'LPSB3', classe: 'Renda Variável Brasil', valor: 1815.00 },
                        { nome: 'XPBR31', classe: 'Internacional', valor: 655.50 },
                        { nome: 'Proventos', classe: 'Outros', valor: 80.11 },
                      ]}
                      consolidado={mapped?.consolidado || [
                        { classe: 'RF Pós-Fixado', valor: 782569.24, percentual: '56.1%' },
                        { classe: 'RF Inflação', valor: 610274.63, percentual: '43.8%' },
                        { classe: 'Multimercado', valor: 134777.51, percentual: '9.7%' },
                        { classe: 'Previdência', valor: 140509.06, percentual: '10.1%' },
                        { classe: 'Renda Variável Brasil', valor: 1815.00, percentual: '0.1%' },
                        { classe: 'Internacional', valor: 655.50, percentual: '0.05%' },
                        { classe: 'Outros', valor: 80.11, percentual: '0.01%' },
                      ]}
                      liquidez={mapped?.liquidez || [
                        { faixa: 'D+0', valor: 84393.20, percentual: '6.05%' },
                        { faixa: 'D+1-4', valor: 112438.41, percentual: '8.06%' },
                        { faixa: 'D+5-30', valor: 154953.95, percentual: '11.10%' },
                        { faixa: 'D+31-60', valor: 129652.25, percentual: '9.29%' },
                        { faixa: '>D+60', valor: 1048956.69, percentual: '75.10%' },
                      ]}
                      internacional={mapped?.internacional || { valor: 655.50, percentual: '0.05%', recomendado: '15-20%' }}
                      comparativo={mapped?.comparativo || [
                        { classe: 'RF Pós-Fixado', atual: '56.1%', ideal: '11%', situacao: '⚠️ Excesso relevante' },
                        { classe: 'RF Inflação', atual: '43.8%', ideal: '26%', situacao: '⚠️ Acima do ideal' },
                        { classe: 'RF Pré-Fixado', atual: '0.0%', ideal: '12%', situacao: '❌ Ausente' },
                        { classe: 'Multimercado', atual: '9.7%', ideal: '11%', situacao: '✅ Próximo ao ideal' },
                        { classe: 'RV Brasil', atual: '0.1%', ideal: '14%', situacao: '❌ Praticamente zerado' },
                        { classe: 'FII', atual: '0.0%', ideal: '4%', situacao: '❌ Ausente' },
                        { classe: 'Internacional', atual: '0.05%', ideal: '18%', situacao: '❌ Muito abaixo' },
                        { classe: 'Alternativo', atual: '0.0%', ideal: '4%', situacao: '❌ Ausente' },
                      ]}
                      modeloIdeal={mapped?.modeloIdeal || [
                        { classe: 'RF - Pós-fixada', exemplo: 'ARX Fuji FIC de FIF RF CP RL', percentual: '5%', liquidez: '-' },
                        { classe: 'RF - Pós-fixada', exemplo: 'Jive BossaNova High Yield Advisory FIC FIDC', percentual: '5%', liquidez: '-' },
                        { classe: 'RF - Pós-fixada', exemplo: 'Capitânia Yield 120 CP FIC FIM CP', percentual: '5%', liquidez: '-' },
                        { classe: 'RF - Inflação', exemplo: 'NTN-B - AGO/205', percentual: '16%', liquidez: '-' },
                        { classe: 'RF - Inflação', exemplo: 'ARX Elbrus Advisory FIC Incentivado FIF em Infra RF RL', percentual: '8%', liquidez: '-' },
                        { classe: 'Pré-fixado', exemplo: 'Títulos RF PRÉ', percentual: '11%', liquidez: '-' },
                        { classe: 'Multimercado', exemplo: 'Vinland Incentivado Investimento Debêntures Infraestr RF CP', percentual: '4%', liquidez: '-' },
                        { classe: 'Multimercado', exemplo: 'Absolute Vertex Advisory FIC FIM', percentual: '3%', liquidez: '-' },
                        { classe: 'Multimercado', exemplo: 'Quantitas FIC FIM Mallorca', percentual: '3%', liquidez: '-' },
                        { classe: 'Renda Variável Brasil', exemplo: 'Real Investor FIC de FIF em Ações RL', percentual: '4.5%', liquidez: '-' },
                        { classe: 'Renda Variável Brasil', exemplo: 'Mesa RV Alta Vista', percentual: '4.5%', liquidez: '-' },
                        { classe: 'Internacional', exemplo: 'WHG Global Long Biased BRL FIC FIA IE', percentual: '7%', liquidez: '-' },
                        { classe: 'Internacional', exemplo: 'Gama Pearl Diver Global Floating Income BRL FIC FIM IE RL', percentual: '7%', liquidez: '-' },
                        { classe: 'FII', exemplo: 'Carteira de FII', percentual: '3%', liquidez: '-' },
                        { classe: 'Alternativo', exemplo: 'Investimentos Alternativos', percentual: '3%', liquidez: '-' },
                      ]}
                      macro={mapped?.macro || {
                        brasil: 'Selic projetada em 15% no 1º semestre, inflação 5,7%, PIB 2,3%, risco fiscal crescente, câmbio R$ 5,80/USD.',
                        mundo: 'Juros altos em EUA/Europa, China crescendo 5%, dólar em desvalorização, commodities 20% abaixo de 2024.',
                        implicacoes: 'Valorização de ativos atrelados ao CDI e inflação. Necessidade de maior exposição internacional e seletividade em crédito privado.'
                      }}
                    />
                  );
                })()}
              </HideableSection>
            </main>
            <DotNavigation />
            <MobileDotNavigation />
            <FloatingActions userReports={userReports} />
            {!clientPropect && <SectionVisibilityControls />}
          </div>
        </SectionVisibilityProvider>
      </CardVisibilityProvider>
    </ThemeProvider>
  );
};

export default IndexPage;