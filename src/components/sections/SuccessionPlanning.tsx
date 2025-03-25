
import React from 'react';
import { Shield, Users, FileText, GanttChart } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import StatusChip from '@/components/ui/StatusChip';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { formatCurrency } from '@/utils/formatCurrency';
import { Button } from '@/components/ui/button';

interface SuccessionPlanningProps {
  data?: any;
}

const SuccessionPlanning: React.FC<SuccessionPlanningProps> = ({ data }) => {
  const headerRef = useScrollAnimation();
  const cardRef1 = useScrollAnimation();
  const cardRef2 = useScrollAnimation();
  const cardRef3 = useScrollAnimation();
  
  // Mock data for demonstration, would be replaced with actual data
  const mockData = {
    objetivos: [
      "Garantir a transmissão eficiente de patrimônio para herdeiros",
      "Minimizar custos e impostos na sucessão",
      "Preservar a harmonia familiar durante o processo sucessório",
      "Assegurar a continuidade dos negócios familiares"
    ],
    patrimonioTotal: 3650000,
    patrimonioTransmissivel: 3200000,
    impostoEstimado: {
      semPlanejamento: 256000, // 8% do patrimônio transmissível
      comPlanejamento: 98000    // Valor reduzido com planejamento
    },
    instrumentos: [
      {
        tipo: "Testamento",
        implementado: true,
        descricao: "Documento que expressa a vontade quanto à destinação dos bens",
        vantagens: [
          "Possibilidade de definir a divisão da parte disponível (50%) do patrimônio",
          "Estabelecimento de cláusulas de proteção (inalienabilidade, impenhorabilidade)",
          "Nomeação de tutores para filhos menores"
        ]
      },
      {
        tipo: "Holding Familiar",
        implementado: false,
        descricao: "Estrutura societária para centralização e proteção de bens",
        vantagens: [
          "Redução de até 80% nos custos com ITCMD",
          "Evita processo de inventário para os bens da holding",
          "Proteção patrimonial contra credores",
          "Gestão centralizada dos ativos familiares"
        ]
      },
      {
        tipo: "Doação em vida com usufruto",
        implementado: false,
        descricao: "Transferência de bens em vida mantendo o direito de uso",
        vantagens: [
          "Antecipação da sucessão de forma planejada",
          "Manutenção do controle sobre os bens durante a vida",
          "Possibilidade de incluir cláusulas de proteção",
          "Menor custo tributário quando feito gradualmente"
        ]
      }
    ],
    previdenciaPrivada: {
      valor: 300000,
      beneficiarios: "Cônjuge (50%) e filhos (25% cada)",
      vantagens: [
        "Não entra em inventário",
        "Pagamento imediato aos beneficiários",
        "Não incide ITCMD"
      ]
    },
    projetoDeVida: [
      {
        fase: "Legado Financeiro",
        status: "Em andamento",
        descricao: "Estruturação do patrimônio para garantir segurança financeira da família",
        prazo: "Contínuo"
      },
      {
        fase: "Legado de Conhecimento",
        status: "Não iniciado",
        descricao: "Preparação dos herdeiros para gestão patrimonial e empresarial",
        prazo: "Iniciar em 6 meses"
      },
      {
        fase: "Legado de Valores",
        status: "Em andamento",
        descricao: "Transmissão de princípios e valores familiares",
        prazo: "Contínuo"
      }
    ]
  };
  
  return (
    <section className="py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div 
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="mb-8 animate-on-scroll"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-accent/10 p-2 rounded-full">
              <Users size={24} className="text-accent" />
            </div>
            <h2 className="text-3xl font-bold">Planejamento Sucessório</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Estratégias para garantir a transferência eficiente de patrimônio, preservar a harmonia familiar e minimizar custos tributários no processo sucessório.
          </p>
        </div>
        
        {/* Objectives and Financial Impact */}
        <div 
          ref={cardRef1 as React.RefObject<HTMLDivElement>}
          className="mb-8 animate-on-scroll delay-1"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GanttChart size={20} className="text-accent" />
                  Objetivos
                </CardTitle>
                <CardDescription>
                  Principais metas do planejamento sucessório
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {mockData.objetivos.map((objetivo, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-6 w-6 rounded-full bg-accent/15 flex items-center justify-center text-accent shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span>{objetivo}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            {/* Financial Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield size={20} className="text-accent" />
                  Impacto Financeiro
                </CardTitle>
                <CardDescription>
                  Economia estimada com planejamento sucessório
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Patrimônio Transmissível</p>
                      <p className="text-2xl font-medium">{formatCurrency(mockData.patrimonioTransmissivel)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Economia Estimada</p>
                      <p className="text-2xl font-medium text-financial-success">
                        {formatCurrency(mockData.impostoEstimado.semPlanejamento - mockData.impostoEstimado.comPlanejamento)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Custo sem planejamento</span>
                        <span className="font-medium">{formatCurrency(mockData.impostoEstimado.semPlanejamento)}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-financial-danger h-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Custo com planejamento</span>
                        <span className="font-medium">{formatCurrency(mockData.impostoEstimado.comPlanejamento)}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="bg-financial-success h-full" style={{ width: `${(mockData.impostoEstimado.comPlanejamento / mockData.impostoEstimado.semPlanejamento) * 100}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">Redução de {Math.round((1 - mockData.impostoEstimado.comPlanejamento / mockData.impostoEstimado.semPlanejamento) * 100)}%</span> nos 
                        custos sucessórios com implementação do planejamento recomendado.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Succession Instruments */}
        <div 
          ref={cardRef2 as React.RefObject<HTMLDivElement>}
          className="mb-8 animate-on-scroll delay-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} className="text-accent" />
                Instrumentos Sucessórios
              </CardTitle>
              <CardDescription>
                Ferramentas jurídicas para implementação do planejamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockData.instrumentos.map((instrumento, index) => (
                  <div key={index} className="border-b last:border-0 pb-5 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium">{instrumento.tipo}</h3>
                      <StatusChip 
                        status={instrumento.implementado ? 'success' : 'warning'} 
                        label={instrumento.implementado ? 'Implementado' : 'Pendente'} 
                      />
                    </div>
                    <p className="text-muted-foreground mb-3">{instrumento.descricao}</p>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Vantagens:</h4>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {instrumento.vantagens.map((vantagem, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <div className="text-accent mt-1">•</div>
                            <span>{vantagem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Private Pension and Life Project */}
        <div 
          ref={cardRef3 as React.RefObject<HTMLDivElement>}
          className="animate-on-scroll delay-3"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Private Pension */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield size={20} className="text-accent" />
                  Previdência Privada
                </CardTitle>
                <CardDescription>
                  Componente importante do planejamento sucessório
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Valor atual</div>
                    <div className="text-2xl font-medium">{formatCurrency(mockData.previdenciaPrivada.valor)}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Beneficiários designados</div>
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      {mockData.previdenciaPrivada.beneficiarios}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Vantagens sucessórias</div>
                    <ul className="space-y-2">
                      {mockData.previdenciaPrivada.vantagens.map((vantagem, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="h-5 w-5 rounded-full bg-accent/15 flex items-center justify-center text-accent shrink-0">
                            ✓
                          </div>
                          <span>{vantagem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Life Project */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} className="text-accent" />
                  Projeto de Vida e Legado
                </CardTitle>
                <CardDescription>
                  Planejamento além dos aspectos financeiros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.projetoDeVida.map((fase, index) => (
                    <div key={index} className="border-l-4 pl-4" style={{ borderColor: fase.status === 'Em andamento' ? '#8B5CF6' : '#FBBF24' }}>
                      <div className="flex justify-between">
                        <h3 className="font-medium">{fase.fase}</h3>
                        <StatusChip 
                          status={fase.status === 'Em andamento' ? 'info' : 'warning'} 
                          label={fase.status} 
                          className="text-xs"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">{fase.descricao}</p>
                      <p className="text-xs mt-1">Prazo: {fase.prazo}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Ver plano detalhado de legado
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessionPlanning;
