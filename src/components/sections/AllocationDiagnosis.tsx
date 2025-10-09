import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import HideableCard from '@/components/ui/HideableCard';
import StatusChip from '@/components/ui/StatusChip';
import ProgressBar from '@/components/ui/ProgressBar';
import { BarChart3, PieChart, TrendingUp, TrendingDown, Globe, DollarSign, Target, AlertTriangle, CheckCircle, XCircle, BarChart, Activity, Shield } from 'lucide-react';
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
  modeloIdeal: ModeloIdeal[];
  macro: {
    brasil: string;
    mundo: string;
    implicacoes: string;
  };
  hideControls?: boolean;
}

export const AllocationDiagnosis: React.FC<AllocationDiagnosisProps> = ({
  identificacao,
  patrimonioTotal,
  patrimonioCarteiraBrasil,
  ativos,
  consolidado,
  liquidez,
  internacional,
  comparativo,
  modeloIdeal,
  macro,
  hideControls,
}) => {
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

  // Lista completa das classes que devem sempre aparecer
  const todasClasses = [
    'RF - Pós-fixada',
    'RF - Prefixada', 
    'RF - Inflação',
    'Multimercado',
    'Renda Variável',
    'Internacional',
    'Imobiliário',
    'Alternativo',
    'Moedas',
    'Derivativos',
    'Caixa',
    'Outros'
  ];

  // Criar um mapa dos dados consolidados existentes
  const consolidadoMap = new Map(consolidado.map(item => [item.classe, item]));
  
  // Gerar lista com todas as classes, incluindo as que não existem (com valor 0)
  const todasClassesComDados = todasClasses.map(classe => {
    const item = consolidadoMap.get(classe);
    return item || {
      classe,
      valor: 0,
      percentual: '0.0%'
    };
  });

  // Ordenar em ordem decrescente por percentual
  const sortedConsolidado = [...todasClassesComDados].sort((a, b) => parsePercent(b.percentual) - parsePercent(a.percentual));

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
  modeloIdeal.forEach(mi => {
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

  // Totais para o Modelo de Carteira
  const totalPctModelo = modeloIdeal.reduce((s, mi) => s + parsePercent(mi.percentual), 0);
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

        {/* Score Geral (simplificado: apenas Perfil de Risco) */}
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
              <div className="grid md:grid-cols-3 gap-8 print:grid-cols-3 print:gap-4">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-primary print:text-lg print:mb-1">{formatCurrency(getTotalPatrimonio())}</div>
                  <div className="text-sm text-muted-foreground print:text-xs">Patrimônio Total (Nacional + Internacional)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-financial-warning print:text-lg print:mb-1">{identificacao.perfil}/5</div>
                  <div className="text-sm text-muted-foreground print:text-xs">Perfil de Risco</div>
                  <StatusChip 
                    status={identificacao.perfil >= 4 ? "warning" : identificacao.perfil >= 3 ? "info" : "success"} 
                    label={
                      identificacao.perfil === 1 ? "Super Conservador" :
                      identificacao.perfil === 2 ? "Conservador" :
                      identificacao.perfil === 3 ? "Moderado" :
                      identificacao.perfil === 4 ? "Arrojado" :
                      identificacao.perfil === 5 ? "Agressivo" : "N/A"
                    } 
                    className="mt-2 print:mt-1 print:text-xs"
                  />
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2 print:text-lg print:mb-1">{identificacao.tipo}</div>
                  <div className="text-sm text-muted-foreground print:text-xs">Tipo de Investidor</div>
                  {identificacao.tipo === "PJ" && identificacao.pjDetalhe && (
                    <StatusChip status="info" label={identificacao.pjDetalhe} className="mt-2 print:mt-1 print:text-xs" />
                  )}
                </div>
              </div>
              {/* Meta e dados úteis - REMOVIDO */}
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
                  return Object.entries(ativosPorClasse).map(([classe, ativosClasse]) => (
                    <div key={classe} className="space-y-3 print:space-y-1">
                      <h4 className="font-semibold text-base text-primary border-b pb-2 print:text-sm print:pb-1">{classe}</h4>
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
                  ));
                })()}
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
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm md:text-base">
                    <thead>
                      <tr className="border-b bg-secondary/50">
                        <th className="text-left py-3 uppercase tracking-wide text-xs text-muted-foreground">Classe</th>
                        <th className="text-center py-3 uppercase tracking-wide text-xs text-muted-foreground">% Atual</th>
                        <th className="text-center py-3 uppercase tracking-wide text-xs text-muted-foreground">% Ideal</th>
                        <th className="text-center py-3 uppercase tracking-wide text-xs text-muted-foreground">Delta (%)</th>
                        <th className="text-center py-3 uppercase tracking-wide text-xs text-muted-foreground">Situação</th>
                        <th className="text-center py-3 uppercase tracking-wide text-xs text-muted-foreground">Faltam/Excesso (R$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparativo
                        .sort((a, b) => {
                          // Ordenar por % Ideal (decrescente)
                          const idealA = parsePercent(a.ideal);
                          const idealB = parsePercent(b.ideal);
                          return idealB - idealA;
                        })
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
                            {Math.abs(deltaPct) < 0.1 ? (
                              <span className="text-muted-foreground">0%</span>
                            ) : (
                              <span className={deltaPct > 0 ? 'text-green-700 font-medium' : 'text-red-600 font-medium'}>
                                {deltaPct > 0 ? '+' : ''}{deltaPct.toFixed(1)}%
                              </span>
                            )}
                          </td>
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
                          {comparativo.reduce((sum, item) => sum + parsePercent(item.atual), 0).toFixed(1)}%
                        </td>
                        <td className="py-4 text-center font-semibold text-primary">
                          {comparativo.reduce((sum, item) => sum + parsePercent(item.ideal), 0).toFixed(1)}%
                        </td>
                        <td className="py-4 text-center font-semibold text-primary">
                          {(() => {
                            const totalAtual = comparativo.reduce((sum, item) => sum + parsePercent(item.atual), 0);
                            const totalIdeal = comparativo.reduce((sum, item) => sum + parsePercent(item.ideal), 0);
                            const delta = totalIdeal - totalAtual;
                            return delta > 0 ? `+${delta.toFixed(1)}%` : `${delta.toFixed(1)}%`;
                          })()}
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
                    {modeloIdeal.map((item, index) => {
                      const pct = parsePercent(item.percentual);
                      // Modelo ideal calculado sobre patrimônio da carteira brasileira
                      const valor = (patrimonioCarteiraBrasil * pct) / 100;
                      return (
                        <tr key={index} className="border-b border-border/50 hover:bg-secondary/30">
                          <td className="py-4 font-medium">
                            {item.classe}
                            {item.classe.toLowerCase().includes('internacional') && (
                              <span className="text-xs text-muted-foreground ml-1">*</span>
                            )}
                          </td>
                          <td className="py-4 text-sm">{item.exemplo}</td>
                          <td className="py-4 text-center font-semibold">{item.percentual}</td>
                          <td className="py-4 text-center font-semibold text-primary">{formatCurrency(valor)}</td>
                        </tr>
                      );
                    })}
                    {/* Totais */}
                    <tr className="bg-secondary/40">
                      <td className="py-4 font-semibold" colSpan={2}>Total</td>
                      <td className="py-4 text-center font-semibold">{totalPctModelo.toFixed(0)}%</td>
                      <td className="py-4 text-center font-semibold text-primary">{formatCurrency(totalValorAlocado)}</td>
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