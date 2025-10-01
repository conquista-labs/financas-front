# 📊 Dashboard Analytics - Roadmap de Implementação

Este documento detalha todas as features e endpoints necessários para enriquecer a dashboard com analytics avançados.

## 🎯 **1. Analytics por Categoria (PRIORIDADE ALTA)**

### **Feature:** Top Categorias com Controle de Teto

**Descrição:** Mostrar as categorias com mais gastos, alertas de teto e comparações.

### **Endpoint Backend Necessário:**

```
GET /api/analytics/categorias
Query Parameters:
- ano: number (obrigatório)
- mes: number (obrigatório)
- limit?: number (default: 5)
```

### **Estrutura de Resposta:**

```typescript
interface GetAnalyticsCategorias {
  message: string;
  data: {
    categorias: CategoriaAnalytics[];
    totalGeral: number;
    mesAnterior: {
      totalGeral: number;
      variacao: number; // percentual
    };
  };
}

interface CategoriaAnalytics {
  id: string;
  nome: string;
  tipo: "receita" | "despesa";
  icone: string;
  cor: string;

  // Analytics
  valorTotal: number;
  numeroTransacoes: number;
  percentualDoTotal: number;

  // Controle de Teto
  tetoGasto: number;
  percentualTeto: number; // valor vs teto
  tetoUltrapassado: boolean;

  // Comparação Temporal
  mesAnterior: {
    valorTotal: number;
    variacao: number; // percentual
  };

  // Top Transação
  maiorTransacao: {
    id: string;
    descricao: string;
    valor: number;
    data: string;
  };
}
```

### **Componentes Frontend:**

- `TopCategoriasCard` - Cards com ranking das categorias
- `AlertaTetosCard` - Lista de categorias que ultrapassaram o teto
- `CategoriasChart` - Donut chart usando as cores das categorias

---

## 💳 **2. Análise por Meio de Pagamento (PRIORIDADE MÉDIA)**

### **Feature:** Distribuição e Análise de Pagamentos

**Descrição:** Analytics dos meios de pagamento e formas de pagamento.

### **Endpoint Backend Necessário:**

```
GET /api/analytics/meios-pagamento
Query Parameters:
- ano: number (obrigatório)
- mes: number (obrigatório)
```

### **Estrutura de Resposta:**

```typescript
interface GetAnalyticsMeiosPagamento {
  message: string;
  data: {
    meiosPagamento: MeioPagamentoAnalytics[];
    formasPagamento: FormaPagamentoAnalytics;
    resumo: {
      totalTransacoes: number;
      valorMedio: number;
      meioMaisUsado: string;
    };
  };
}

interface MeioPagamentoAnalytics {
  id: string;
  nome: string;
  valorTotal: number;
  numeroTransacoes: number;
  percentualDoTotal: number;
  valorMedio: number;
}

interface FormaPagamentoAnalytics {
  avista: {
    numeroTransacoes: number;
    valorTotal: number;
    percentual: number;
  };
  parcelado: {
    numeroTransacoes: number;
    valorTotal: number;
    percentual: number;
    mediaParcelamento: number; // média de parcelas
  };
  distribuicaoParcelas: {
    parcela1x: number;
    parcela2x: number;
    // ... até parcela12x
  };
}
```

### **Componentes Frontend:**

- `MeiosPagamentoChart` - Gráfico pizza dos meios
- `ParcelasAnalyticsCard` - Card com análise à vista vs parcelado

---

## 📈 **3. Tendências e Métricas Avançadas (PRIORIDADE ALTA)**

### **Feature:** Evolução Temporal e Projeções

**Descrição:** Tendências, médias móveis e projeções baseadas no histórico.

### **Endpoint Backend Necessário:**

```
GET /api/analytics/tendencias
Query Parameters:
- ano: number (obrigatório)
- mes: number (obrigatório)
- mesesHistorico?: number (default: 12)
```

### **Estrutura de Resposta:**

```typescript
interface GetAnalyticsTendencias {
  message: string;
  data: {
    evolucaoMensal: EvolucaoMensal[];
    projecaoMesAtual: ProjecaoMes;
    metricas: MetricasAvancadas;
    insights: InsightFinanceiro[];
  };
}

interface EvolucaoMensal {
  ano: number;
  mes: number;
  receitas: number;
  despesas: number;
  saldo: number;
  numeroTransacoes: number;
}

interface ProjecaoMes {
  mesAtual: {
    diaAtual: number;
    totalDias: number;
    percentualMesDecorrido: number;
  };
  valores: {
    receitasRealizadas: number;
    despesasRealizadas: number;
    receitasProjetadas: number;
    despesasProjetadas: number;
    saldoProjetado: number;
  };
}

interface MetricasAvancadas {
  mediaDespesasDiarias: number;
  mediaMensalUltimos6Meses: number;
  variacao6Meses: number; // percentual
  maiorGastoMes: {
    id: string;
    descricao: string;
    valor: number;
    data: string;
    categoria: string;
  };
  diasSemGastos: {
    ultimoPeriodo: number;
    recordeAno: number;
  };
}

interface InsightFinanceiro {
  tipo: "positivo" | "neutro" | "atencao" | "critico";
  titulo: string;
  descricao: string;
  valor?: number;
  acao?: string;
}
```

### **Componentes Frontend:**

- `TendenciasChart` - Gráfico de linha da evolução
- `ProjecaoMesCard` - Card com projeção do mês atual
- `InsightsPanel` - Painel com insights automatizados

---

## 🎯 **4. Metas e Controle Orçamentário (PRIORIDADE ALTÍSSIMA)**

### **Feature:** Sistema de Metas e Orçamento

**Descrição:** Controle de orçamento mensal, metas por categoria e saúde financeira.

### **Endpoint Backend Necessário:**

```
GET /api/analytics/orcamento
Query Parameters:
- ano: number (obrigatório)
- mes: number (obrigatório)
```

### **Estrutura de Resposta:**

```typescript
interface GetAnalyticsOrcamento {
  message: string;
  data: {
    saudeFinanceira: SaudeFinanceira;
    orcamentoGeral: OrcamentoGeral;
    orcamentoCategorias: OrcamentoCategoria[];
    alertas: AlertaOrcamento[];
  };
}

interface SaudeFinanceira {
  status: "saudavel" | "atencao" | "critico" | "excelente";
  pontuacao: number; // 0-100
  fatores: {
    orcamentoRespeitado: boolean;
    tendenciaPositiva: boolean;
    reservaEmergencia: boolean;
    gastoControladoPorCategoria: boolean;
  };
}

interface OrcamentoGeral {
  valorOrcado: number;
  valorRealizado: number;
  percentualUtilizado: number;
  saldoRestante: number;
  diasRestantes: number;
  mediaGastoDiario: number;
  mediaPermitidaDiaria: number;
  projecaoFinal: number;
}

interface OrcamentoCategoria {
  categoriaId: string;
  categoriaNome: string;
  categoriaIcone: string;
  categoriaCor: string;

  valorOrcado: number; // baseado no tetoGasto
  valorRealizado: number;
  percentualUtilizado: number;
  status: "dentro" | "atencao" | "ultrapassado";
  saldoRestante: number;

  projecaoMes: number;
  ultimasTransacoes: {
    id: string;
    descricao: string;
    valor: number;
    data: string;
  }[];
}

interface AlertaOrcamento {
  tipo: "info" | "warning" | "error" | "success";
  categoria?: string;
  titulo: string;
  descricao: string;
  valorEnvolvido?: number;
  acao?: string;
}
```

### **Componentes Frontend:**

- `SaudeFinanceiraCard` - Card com status geral e pontuação
- `OrcamentoGeralCard` - Resumo do orçamento mensal
- `OrcamentoCategoriasList` - Lista com progresso por categoria
- `AlertasPanel` - Painel de alertas e recomendações

---

## 📅 **5. Análise Temporal e Recorrência (PRIORIDADE BAIXA)**

### **Feature:** Padrões Temporais e Transações Recorrentes

**Descrição:** Análise de padrões de gastos e identificação de recorrências.

### **Endpoint Backend Necessário:**

```
GET /api/analytics/padroes-temporais
Query Parameters:
- ano: number (obrigatório)
- mes: number (obrigatório)
```

### **Estrutura de Resposta:**

```typescript
interface GetAnalyticsPadroesTemporais {
  message: string;
  data: {
    padroesDiarios: PadraoDiario[];
    transacoesRecorrentes: TransacaoRecorrente[];
    lembretes: LembreteTransacao[];
    parcelasAbertas: ParcelaAberta[];
  };
}

interface PadraoDiario {
  diaSemana: string; // "segunda", "terca", etc.
  numeroTransacoes: number;
  valorMedio: number;
  valorTotal: number;
  horarioPreferido: string; // "manha", "tarde", "noite"
}

interface TransacaoRecorrente {
  padrao: string; // descrição similar encontrada
  frequencia: "semanal" | "quinzenal" | "mensal";
  ultimaOcorrencia: string;
  proximaPrevisao: string;
  valorMedio: number;
  categoria: string;
  confianca: number; // 0-100% de certeza que é recorrente
}

interface LembreteTransacao {
  id: string;
  descricao: string;
  data: string;
  valor: number;
  categoria: string;
  status: "pendente" | "realizado" | "atrasado";
}

interface ParcelaAberta {
  transacaoOriginalId: string;
  descricao: string;
  valorTotal: number;
  formaPagamento: string; // "parcela2x", etc.
  parcelaAtual: number;
  totalParcelas: number;
  valorParcela: number;
  proximoVencimento?: string;
  parcelasRestantes: number;
  valorRestante: number;
}
```

### **Componentes Frontend:**

- `PadroesDiariosChart` - Gráfico de gastos por dia da semana
- `RecorrenciasCard` - Lista de transações recorrentes identificadas
- `LembretesPanel` - Painel de lembretes e parcelas

---

## 🚀 **6. Quick Widgets (PRIORIDADE MÉDIA)**

### **Feature:** Widgets Rápidos para Dashboard

**Descrição:** Pequenos cards com informações instantâneas.

### **Endpoint Backend Necessário:**

```
GET /api/analytics/quick-stats
Query Parameters:
- ano: number (obrigatório)
- mes: number (obrigatório)
```

### **Estrutura de Resposta:**

```typescript
interface GetQuickStats {
  message: string;
  data: {
    gastoSemana: QuickStat;
    economiaMes: QuickStat;
    maiorCategoria: QuickStat;
    diasSemGastos: QuickStat;
    transacaoMaior: QuickStat;
    comparativoAno: QuickStat;
  };
}

interface QuickStat {
  titulo: string;
  valor: number | string;
  subtitulo?: string;
  variacao?: {
    valor: number;
    tipo: "positiva" | "negativa" | "neutra";
    periodo: string;
  };
  icone?: string;
  cor?: string;
}
```

### **Componentes Frontend:**

- `QuickStatCard` - Card pequeno reutilizável
- `QuickStatsGrid` - Grid com todos os widgets

---

## 📋 **Prioridades de Implementação Sugeridas:**

### **Fase 1 (Essencial):**

1. 🎯 Metas e Controle Orçamentário
2. 📊 Analytics por Categoria
3. 📈 Tendências e Métricas Avançadas

### **Fase 2 (Complementar):**

4. 🚀 Quick Widgets
5. 💳 Análise por Meio de Pagamento

### **Fase 3 (Avançado):**

6. 📅 Análise Temporal e Recorrência

---

## 🔧 **Considerações Técnicas:**

### **Performance:**

- Implementar cache para analytics pesados
- Usar índices no banco para consultas por data/categoria
- Considerar materialização de views para dados agregados

### **Configurações:**

- Permitir usuário configurar metas mensais
- Permitir desabilitar/habilitar widgets específicos
- Configuração de alertas personalizados

### **Responsividade:**

- Todos os componentes devem ser mobile-first
- Gráficos devem se adaptar ao tamanho da tela
- Quick widgets podem ser ocultados em mobile

**Esse roadmap te dá uma visão completa do que precisamos implementar. Qual endpoint/feature você gostaria de começar primeiro?** 🚀
