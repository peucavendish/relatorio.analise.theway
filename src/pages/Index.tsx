import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import Header from '@/components/layout/Header';
import CoverPage from '@/components/sections/CoverPage';
import FinancialSummary from '@/components/sections/FinancialSummary';
import RetirementPlanning from '@/components/sections/RetirementPlanning';
import BeachHouse from '@/components/sections/BeachHouse';
import TaxPlanning from '@/components/sections/TaxPlanning';
import ProtectionPlanning from '@/components/sections/ProtectionPlanning';
import SuccessionPlanning from '@/components/sections/SuccessionPlanning';
import ActionPlan from '@/components/sections/ActionPlan';
import FloatingActions from '@/components/layout/FloatingActions';
import { DotNavigation, MobileDotNavigation } from '@/components/layout/DotNavigation';
import { useSectionObserver } from '@/hooks/useSectionObserver';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

const IndexPage = () => {
  const { activeSection, navigateToSection } = useSectionObserver();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userReports, setUserReports] = useState(null);

  const getClientData = () => ({
    cliente: {
      nome: userReports?.cliente?.nome || "Nome não disponível",
      idade: userReports?.cliente?.idade || 0,
      estadoCivil: userReports?.cliente?.estadoCivil || "Não informado",
      regimeCasamento: userReports?.cliente?.regimeCasamento || "Não informado",
      residencia: userReports?.cliente?.residencia || "Não informado"
    },
    financas: {
      patrimonioLiquido: userReports?.financas?.resumo?.patrimonio_liquido || 0,
      excedenteMensal: userReports?.financas?.resumo?.excedente_mensal || 0,
      rendas: userReports?.financas?.rendas,
      despesasMensais: userReports?.financas?.resumo?.despesas_mensais || 0,
      composicaoPatrimonial: {
        imoveis: userReports?.financas?.composicao_patrimonial?.Imóveis || 0,
        investimentos: userReports?.financas?.composicao_patrimonial?.Investimentos || 0,
      },
      ativos: [
        ...(userReports?.financas?.ativos?.filter(a => a.tipo === "Imóveis")?.map(a => ({
          tipo: a.tipo,
          valor: a.valor,
          classe: a.classe
        })) || []),
        ...(userReports?.financas?.ativos?.filter(a => a.tipo === "Investimentos")?.map(a => ({
          tipo: a.tipo,
          valor: a.valor,
          classe: a.classe
        })) || []),
        ...(userReports?.financas?.ativos?.filter(a => a.tipo === "Participação em empresa")?.map(a => ({
          tipo: a.tipo,
          valor: a.valor,
          classe: a.classe
        })) || [])
      ],
      passivos: [
        ...(userReports?.financas?.passivos?.map(p => ({
          tipo: p.tipo,
          valor: p.valor
        })) || [])
      ]
    },
    aposentadoria: {
      patrimonioLiquido: userReports?.financas?.resumo?.patrimonio_liquido || 0,
      excedenteMensal: userReports?.financas?.resumo?.excedente_mensal || 0,
      totalInvestido: userReports?.financas?.composicao_patrimonial?.Investimentos || 0,

      rendaMensalDesejada: userReports?.planoAposentadoria?.renda_desejada || 0,
      idadeAposentadoria: userReports?.planoAposentadoria?.idade_aposentadoria || 0,
      patrimonioAlvo: userReports?.planoAposentadoria?.capital_necessario || 0,

      idadeAtual: userReports?.planoAposentadoria?.idade_atual || 0,
      expectativaVida: userReports?.planoAposentadoria?.expectativa_vida || 0,

      cenarios: userReports?.planoAposentadoria?.cenarios?.map(c => ({
        idade: c.idade_aposentadoria,
        aporteMensal: c.aporte_mensal,
        capitalNecessario: c.capital_necessario
      })) || [],

      perfilInvestidor: userReports?.perfil_investidor || "Agressivo",
      alocacaoAtivos: userReports?.alocacao_ativos?.composicao?.map(a => ({
        ativo: a.ativo,
        percentual: a.percentual
      })) || [],

      anosRestantes: (userReports?.planoAposentadoria?.idade_aposentadoria || 0) -
        (userReports?.planoAposentadoria?.idade_atual || 0),
      aporteMensalRecomendado: userReports?.planoAposentadoria?.cenarios?.[0]?.aporte_mensal || 0,

      temPrevidenciaSocial: false,
      valorPrevidenciaSocial: 0,

      possuiPGBL: userReports?.tributario?.deducoes?.some(d => d.tipo === "PGBL") || false,
      valorPGBL: userReports?.tributario?.deducoes?.find(d => d.tipo === "PGBL")?.valor || 0,

      taxaRetiradaSegura: 0.04,
      taxaInflacao: 0.035,
      taxaJurosReal: 0.04
    },
    objetivos: [
      {
        tipo: "Compra de imóvel",
        valor: `R$ ${userReports?.objetivos?.[0]?.valor || 0}`,
        prazo: userReports?.objetivos?.[0]?.prazo || "Não informado",
        prioridade: userReports?.objetivos?.[0]?.prioridade || "Não informada"
      },
      {
        tipo: "Aposentadoria",
        valor: `R$ ${userReports?.planoAposentadoria?.renda_desejada || 0} mensais`,
        prazo: `aos ${userReports?.planoAposentadoria?.idade_aposentadoria || 0} anos`
      },
      { tipo: "Proteção patrimonial e sucessória", prazo: "imediato" },
      { tipo: "Otimização fiscal", prazo: "imediato" }
    ],
    casaPraia: {
      objetivo: {
        valorImovel: 800000,
        prazoDesejado: 5
      },
      comparativoEstrategias: [
        { estrategia: "Consórcio", parcelaMensal: 5000, totalPago: 960000 },
        { estrategia: "Financiamento", parcelaMensal: 6500, totalPago: 1290000 },
        { estrategia: "Reserva Livre", parcelaMensal: 11000, totalPago: 800000 }
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
        objetivo: userReports?.tributario?.resumo?.objetivo || "",
        potencialEconomia: userReports?.tributario?.economiaTributaria?.economia || null,
        prazoImplementacao: userReports?.tributario?.resumo?.prazoImplementacao || null
      },
      estruturacaoPatrimonial: userReports?.tributario?.estruturacaoPatrimonial || [],
      investimentosIsentos: userReports?.tributario?.investimentosIsentos || [],
      deducoes: userReports?.tributario?.deducoes?.map(d => ({
        tipo: d.tipo,
        percentual: d.percentual,
        valor: d.valor,
        beneficio: d.beneficio
      })) || [],
      holdingFamiliar: {
        descricao: userReports?.tributario?.holdingFamiliar?.descricao || "",
        custoConstrucao: userReports?.tributario?.holdingFamiliar?.custoConstrucao || null,
        tempoImplementacao: userReports?.tributario?.holdingFamiliar?.tempoImplementacao || null,
        beneficios: userReports?.tributario?.holdingFamiliar?.beneficios || [],
        recomendacao: userReports?.tributario?.holdingFamiliar?.recomendacao || ""
      },
      previdenciaVGBL: {
        "descricao": "Produto financeiro com vantagens tributárias e sucessórias",
        "valorAtual": 3000001,
        "recomendacaoAdicional": "Aumento de aportes para otimização fiscal",
        "vantagensSucessorias": [
          "Não entra em inventáriddddo (pagamento via beneficiários indicados)",
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
        semPlanejamento: userReports?.tributario?.economiaTributaria?.semPlanejamento?.totalImpostos || null,
        comPlanejamento: userReports?.tributario?.economiaTributaria?.comPlanejamento?.totalImpostos || null,
        economia: userReports?.tributario?.economiaTributaria?.economia || null,
        periodoEstimado: userReports?.tributario?.economiaTributaria?.periodoEstimado || null,
        itensConsiderados: userReports?.tributario?.economiaTributaria?.itensConsiderados || []
      }
    },
    protecao: {
      titulo: "Proteção Patrimonial e Seguros",
      resumo: "Estratégias para proteção do patrimônio e garantia de segurança financeira da família",
      analiseNecessidades: {
        rendaAnual: 420000,
        anosSuporteDependentes: 10,
        patrimonioTotal: 4000000,
        numeroDependentes: 3,
        tiposDependentes: ["Cônjuge", "2 filhos"],
        viagensInternacionais: "40 dias/ano (Europa)",
        atividadeEmpresarial: "Participação de 40% em empresa avaliada em R$ 1.000.000"
      },
      seguroVida: {
        titulo: "Seguro de Vida",
        importancia: "Essencial para proteção financeira da família em caso de falecimento ou invalidez",
        coberturaMinima: 4200000,
        metodologiaCalculo: "10x renda anual para garantir sustento dos dependentes",
        coberturas: [
          { "tipo": "Morte", "percentual": "100% da cobertura contratada" },
          { "tipo": "Invalidez permanente", "percentual": "100% da cobertura contratada" },
          { "tipo": "Doenças graves", "percentual": "50% da cobertura contratada" }
        ],
        custoEstimadoAnual: "0.2% a 0.5% do valor segurado, dependendo da idade e condições de saúde",
        prioridadeImplementacao: "Alta - recomendação de implementação em 30 dias"
      },
      seguroPatrimonial: {
        titulo: "Seguro Patrimonial",
        importancia: "Proteção dos bens materiais contra danos, perdas ou roubos",
        bensImoveis: 2000000,
        adicional: 400000,
        coberturaRecomendada: 2400000,
        riscosProtegidos: [
          "Incêndio",
          "Roubo/furto",
          "Danos elétricos",
          "Responsabilidade civil",
          "Desastres naturais"
        ],
        custoEstimadoAnual: "0.1% a 0.3% do valor segurado",
        prioridadeImplementacao: "Média - recomendação de implementação em 60 dias"
      },
      seguroDO: {
        titulo: "Seguro D&O (Directors & Officers)",
        importancia: "Essencial para proteção contra riscos da atividade empresarial",
        descricao: "Cobertura para processos e responsabilidades decorrentes de atos de gestão",
        coberturaMinima: 1000000,
        justificativa: "Considerando a participação de 40% na empresa avaliada em R$ 1.000.000",
        riscosCobertos: [
          "Processos de terceiros",
          "Reclamações trabalhistas",
          "Custos de defesa",
          "Danos reputacionais"
        ],
        custoEstimadoAnual: "1% a 2% do valor de cobertura",
        prioridadeImplementacao: "Média-alta - recomendação de implementação em 45 dias"
      },
      seguroInternacional: {
        titulo: "Seguro de Viagem Internacional",
        importancia: "Proteção durante viagens ao exterior, especialmente na Europa",
        coberturaMedica: "US$ 100.000",
        coberturaPatrimonial: "US$ 10.000",
        custoEstimadoAnual: "US$ 500-1.000",
        consideracoes: "Necessário devido às frequentes viagens internacionais (40 dias/ano)",
        riscosCobertos: [
          "Despesas médicas e hospitalares",
          "Cancelamento de viagem",
          "Extravio de bagagem",
          "Repatriação"
        ],
        prioridadeImplementacao: "Baixa - contratar antes da próxima viagem internacional"
      },
      protecaoJuridica: {
        titulo: "Proteção Jurídica",
        descricao: "Estruturas legais para proteção patrimonial de longo prazo",
        holdingPatrimonial: {
          titulo: "Holding Familiar",
          custoEstimado: 30000,
          finalidade: "Proteção contra credores, planejamento sucessório e otimização fiscal",
          tempoImplementacao: "60-90 dias",
          vantagensAdicionais: [
            "Centralização dos bens imóveis",
            "Simplificação da administração patrimonial",
            "Redução de custos com sucessão",
            "Possibilidade de planejamento tributário"
          ]
        },
        mandatoDuradouro: {
          titulo: "Mandato Duradouro",
          custoEstimado: 5000,
          finalidade: "Garantia de gestão patrimonial em caso de incapacidade",
          descricao: "Instrumento jurídico que permite a nomeação de representantes para administrar o patrimônio em caso de incapacidade do titular",
          beneficios: [
            "Evita processo judicial de curatela",
            "Mantém a gestão patrimonial conforme desejo do titular",
            "Reduz custos e trâmites burocráticos",
            "Proporciona tranquilidade à família"
          ],
          prioridadeImplementacao: "Média - recomendação de implementação em 60 dias"
        }
      },
      recomendacoesAdicionais: {
        titulo: "Recomendações Adicionais",
        itens: [
          "Revisão anual das coberturas de seguros para adequação à evolução patrimonial",
          "Consulta a especialistas em seguros para personalização das apólices",
          "Avaliação de coberturas específicas para os filhos (educação, seguro infantil)",
          "Implementação de medidas de segurança física para residências (alarmes, monitoramento)"
        ]
      }
    },
    planoAcao: {
      titulo: "Plano de Ação Financeira",
      resumo: "Conjunto de ações estratégicas para alcançar seus objetivos financeiros e patrimoniais",
      indicadorSegurancaFinanceira: {
        titulo: "Indicador de Segurança Financeira",
        descricao: "Medida da solidez e resiliência da sua situação financeira atual",
        valor: 72,
        nivel: "Adequado",
        elementosAvaliados: [
          "Reserva de emergência",
          "Diversificação de ativos",
          "Proteção patrimonial",
          "Fluxo de caixa mensal",
          "Endividamento"
        ]
      },
      cronograma: [
        {
          periodo: "Curto Prazo (1-3 meses)",
          objetivoPrincipal: "Estruturação inicial",
          descricao: "Implementar medidas imediatas para otimizar fluxo financeiro atual",
          acoes: [
            "Revisão do orçamento familiar",
            "Estruturação da reserva de emergência",
            "Contratação de seguros essenciais",
            "Revisão da carteira de investimentos"
          ]
        },
        {
          periodo: "Médio Prazo (4-12 meses)",
          objetivoPrincipal: "Otimização fiscal e proteção",
          descricao: "Implementar estratégias de proteção patrimonial e planejamento tributário",
          acoes: [
            "Constituição da holding familiar",
            "Implementação das estratégias de planejamento tributário",
            "Reestruturação das participações societárias",
            "Início do consórcio para casa de praia"
          ]
        },
        {
          periodo: "Longo Prazo (1-3 anos)",
          objetivoPrincipal: "Acumulação patrimonial",
          descricao: "Foco em crescimento e acumulação patrimonial",
          acoes: [
            "Revisão e ajuste da estratégia de investimentos",
            "Acompanhamento do plano de aposentadoria",
            "Avaliação de novas oportunidades imobiliárias",
            "Revisão do planejamento sucessório"
          ]
        }
      ],
      acoesPrioritarias: [
        {
          titulo: "Holding Familiar",
          descricao: "Constituição de holding patrimonial para proteção de bens e otimização fiscal",
          prioridade: "Alta",
          prazo: "90 dias",
          responsavel: "Advogado societário",
          passos: [
            "Análise da estrutura patrimonial atual",
            "Definição do tipo societário",
            "Elaboração de contrato/estatuto social",
            "Integralização dos bens imóveis"
          ],
          impacto: "Redução de até 50% em impostos sucessórios",
          status: "Não iniciado"
        },
        {
          titulo: "Planejamento Sucessório",
          descricao: "Estruturação de instrumentos jurídicos para proteção sucessória",
          prioridade: "Alta",
          prazo: "120 dias",
          responsavel: "Advogado especialista",
          passos: [
            "Elaboração de testamento",
            "Estruturação de doações em vida",
            "Definição de beneficiários de previdência",
            "Criação de mandato duradouro"
          ],
          impacto: "Segurança jurídica e financeira para a família",
          status: "Não iniciado"
        },
        {
          titulo: "Consórcio Casa de Praia",
          descricao: "Contratação de consórcio para aquisição da casa de praia",
          prioridade: "Média",
          prazo: "30 dias",
          responsavel: "Consultor financeiro",
          passos: [
            "Pesquisa das melhores administradoras",
            "Análise das condições contratuais",
            "Definição do valor da carta",
            "Contratação e início dos pagamentos"
          ],
          impacto: "Aquisição do imóvel em até 5 anos",
          status: "Em progresso"
        },
        {
          titulo: "Diversificação de Investimentos",
          descricao: "Reestruturação da carteira para maior diversificação e proteção",
          prioridade: "Média",
          prazo: "60 dias",
          responsavel: "Consultor de investimentos",
          passos: [
            "Análise da carteira atual",
            "Definição de nova alocação estratégica",
            "Implementação das mudanças",
            "Monitoramento de resultados"
          ],
          impacto: "Redução de volatilidade e potencial aumento de retorno",
          status: "Não iniciado"
        }
      ],
      metasCurtoPrazo: [
        {
          acao: "Constituir reserva de emergência",
          objetivoEspecifico: "Atingir 6 meses de despesas fixas",
          prazo: "90 dias",
          responsavel: "Cliente",
          resultadoEsperado: "Segurança financeira para imprevistos"
        },
        {
          acao: "Contratar seguros essenciais",
          objetivoEspecifico: "Proteção contra riscos prioritários",
          prazo: "45 dias",
          responsavel: "Consultor de seguros",
          resultadoEsperado: "Cobertura adequada para riscos pessoais e patrimoniais"
        },
        {
          acao: "Revisar carteira de investimentos",
          objetivoEspecifico: "Alinhamento com objetivos de curto e longo prazo",
          prazo: "60 dias",
          responsavel: "Consultor de investimentos",
          resultadoEsperado: "Portfólio otimizado para objetivos financeiros"
        },
        {
          acao: "Iniciar consórcio para casa de praia",
          objetivoEspecifico: "Contratar carta de valor adequado",
          prazo: "30 dias",
          responsavel: "Cliente e consultor",
          resultadoEsperado: "Início do plano de aquisição da casa de praia"
        }
      ],
      acompanhamentoProgresso: {
        titulo: "Monitoramento e Acompanhamento",
        frequenciaRevisao: "Trimestral",
        proximaReuniao: "15/04/2023",
        responsavelAcompanhamento: "Consultor financeiro",
        metricasSucesso: [
          "Redução de carga tributária",
          "Aumento de patrimônio líquido",
          "Adequação da proteção patrimonial",
          "Progresso nos objetivos financeiros",
          "Eficiência na gestão de caixa mensal"
        ]
      },
      conclusao: {
        titulo: "Próximos Passos e Conclusão",
        mensagemPrincipal: "Este plano de ação representa um roteiro personalizado para maximizar sua segurança financeira e alcançar seus objetivos patrimoniais.",
        compromissoAssessoria: "Nossa equipe estará disponível para acompanhar cada etapa deste processo, oferecendo suporte contínuo e ajustes conforme necessário.",
        recomendacaoFinal: "Recomendamos iniciar imediatamente pelas ações de alta prioridade, especialmente a constituição da holding familiar e a implementação das estratégias de proteção patrimonial."
      }
    }
  });

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


  useEffect(() => {
    const fetchUserReportsData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('sessionId');

        if (sessionId) {
          const apiUrl = import.meta.env.VITE_API_THE_WAY;
          const response = await axios.get(`${apiUrl}/client-reports/${sessionId}`);

          const reportData = JSON.parse(response.data[0].report_data);
          setUserReports(reportData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserReportsData();
  }, []);


  useEffect(() => {
    if (userReports) {
      console.log(userReports);
    }
  }, [userReports]);

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
      <div className="relative">
        <Header />
        <main>
          <div className="min-h-screen">
            <CoverPage clientData={getClientData().cliente} />
          </div>
          <div className="min-h-screen">
            <FinancialSummary data={getClientData().financas} />
          </div>
          <div className="min-h-screen">
            <RetirementPlanning data={getClientData().aposentadoria} />
          </div>
          <div className="min-h-screen">
            <BeachHouse casaPraia={getClientData().casaPraia} />
          </div>
          <div className="min-h-screen">
            <TaxPlanning data={getClientData()} />
          </div>
          <div className="min-h-screen">
            <ProtectionPlanning data={getClientData()} />
          </div>
          <div className="min-h-screen">
            <SuccessionPlanning data={getClientData()} />
          </div>
          <div className="min-h-screen">
            <ActionPlan data={getClientData()} />
          </div>
        </main>
        <DotNavigation />
        <MobileDotNavigation />
        <FloatingActions />
      </div>
    </ThemeProvider>
  );
};

export default IndexPage;
