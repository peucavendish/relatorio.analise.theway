# Controle de Visibilidade de Seções

## Visão Geral

A nova funcionalidade permite ocultar seções completas do relatório, incluindo todos os seus subtítulos e conteúdo. Isso é útil para personalizar o relatório para diferentes tipos de clientes ou situações.

## Como Funciona

### 1. Controle de Visibilidade
- Um novo botão flutuante (ícone de engrenagem) aparece no canto inferior direito
- Ao clicar, abre um modal com todas as seções disponíveis
- Cada seção pode ser ocultada/mostrada individualmente

### 2. Seções Disponíveis
- **Resumo Financeiro** (`summary`) - Visão geral da situação financeira
- **Aposentadoria** (`retirement`) - Planejamento para aposentadoria
- **Aquisição de Imóveis** (`beach-house`) - Planejamento para aquisição de imóveis
- **Planejamento Tributário** (`tax`) - Estratégias de otimização fiscal
- **Proteção Patrimonial** (`protection`) - Proteção do patrimônio e seguros
- **Planejamento Sucessório** (`succession`) - Transferência de patrimônio
- **Plano de Ação** (`action-plan`) - Ações prioritárias e cronograma

### 3. Comportamento
- **Para Assessores**: Podem ver e controlar a visibilidade de todas as seções
- **Para Clientes**: Seções ocultas não aparecem no relatório
- **Persistência**: As configurações são salvas automaticamente no backend

## Implementação Técnica

### Componentes Criados

1. **SectionVisibilityContext** (`src/context/SectionVisibilityContext.tsx`)
   - Gerencia o estado de visibilidade das seções
   - Sincroniza com o backend
   - Fornece hooks para controlar a visibilidade

2. **SectionVisibilityControls** (`src/components/layout/SectionVisibilityControls.tsx`)
   - Interface para controlar a visibilidade
   - Modal com lista de todas as seções
   - Indicador visual de seções ocultas

3. **HideableSection** (`src/components/ui/HideableSection.tsx`)
   - Wrapper para seções que podem ser ocultadas
   - Renderiza conteúdo normal ou versão oculta
   - Mantém IDs para navegação

### Integração

```tsx
// Exemplo de uso na página principal
<HideableSection sectionId="beach-house" hideControls={clientProspect}>
  <BeachHouse data={userReports} hideControls={clientProspect} />
</HideableSection>
```

## Endpoints do Backend

A funcionalidade espera os seguintes endpoints:

### GET `/clients/hidden-sections`
- Retorna o estado atual das seções ocultas
- Parâmetro: `session_id`

### POST `/clients/update-hidden-sections`
- Atualiza o estado das seções ocultas
- Body: `{ session_id, hiddenSections }`

## Exemplo de Uso

### Ocultando a Seção de Aquisição de Imóveis

1. Clique no botão de engrenagem (⚙️) no canto inferior direito
2. No modal, encontre "Aquisição de Imóveis"
3. Clique no botão "Oculta" para esconder a seção
4. A seção será ocultada do relatório do cliente

### Visualização

- **Assessor**: Vê a seção com overlay "Seção Ocultada"
- **Cliente**: A seção não aparece no relatório
- **Navegação**: Os pontos de navegação continuam funcionando

## Benefícios

1. **Personalização**: Relatórios adaptados para cada cliente
2. **Flexibilidade**: Controle granular sobre o conteúdo
3. **Experiência do Cliente**: Foco apenas no que é relevante
4. **Persistência**: Configurações salvas automaticamente

## Próximos Passos

- [ ] Adicionar mais seções conforme necessário
- [ ] Implementar templates de visibilidade pré-definidos
- [ ] Adicionar estatísticas de uso das seções
- [ ] Melhorar a interface de controle 