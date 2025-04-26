import React from 'react';
import { 
  ArrowRight, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ListChecks, 
  ShieldCheck, 
  User,
  Timer,
  FileText,
  PlayCircle
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import HideableCard from '@/components/ui/HideableCard';
import useCardVisibility from '@/hooks/useCardVisibility';
import StatusChip from '@/components/ui/StatusChip';
import ProgressBar from '@/components/ui/ProgressBar';
import { cn } from '@/lib/utils';

interface ActionPlanProps {
  data: any;
}

interface CronogramaItem {
  acao: string;
  etapa: string;
  prazo: string;
}

interface CronogramaAntigoItem {
  periodo: string;
  objetivoPrincipal: string;
  descricao: string;
  acoes: string[];
}

// Componente customizado que estende o Card básico
const CardWithHighlight = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { highlight?: boolean }
>(({ className, highlight, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      highlight && "border-accent/50 bg-accent/5",
      className
    )}
    {...props}
  />
));
CardWithHighlight.displayName = "CardWithHighlight";

const getEtapaIcon = (etapa: string) => {
  switch (etapa.toLowerCase()) {
    case 'validação com o cliente':
      return <FileText className="h-5 w-5 text-accent" />;
    case 'execução de ações prioritárias':
      return <PlayCircle className="h-5 w-5 text-financial-success" />;
    case 'formalização jurídica':
      return <CheckCircle className="h-5 w-5 text-financial-info" />;
    case 'implementação completa':
      return <CheckCircle className="h-5 w-5 text-financial-warning" />;
    case 'acompanhamento periódico':
      return <Timer className="h-5 w-5 text-financial-info" />;
    default:
      return <Calendar className="h-5 w-5 text-accent" />;
  }
};

const ActionPlan: React.FC<ActionPlanProps> = ({ data }) => {
  const titleRef = useScrollAnimation<HTMLDivElement>();
  const securityIndexRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const timelineRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const priorityRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const nextStepsRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.2 });
  const { isCardVisible, toggleCardVisibility } = useCardVisibility();
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta':
        return 'bg-financial-danger/20 text-financial-danger';
      case 'Média':
        return 'bg-financial-warning/20 text-financial-warning';
      case 'Baixa':
        return 'bg-financial-success/20 text-financial-success';
      default:
        return 'bg-financial-info/20 text-financial-info';
    }
  };
  
  if (!data || !data.planoAcao) {
    console.error('Dados do plano de ação não disponíveis:', data);
    return <div className="py-12 px-4 text-center">Dados do plano de ação não disponíveis</div>;
  }

  // Identificar qual tipo de cronograma estamos usando (novo ou antigo)
  const isNewCronograma = data.planoAcao.cronograma && 
                         data.planoAcao.cronograma.length > 0 && 
                         'acao' in data.planoAcao.cronograma[0];
  
  return (
    <section className="py-16 px-4 md:px-8" id="action-plan">
      <div ref={titleRef} className="max-w-5xl mx-auto mb-12 text-center animate-on-scroll">
        <div className="inline-block">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-accent/10 p-3 rounded-full">
              <ListChecks size={28} className="text-accent" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-3">{data.planoAcao.titulo}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {data.planoAcao.resumo}
          </p>
        </div>
      </div>
      
      <div ref={securityIndexRef} className="max-w-5xl mx-auto mb-8 animate-on-scroll">
        <HideableCard
          id="indicador-seguranca"
          isVisible={isCardVisible("indicador-seguranca")}
          onToggleVisibility={() => toggleCardVisibility("indicador-seguranca")}
          className="border-accent/40"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="text-accent" />
              {data.planoAcao.indicadorSegurancaFinanceira.titulo}
            </CardTitle>
            <CardDescription>
              {data.planoAcao.indicadorSegurancaFinanceira.descricao}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-6 mb-4">
              <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-accent/20">
                <div className="absolute inset-0 rounded-full border-8 border-accent" 
                     style={{ 
                       clipPath: `inset(0 ${100 - data.planoAcao.indicadorSegurancaFinanceira.valor}% 0 0)` 
                     }}
                />
                <div className="text-center">
                  <div className="text-4xl font-bold">{data.planoAcao.indicadorSegurancaFinanceira.valor}</div>
                  <div className="text-sm text-muted-foreground">/ 100</div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Nível atual:</span>
                  <StatusChip 
                    status={data.planoAcao.indicadorSegurancaFinanceira.valor >= 80 ? 'success' : data.planoAcao.indicadorSegurancaFinanceira.valor >= 60 ? 'info' : 'warning'} 
                    label={data.planoAcao.indicadorSegurancaFinanceira.nivel} 
                  />
                </div>
                <h4 className="text-xl font-medium mb-3">Elementos avaliados:</h4>
                <ul className="space-y-2">
                  {data.planoAcao.indicadorSegurancaFinanceira.elementosAvaliados.map((elemento: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="text-accent h-5 w-5 mt-0.5 flex-shrink-0" />
                      <span>{elemento}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </HideableCard>
      </div>
      
      <div ref={timelineRef} className="max-w-5xl mx-auto mb-8 animate-on-scroll">
        <h3 className="section-subtitle mb-6">Cronograma de Implementação</h3>
        <div className="relative">
          {isNewCronograma ? (
            // Novo formato de cronograma
            <div className="grid grid-cols-1 gap-6">
              {(data.planoAcao.cronograma as CronogramaItem[]).map((item, index) => (
                <HideableCard 
                  key={index}
                  id={`cronograma-novo-${index}`}
                  isVisible={isCardVisible(`cronograma-novo-${index}`)}
                  onToggleVisibility={() => toggleCardVisibility(`cronograma-novo-${index}`)}
                  className={index === 0 ? 'border-accent/40 bg-accent/5' : ''}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/4 flex items-center">
                        <div className="bg-accent/10 p-2 rounded-full mr-3">
                          {getEtapaIcon(item.etapa)}
                        </div>
                        <div>
                          <div className="font-medium text-lg">{item.etapa}</div>
                          <div className="text-sm text-muted-foreground">
                            <Clock className="inline-flex mr-1 h-3 w-3" />
                            {item.prazo}
                          </div>
                        </div>
                      </div>
                      <div className="md:w-3/4 flex items-center">
                        <div className="pl-4 border-l border-border">
                          <div className="text-lg">{item.acao}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </HideableCard>
              ))}
            </div>
          ) : (
            // Formato antigo de cronograma
            <>
              {(data.planoAcao.cronograma as CronogramaAntigoItem[]).map((fase: any, index: number) => (
                <div key={index} className="mb-8 md:mb-10">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                    <div className="md:w-1/4">
                      <CardWithHighlight highlight={index === 0} className={index === 0 ? 'border-accent' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-5 w-5 text-accent" />
                            <h4 className="font-semibold">{fase.periodo}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{fase.objetivoPrincipal}</p>
                        </CardContent>
                      </CardWithHighlight>
                    </div>
                    <div className="md:w-3/4">
                      <HideableCard 
                        id={`cronograma-${index}`}
                        isVisible={isCardVisible(`cronograma-${index}`)}
                        onToggleVisibility={() => toggleCardVisibility(`cronograma-${index}`)}
                      >
                        <CardContent className="p-4">
                          <p className="mb-3 font-medium">{fase.descricao}</p>
                          <ul className="space-y-2">
                            {fase.acoes.map((acao: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <ArrowRight className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                                <span>{acao}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </HideableCard>
                    </div>
                  </div>
                  {index < data.planoAcao.cronograma.length - 1 && (
                    <div className="hidden md:block h-8 w-0.5 bg-border mx-auto my-0"></div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      
      <div ref={priorityRef} className="max-w-5xl mx-auto mb-6 animate-on-scroll">
        <h3 className="section-subtitle mb-6">Ações Prioritárias</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.planoAcao.acoesPrioritarias.map((acao: any, index: number) => (
            <HideableCard 
              key={index} 
              id={`acao-prioritaria-${index}`}
              isVisible={isCardVisible(`acao-prioritaria-${index}`)}
              onToggleVisibility={() => toggleCardVisibility(`acao-prioritaria-${index}`)}
              className={acao.prioridade === 'Alta' ? 'border-financial-danger/50' : ''}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{acao.titulo}</CardTitle>
                  <Badge className={getPriorityColor(acao.prioridade)}>
                    {acao.prioridade}
                  </Badge>
                </div>
                <CardDescription className="mt-1">{acao.descricao}</CardDescription>
              </CardHeader>
              <CardContent className="py-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Prazo: <span className="font-medium">{acao.prazo}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Responsável: <span className="font-medium">{acao.responsavel}</span></span>
                  </div>
                </div>
                <div className="mb-3">
                  <h5 className="text-sm font-medium mb-2">Passos principais:</h5>
                  <ol className="text-sm space-y-1">
                    {acao.passos.map((passo: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-xs inline-flex items-center justify-center size-5 rounded-full bg-accent/10 text-accent font-medium">{i+1}</span>
                        {passo}
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <span className="text-sm text-muted-foreground">Impacto: {acao.impacto}</span>
                <StatusChip 
                  status={acao.status === 'Concluído' ? 'success' : acao.status === 'Em progresso' ? 'info' : 'warning'} 
                  label={acao.status} 
                />
              </CardFooter>
            </HideableCard>
          ))}
        </div>
      </div>
      
      <div ref={nextStepsRef} className="max-w-5xl mx-auto mb-6 animate-on-scroll delay-1">
        <HideableCard 
          id="proximos-passos"
          isVisible={isCardVisible("proximos-passos")}
          onToggleVisibility={() => toggleCardVisibility("proximos-passos")}
          className="bg-gradient-to-br from-accent/10 to-background border-accent/30"
        >
          <CardHeader className="pb-3">
            <CardTitle>{data.planoAcao.conclusao.titulo}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-6">
            <p className="text-lg mb-4">{data.planoAcao.conclusao.mensagemPrincipal}</p>
            <p className="mb-4">{data.planoAcao.conclusao.compromissoAssessoria}</p>
            <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
              <h4 className="flex items-center gap-2 font-medium mb-2">
                <ArrowRight className="text-accent" />
                Recomendação Final
              </h4>
              <p>{data.planoAcao.conclusao.recomendacaoFinal}</p>
            </div>
          </CardContent>
        </HideableCard>
      </div>
      
      <div className="max-w-5xl mx-auto mb-6 animate-on-scroll delay-2">
        <h3 className="section-subtitle mb-6">Metas de Curto Prazo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.planoAcao.metasCurtoPrazo.map((meta: any, index: number) => (
            <HideableCard 
              key={index}
              id={`meta-curto-prazo-${index}`}
              isVisible={isCardVisible(`meta-curto-prazo-${index}`)}
              onToggleVisibility={() => toggleCardVisibility(`meta-curto-prazo-${index}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-accent/10 text-accent rounded-full p-2 mt-1">
                    <ListChecks className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{meta.acao}</h4>
                    <p className="text-sm text-muted-foreground">{meta.objetivoEspecifico}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-xs text-muted-foreground">Prazo</span>
                    <p className="font-medium">{meta.prazo}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Responsável</span>
                    <p className="font-medium">{meta.responsavel}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Resultado esperado</span>
                  <p className="text-sm">{meta.resultadoEsperado}</p>
                </div>
              </CardContent>
            </HideableCard>
          ))}
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto mb-6 animate-on-scroll delay-3">
        <HideableCard
          id="acompanhamento-progresso"
          isVisible={isCardVisible("acompanhamento-progresso")}
          onToggleVisibility={() => toggleCardVisibility("acompanhamento-progresso")}
        >
          <CardHeader>
            <CardTitle>{data.planoAcao.acompanhamentoProgresso.titulo}</CardTitle>
            <CardDescription>
              Frequência de revisão: {data.planoAcao.acompanhamentoProgresso.frequenciaRevisao}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <h4 className="text-lg font-medium mb-3">Métricas de sucesso:</h4>
            <div className="space-y-4 mb-6">
              {data.planoAcao.acompanhamentoProgresso.metricasSucesso.map((metrica: string, index: number) => (
                <div key={index}>
                  <ProgressBar 
                    label={metrica}
                    value={25 * (index + 1)}
                    max={100}
                    showValue={true}
                    color={index % 2 === 0 ? 'default' : 'success'}
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted p-3 rounded-lg">
                <span className="text-sm text-muted-foreground">Próxima reunião:</span>
                <p className="font-medium">{data.planoAcao.acompanhamentoProgresso.proximaReuniao}</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <span className="text-sm text-muted-foreground">Responsável:</span>
                <p className="font-medium">{data.planoAcao.acompanhamentoProgresso.responsavelAcompanhamento}</p>
              </div>
            </div>
          </CardContent>
        </HideableCard>
      </div>
    </section>
  );
};

export default ActionPlan;