import React from 'react';
import { CircleDollarSign, Shield, Briefcase, Umbrella, Plane, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import HideableCard from '@/components/ui/HideableCard';
import { useCardVisibility } from '@/context/CardVisibilityContext';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatCurrency';
import { Separator } from '@/components/ui/separator';

interface ProtectionPlanningProps {
  data: any;
  hideControls?: boolean;
}

const ProtectionPlanning: React.FC<ProtectionPlanningProps> = ({ data, hideControls }) => {
  const protectionData = data?.protecao;
  const { isCardVisible, toggleCardVisibility } = useCardVisibility();

  if (!protectionData) {
    return <div>Dados de proteção patrimonial não disponíveis</div>;
  }

  return (
    <section className="py-16 px-4" id="protection">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <div className="inline-block">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-accent/10 p-3 rounded-full">
                <Shield size={28} className="text-accent" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-3">{protectionData.titulo}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {protectionData.resumo}
            </p>
          </div>
        </div>

        {/* Insurance Needs Analysis */}
        <HideableCard
          id="analise-necessidades"
          isVisible={isCardVisible("analise-necessidades")}
          onToggleVisibility={() => toggleCardVisibility("analise-necessidades")}
          hideControls={hideControls}
          className="mb-10"
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-accent" />
              <div>
                <CardTitle>Análise de Necessidades</CardTitle>
                <CardDescription>Avaliação de riscos e necessidades de proteção</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium mb-3">Perfil de Risco</h4>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Renda Anual</span>
                    <span className="font-medium">{formatCurrency(protectionData.analiseNecessidades.rendaAnual)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Patrimônio Total</span>
                    <span className="font-medium">{formatCurrency(protectionData.analiseNecessidades.patrimonioTotal)}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Participação Empresarial</span>
                    <span className="font-medium">{protectionData.analiseNecessidades.atividadeEmpresarial}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-3">Dependentes e Considerações</h4>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Dependentes</span>
                    <span className="font-medium">{protectionData.analiseNecessidades.numeroDependentes} ({protectionData.analiseNecessidades.tiposDependentes.join(", ")})</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Anos de Suporte</span>
                    <span className="font-medium">{protectionData.analiseNecessidades.anosSuporteDependentes} anos</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Viagens Internacionais</span>
                    <span className="font-medium">{protectionData.analiseNecessidades.viagensInternacionais}</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </HideableCard>

        {/* Life Insurance */}
        <HideableCard
          id="seguro-vida"
          isVisible={isCardVisible("seguro-vida")}
          onToggleVisibility={() => toggleCardVisibility("seguro-vida")}
          className="mb-8"
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <CircleDollarSign className="h-8 w-8 text-accent" />
              <div>
                <CardTitle>{protectionData.seguroVida.titulo}</CardTitle>
                <CardDescription>{protectionData.seguroVida.importancia}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Cobertura Recomendada</span>
                    <span className="text-xl font-bold text-accent">{formatCurrency(protectionData.seguroVida.coberturaMinima)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {protectionData.seguroVida.metodologiaCalculo}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="text-md font-medium mb-2">Custo Estimado</h4>
                  <p className="text-sm text-muted-foreground">
                    {protectionData.seguroVida.custoEstimadoAnual}
                  </p>
                </div>

                <div className="bg-accent/10 p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-1">Prioridade</h4>
                  <p className="text-accent font-medium">
                    {protectionData.seguroVida.prioridadeImplementacao}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium mb-3">Coberturas</h4>
                <ul className="space-y-2">
                  {protectionData.seguroVida.coberturas.map((cobertura: any, index: number) => (
                    <li key={index} className="flex items-center justify-between border-b pb-2">
                      <span>{cobertura.tipo}</span>
                      <span className="font-medium">{cobertura.percentual}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </HideableCard>

        {/* Property Insurance */}
        <HideableCard
          id="seguro-patrimonial"
          isVisible={isCardVisible("seguro-patrimonial")}
          onToggleVisibility={() => toggleCardVisibility("seguro-patrimonial")}
          className="mb-8"
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-accent" />
              <div>
                <CardTitle>{protectionData.seguroPatrimonial.titulo}</CardTitle>
                <CardDescription>{protectionData.seguroPatrimonial.importancia}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <div className="flex flex-col mb-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Bens Imóveis</span>
                      <span className="font-medium">{formatCurrency(protectionData.seguroPatrimonial.bensImoveis)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Adicional (bens móveis)</span>
                      <span className="font-medium">{formatCurrency(protectionData.seguroPatrimonial.adicional)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Cobertura Total</span>
                      <span className="text-xl font-bold text-accent">{formatCurrency(protectionData.seguroPatrimonial.coberturaRecomendada)}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-md font-medium mb-2">Custo Estimado</h4>
                    <p className="text-sm text-muted-foreground">
                      {protectionData.seguroPatrimonial.custoEstimadoAnual}
                    </p>
                  </div>

                  <div className="bg-accent/10 p-3 rounded-md">
                    <h4 className="text-sm font-medium mb-1">Prioridade</h4>
                    <p className="text-accent font-medium">
                      {protectionData.seguroPatrimonial.prioridadeImplementacao}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium mb-3">Riscos Protegidos</h4>
                <ul className="space-y-2">
                  {protectionData.seguroPatrimonial.riscosProtegidos.map((risco: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-accent" />
                      <span>{risco}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </HideableCard>

        {/* D&O Insurance and Travel Insurance (Two Column Layout) */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* D&O Insurance */}
          <HideableCard
            id="seguro-do"
            isVisible={isCardVisible("seguro-do")}
            onToggleVisibility={() => toggleCardVisibility("seguro-do")}
            className="h-full"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Umbrella className="h-8 w-8 text-accent" />
                <div>
                  <CardTitle>{protectionData.seguroDO.titulo}</CardTitle>
                  <CardDescription>{protectionData.seguroDO.descricao}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Cobertura Recomendada</span>
                  <span className="text-xl font-bold text-accent">{formatCurrency(protectionData.seguroDO.coberturaMinima)}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {protectionData.seguroDO.justificativa}
                </p>
              </div>

              <div className="mb-4">
                <h4 className="text-md font-medium mb-2">Riscos Cobertos</h4>
                <ul className="space-y-2">
                  {protectionData.seguroDO.riscosCobertos.map((risco: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-accent" />
                      <span>{risco}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="font-medium">Custo estimado: </span>
                  {protectionData.seguroDO.custoEstimadoAnual}
                </p>
                <p className="text-sm text-accent font-medium">
                  <span className="font-medium">Prioridade: </span>
                  {protectionData.seguroDO.prioridadeImplementacao}
                </p>
              </div>
            </CardContent>
          </HideableCard>

          {/* Travel Insurance */}
          <HideableCard
            id="seguro-viagem"
            isVisible={isCardVisible("seguro-viagem")}
            onToggleVisibility={() => toggleCardVisibility("seguro-viagem")}
            className="h-full"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Plane className="h-8 w-8 text-accent" />
                <div>
                  <CardTitle>{protectionData.seguroInternacional.titulo}</CardTitle>
                  <CardDescription>{protectionData.seguroInternacional.consideracoes}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-muted-foreground">Cobertura Médica</span>
                  <span className="font-medium">{protectionData.seguroInternacional.coberturaMedica}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">Cobertura Patrimonial</span>
                  <span className="font-medium">{protectionData.seguroInternacional.coberturaPatrimonial}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-md font-medium mb-2">Riscos Cobertos</h4>
                <ul className="space-y-2">
                  {protectionData.seguroInternacional.riscosCobertos.map((risco: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-accent" />
                      <span>{risco}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="font-medium">Custo estimado: </span>
                  {protectionData.seguroInternacional.custoEstimadoAnual}
                </p>
                <p className="text-sm text-accent font-medium">
                  <span className="font-medium">Prioridade: </span>
                  {protectionData.seguroInternacional.prioridadeImplementacao}
                </p>
              </div>
            </CardContent>
          </HideableCard>
        </div>

        {/* Legal Protection */}
        <HideableCard
          id="protecao-juridica"
          isVisible={isCardVisible("protecao-juridica")}
          onToggleVisibility={() => toggleCardVisibility("protecao-juridica")}
          className="mb-8"
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-accent" />
              <div>
                <CardTitle>{protectionData.protecaoJuridica.titulo}</CardTitle>
                <CardDescription>{protectionData.protecaoJuridica.descricao}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Holding */}
              <div className="border rounded-lg p-4">
                <h4 className="text-lg font-medium mb-2">{protectionData.protecaoJuridica.holdingPatrimonial.titulo}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {protectionData.protecaoJuridica.holdingPatrimonial.finalidade}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-muted-foreground">Custo Estimado</span>
                  <span className="font-medium">{formatCurrency(protectionData.protecaoJuridica.holdingPatrimonial.custoEstimado)}</span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Tempo de Implementação</span>
                  <span className="font-medium">{protectionData.protecaoJuridica.holdingPatrimonial.tempoImplementacao}</span>
                </div>

                <h5 className="text-sm font-medium mb-2">Vantagens Adicionais</h5>
                <ul className="space-y-1">
                  {protectionData.protecaoJuridica.holdingPatrimonial.vantagensAdicionais.map((vantagem: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <div className="mt-1 min-w-3 h-3 w-3 rounded-full bg-accent" />
                      <span>{vantagem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mandato Duradouro */}
              <div className="border rounded-lg p-4">
                <h4 className="text-lg font-medium mb-2">{protectionData.protecaoJuridica.mandatoDuradouro.titulo}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {protectionData.protecaoJuridica.mandatoDuradouro.descricao}
                </p>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-muted-foreground">Custo Estimado</span>
                  <span className="font-medium">{formatCurrency(protectionData.protecaoJuridica.mandatoDuradouro.custoEstimado)}</span>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground">Prioridade</span>
                  <span className="font-medium">{protectionData.protecaoJuridica.mandatoDuradouro.prioridadeImplementacao}</span>
                </div>

                <h5 className="text-sm font-medium mb-2">Benefícios</h5>
                <ul className="space-y-1">
                  {protectionData.protecaoJuridica.mandatoDuradouro.beneficios.map((beneficio: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <div className="mt-1 min-w-3 h-3 w-3 rounded-full bg-accent" />
                      <span>{beneficio}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </HideableCard>

        {/* Additional Recommendations */}
        <HideableCard
          id="recomendacoes-adicionais"
          isVisible={isCardVisible("recomendacoes-adicionais")}
          onToggleVisibility={() => toggleCardVisibility("recomendacoes-adicionais")}
          className={cn("bg-accent/5 border-accent/20")}
        >
          <CardHeader>
            <CardTitle>{protectionData.recomendacoesAdicionais.titulo}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {protectionData.recomendacoesAdicionais.itens.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-accent" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </HideableCard>
      </div>
    </section>
  );
};

export default ProtectionPlanning;
