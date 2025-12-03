# 📁 Estrutura de Componentes da Home

Esta pasta foi organizada seguindo o padrão **Feature/Domain-Driven Organization** para melhor manutenibilidade e navegação.

## 🗂️ Estrutura

```
components/
├── 📊 analytics/          # Componentes de Analytics e Insights
│   ├── SaudeFinanceiraCard
│   ├── PadroesTemporaisCard
│   └── MeiosPagamentoChart
│
├── 📑 categorias/         # Componentes relacionados a Categorias
│   ├── TopCategoriasCard
│   ├── DespesasPorCategoria
│   └── ResumoPorCategoriaTable
│
├── 💰 patrimonio/         # Componentes de Patrimônio
│   └── PatrimonyCards
│
├── 📈 resumo/             # Componentes de Resumo Financeiro
│   ├── ResumoMensalTable
│   ├── ResumoFinanceiroChart
│   └── TendenciasChart
│
├── 🔖 tabs/               # Componentes de Tabs (Páginas principais)
│   ├── VisaoGeralTab
│   ├── PatrimonioTab
│   └── AnalisesDetalhadasTab
│
└── 🔧 shared/             # Componentes compartilhados/genéricos
    ├── Card
    ├── Header
    └── QuickStatCard
```

## 📖 Guia de Uso

### Importando Componentes

**De fora da pasta Home:**

```typescript
import {
  VisaoGeralTab,
  SaudeFinanceiraCard,
  Card,
} from "@/presentation/pages/Home/components";
```

**Entre pastas de features:**

```typescript
// De tabs/VisaoGeralTab
import { Card } from "../../shared";
import { SaudeFinanceiraCard } from "../../analytics";
```

### Onde Colocar Novos Componentes

- **`analytics/`** - Componentes de métricas, KPIs, gráficos analíticos
- **`categorias/`** - Componentes que lidam com categorias de transações
- **`patrimonio/`** - Componentes relacionados a ativos e passivos
- **`resumo/`** - Componentes de resumo financeiro (receitas, despesas, saldos)
- **`tabs/`** - Componentes de nível de página (tabs principais)
- **`shared/`** - Componentes genéricos reutilizáveis em múltiplas features

## ✨ Benefícios desta Organização

✅ **Navegação Mais Fácil** - Encontre componentes por domínio/funcionalidade
✅ **Manutenibilidade** - Mudanças em uma feature não afetam outras
✅ **Escalabilidade** - Fácil adicionar novas features sem poluir a estrutura
✅ **Reutilização** - Componentes compartilhados claramente identificados
✅ **Onboarding** - Novos desenvolvedores entendem a estrutura rapidamente

## 🔄 Migração

Esta estrutura foi criada em 02/12/2024 reorganizando os componentes que estavam todos no mesmo nível.

**Antes:** 16 componentes no mesmo nível
**Depois:** 6 pastas organizadas por domínio
