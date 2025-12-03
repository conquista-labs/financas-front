# Módulo de Patrimônio - Especificação Técnica

## Status da Implementação

### ✅ Backend - Concluído

- [x] API REST completa (CRUD)
- [x] Endpoint de resumo (`/resumo`)
- [x] Endpoint de evolução (`/evolucao`)
- [x] Job automático de snapshots mensais
- [x] Validações e regras de negócio

### ✅ Frontend - Models (Domain) - Concluído

- [x] Todos os models necessários criados
- [x] Types e interfaces definidos
- [x] Exportados no index.ts

### ✅ Frontend - Use Cases (Domain) - Concluído

- [x] 7 use cases criados e exportados
- [x] GetPatrimoniosUseCase
- [x] GetPatrimonioIdUseCase
- [x] PostPatrimonioUseCase
- [x] PatchPatrimonioIdUseCase
- [x] DeletePatrimonioIdUseCase
- [x] GetResumoPatrimonioUseCase
- [x] GetEvolucaoPatrimonioUseCase

### ✅ Frontend - Data Layer - Concluído

- [x] 7 implementações criadas
- [x] Integração com HTTP Client
- [x] Tratamento de erros (401, etc)
- [x] Seguindo padrão do projeto

### ✅ Frontend - Main Layer (Factories) - Concluído

- [x] 7 factories criadas e exportadas
- [x] makeGetPatrimoniosFactory
- [x] makeGetPatrimonioIdFactory
- [x] makePostPatrimonioFactory
- [x] makePatchPatrimonioFactory
- [x] makeDeletePatrimonioFactory
- [x] makeGetResumoPatrimonioFactory
- [x] makeGetEvolucaoPatrimonioFactory

### ✅ Frontend - Hooks React Query - Concluído

- [x] 7 hooks criados e exportados
- [x] useGetPatrimonios (query)
- [x] useGetPatrimonioId (query)
- [x] usePostPatrimonio (mutation)
- [x] usePatchPatrimonioId (mutation)
- [x] useDeletePatrimonioId (mutation)
- [x] useGetResumoPatrimonio (query)
- [x] useGetEvolucaoPatrimonio (query)

### ✅ Frontend - Página e Rota - Concluído

- [x] Página Patrimony criada com summary cards e lista
- [x] Rota `/patrimony` adicionada ao router
- [x] Integração com hooks funcionando
- [x] Estados de loading e empty implementados

### 🚧 Frontend - Em Desenvolvimento

- [ ] Componentes de formulário (criar/editar)
- [ ] Modal de cadastro/edição
- [ ] Gráficos de evolução e distribuição
- [ ] Validação com Yup

---

## 1. Visão Geral

O módulo de Patrimônio permite ao usuário gerenciar seus **ativos** (o que possui) e **passivos** (o que deve), fornecendo uma visão completa do patrimônio líquido e sua evolução ao longo do tempo.

### Princípios

- Cadastro manual de todos os patrimônios
- Atualização manual dos valores
- Snapshots mensais automáticos para histórico
- Simplicidade nas categorias
- Sem integração automática com transações (por enquanto)

---

## 2. Estrutura de Dados

### 2.1 Modelo Principal - Patrimonio

```typescript
// src/domain/models/patrimonio.ts
// ✅ JÁ IMPLEMENTADO

export interface Patrimonio {
  id: string;
  descricao: string; // Ex: "Apartamento Centro", "Fiat Uno 2020"
  tipo: Patrimonio.TipoEnum; // "ativo" | "passivo"
  categoria: Patrimonio.CategoriaEnum;
  valorAtual: number;
  valorInicial?: number; // Valor quando foi adquirido/contratado
  dataAquisicao: string; // ISO 8601 date
  observacoes?: string;

  // Campos específicos para PASSIVOS
  saldoDevedor?: number; // Quanto ainda falta pagar
  taxaJuros?: number; // Taxa de juros mensal (%)
  dataVencimento?: string; // Quando termina de pagar (ISO 8601)

  // Relacionamento
  pessoaId?: string; // ID da pessoa (opcional)

  createdAt: string;
  updatedAt: string;
}

export namespace Patrimonio {
  export type TipoEnum = "ativo" | "passivo";
  export const TipoEnum = {
    Ativo: "ativo" as TipoEnum,
    Passivo: "passivo" as TipoEnum,
  };

  export type CategoriaEnum =
    // ATIVOS
    | "imovel" // Imóveis (casa, apartamento, terreno)
    | "veiculo" // Veículos (carro, moto)
    | "investimento" // Investimentos genéricos
    | "disponivel" // Dinheiro disponível (contas)
    | "outros_ativos" // Outros ativos

    // PASSIVOS
    | "financiamento" // Financiamento de imóvel/veículo
    | "emprestimo" // Empréstimos pessoais
    | "divida" // Dívidas em geral
    | "outros_passivos"; // Outros passivos

  export const CategoriaEnum = {
    Imovel: "imovel" as CategoriaEnum,
    Veiculo: "veiculo" as CategoriaEnum,
    Investimento: "investimento" as CategoriaEnum,
    Disponivel: "disponivel" as CategoriaEnum,
    OutrosAtivos: "outros_ativos" as CategoriaEnum,
    Financiamento: "financiamento" as CategoriaEnum,
    Emprestimo: "emprestimo" as CategoriaEnum,
    Divida: "divida" as CategoriaEnum,
    OutrosPassivos: "outros_passivos" as CategoriaEnum,
  };
}
```

### 2.2 Modelos Auxiliares

```typescript
// src/domain/models/evolucao.ts
// ✅ JÁ IMPLEMENTADO

export interface Evolucao {
  mesAnterior: number; // Valor do mês anterior
  variacao: number; // Diferença em reais
  percentual: number; // Diferença em %
}
```

```typescript
// src/domain/models/distribuicaoItem.ts
// ✅ JÁ IMPLEMENTADO

export interface DistribuicaoItem {
  categoria: string;
  valor: number;
  percentual: number; // % do total
  quantidade: number; // Quantidade de itens
}
```

```typescript
// src/domain/models/serieItem.ts
// ✅ JÁ IMPLEMENTADO

export interface SerieItem {
  mesReferencia: string; // "YYYY-MM"
  totalAtivos: number;
  totalPassivos: number;
  patrimonioLiquido: number;
}
```

### 2.3 Resumo do Patrimônio

```typescript
// src/domain/models/resumoPatrimonio.ts
// ✅ JÁ IMPLEMENTADO

export interface ResumoPatrimonio {
  dataReferencia: string; // ISO 8601 date
  totalAtivos: number;
  totalPassivos: number;
  patrimonioLiquido: number; // totalAtivos - totalPassivos

  evolucao: Evolucao; // Evolução comparada ao mês anterior

  distribuicaoAtivos: Array<DistribuicaoItem>;
  distribuicaoPassivos: Array<DistribuicaoItem>;
}
```

### 2.4 Evolução do Patrimônio

```typescript
// src/domain/models/evolucaoPatrimonio.ts
// ✅ JÁ IMPLEMENTADO

export interface EvolucaoPatrimonio {
  dataInicio: string;
  dataFim: string;
  granularidade: string; // "mensal"

  series: Array<SerieItem>; // Série temporal
}
```

### 2.5 Paginação

```typescript
// src/domain/models/patrimonioPaginatedData.ts
// ✅ JÁ IMPLEMENTADO

export interface PatrimonioPaginatedData {
  meta: PaginationMeta;
  rows: Array<Patrimonio>;
}
```

---

## 3. Categorias Detalhadas

### 3.1 ATIVOS

#### Imóvel (`imovel`)

- Casa própria
- Apartamento
- Terreno
- Sala comercial
- Chácara/sítio

#### Veículo (`veiculo`)

- Carro
- Moto
- Caminhão
- Outros veículos

#### Investimento (`investimento`)

**Simplificado - Sem subcategorias. Exemplos:**

- Conta de investimento (corretora)
- FGTS
- Títulos do Tesouro
- Ações
- Fundos de investimento
- Previdência privada
- Criptomoedas

**Observação:** Valor atualizado manualmente pelo usuário

#### Disponível (`disponivel`)

- Conta corrente
- Poupança
- Dinheiro em espécie

**Observação:** Este pode ser obtido dos "Meios de Pagamento" existentes, mas por ora será cadastro manual independente.

#### Outros Ativos (`outros_ativos`)

- Equipamentos de valor
- Joias
- Coleções
- Qualquer outro ativo não categorizado

### 3.2 PASSIVOS

#### Financiamento (`financiamento`)

- Financiamento de imóvel
- Financiamento de veículo
- Outros financiamentos de bens

**Campos específicos:**

- Saldo devedor
- Taxa de juros
- Data de vencimento final

#### Empréstimo (`emprestimo`)

- Empréstimo pessoal
- Empréstimo consignado
- Empréstimo com família/amigos

**Campos específicos:**

- Saldo devedor
- Taxa de juros
- Data de vencimento

#### Dívida (`divida`)

- Cartão de crédito parcelado
- Cheque especial
- Outras dívidas

**Campos específicos:**

- Saldo devedor
- Taxa de juros (se aplicável)

#### Outros Passivos (`outros_passivos`)

- Qualquer outro passivo não categorizado

### 3.3 Relacionamento com Pessoa

O patrimônio pode opcionalmente estar associado a uma pessoa específica através do campo `pessoaId`. Isso permite:

- Rastrear patrimônios individuais em finanças compartilhadas
- Filtrar patrimônios por pessoa
- Gerar relatórios individualizados

**Comportamento:**

- Campo `pessoaId` é opcional
- Se não informado, o patrimônio é considerado compartilhado/geral
- Validação: `pessoaId` deve existir na tabela de pessoas

---

## 4. Use Cases (Domain Layer)

### 4.1 Estrutura de Pastas

```
src/domain/usecases/patrimonio/
├── index.ts
├── getPatrimonios/
│   ├── index.ts
│   └── getPatrimonios.ts
├── getPatrimonioId/
│   ├── index.ts
│   └── getPatrimonioId.ts
├── postPatrimonio/
│   ├── index.ts
│   └── postPatrimonio.ts
├── patchPatrimonioId/
│   ├── index.ts
│   └── patchPatrimonioId.ts
├── deletePatrimonioId/
│   ├── index.ts
│   └── deletePatrimonioId.ts
├── getResumoPatrimonio/
│   ├── index.ts
│   └── getResumoPatrimonio.ts
└── getEvolucaoPatrimonio/
    ├── index.ts
    └── getEvolucaoPatrimonio.ts
```

### 4.2 Use Case: GET Patrimônios

```typescript
// src/domain/usecases/patrimonio/getPatrimonios/getPatrimonios.ts

import type { GetPatrimoniosResponse } from "@/domain/models";

export interface GetPatrimoniosUseCase {
  get: (params: GetPatrimoniosParams) => Promise<GetPatrimoniosModel>;
}

export type GetPatrimoniosModel = GetPatrimoniosResponse;

export type GetPatrimoniosParams = {
  page?: number;
  limit?: number;
  tipo?: "ativo" | "passivo"; // Filtrar por tipo
  categoria?: string; // Filtrar por categoria
};

// Response Model - ✅ JÁ IMPLEMENTADO
export interface GetPatrimoniosResponse {
  message: string;
  data: PatrimonioPaginatedData;
}
```

### 4.3 Use Case: GET Patrimônio por ID

```typescript
// src/domain/usecases/patrimonio/getPatrimonioId/getPatrimonioId.ts

import type { GetPatrimonioResponse } from "@/domain/models";

export interface GetPatrimonioIdUseCase {
  get: (params: GetPatrimonioIdParams) => Promise<GetPatrimonioIdModel>;
}

export type GetPatrimonioIdModel = GetPatrimonioResponse;

export type GetPatrimonioIdParams = {
  id: string;
};

// Response Model - ✅ JÁ IMPLEMENTADO
export interface GetPatrimonioResponse {
  message: string;
  data: Patrimonio;
}
```

### 4.4 Use Case: POST Patrimônio

```typescript
// src/domain/usecases/patrimonio/postPatrimonio/postPatrimonio.ts

import type {
  CreatePatrimonioRequest,
  CreatePatrimonioResponse,
} from "@/domain/models";

export interface PostPatrimonioUseCase {
  post: (params: PostPatrimonioParams) => Promise<PostPatrimonioModel>;
}

export type PostPatrimonioModel = CreatePatrimonioResponse;
export type PostPatrimonioParams = CreatePatrimonioRequest;

// Request Model - ✅ JÁ IMPLEMENTADO
export interface CreatePatrimonioRequest {
  descricao: string;
  tipo: "ativo" | "passivo";
  categoria: string;
  valorAtual: number;
  valorInicial?: number;
  dataAquisicao: string;
  observacoes?: string;

  // Campos específicos para passivos
  saldoDevedor?: number;
  taxaJuros?: number;
  dataVencimento?: string;

  // Relacionamento
  pessoaId?: string;
}

// Response Model - ✅ JÁ IMPLEMENTADO
export interface CreatePatrimonioResponse {
  message: string;
  data: Patrimonio;
}
```

### 4.5 Use Case: PATCH Patrimônio

```typescript
// src/domain/usecases/patrimonio/patchPatrimonioId/patchPatrimonioId.ts

import type {
  EditPatrimonioRequest,
  EditPatrimonioResponse,
} from "@/domain/models";

export interface PatchPatrimonioIdUseCase {
  patch: (params: PatchPatrimonioIdParams) => Promise<PatchPatrimonioIdModel>;
}

export type PatchPatrimonioIdModel = EditPatrimonioResponse;

export type PatchPatrimonioIdParams = {
  id: string;
  data: EditPatrimonioRequest;
};

// Request Model - ✅ JÁ IMPLEMENTADO
export interface EditPatrimonioRequest {
  descricao?: string;
  tipo?: "ativo" | "passivo";
  categoria?: string;
  valorAtual?: number;
  valorInicial?: number;
  dataAquisicao?: string;
  observacoes?: string;

  // Campos específicos para passivos
  saldoDevedor?: number;
  taxaJuros?: number;
  dataVencimento?: string;

  // Relacionamento
  pessoaId?: string;
}

// Response Model - ✅ JÁ IMPLEMENTADO
export interface EditPatrimonioResponse {
  message: string;
  data: Patrimonio;
}
```

### 4.6 Use Case: DELETE Patrimônio

```typescript
// src/domain/usecases/patrimonio/deletePatrimonioId/deletePatrimonioId.ts

export interface DeletePatrimonioIdUseCase {
  delete: (params: DeletePatrimonioIdParams) => Promise<void>;
}

export type DeletePatrimonioIdParams = {
  id: string;
};

// Nota: DELETE retorna void (sem response body)
// Backend retorna apenas status 204 No Content
```

### 4.7 Use Case: GET Resumo do Patrimônio

```typescript
// src/domain/usecases/patrimonio/getResumoPatrimonio/getResumoPatrimonio.ts

import type { GetResumoPatrimonioResponse } from "@/domain/models";

export interface GetResumoPatrimonioUseCase {
  get: (params: GetResumoPatrimonioParams) => Promise<GetResumoPatrimonioModel>;
}

export type GetResumoPatrimonioModel = GetResumoPatrimonioResponse;

export type GetResumoPatrimonioParams = {
  dataReferencia?: string; // ISO 8601, default: hoje
};

// Response Model - ✅ JÁ IMPLEMENTADO (seção 2.3)
export interface GetResumoPatrimonioResponse {
  message: string;
  data: ResumoPatrimonio;
}
```

### 4.8 Use Case: GET Evolução do Patrimônio

```typescript
// src/domain/usecases/patrimonio/getEvolucaoPatrimonio/getEvolucaoPatrimonio.ts

import type { GetEvolucaoPatrimonioResponse } from "@/domain/models";

export interface GetEvolucaoPatrimonioUseCase {
  get: (
    params: GetEvolucaoPatrimonioParams,
  ) => Promise<GetEvolucaoPatrimonioModel>;
}

export type GetEvolucaoPatrimonioModel = GetEvolucaoPatrimonioResponse;

export type GetEvolucaoPatrimonioParams = {
  dataInicio: string; // ISO 8601
  dataFim: string; // ISO 8601
  granularidade?: "mensal"; // Por enquanto apenas mensal
};

// Response Model - ✅ JÁ IMPLEMENTADO (seção 2.4)
export interface GetEvolucaoPatrimonioResponse {
  message: string;
  data: EvolucaoPatrimonio;
}
```

---

## 5. Presentation Layer

### 5.1 Estrutura de Páginas

```
src/presentation/pages/Patrimony/
├── index.tsx                           # Página principal
├── Patrimony.types.ts                  # Types da página
├── Patrimony.styles.css                # Estilos da página
├── components/
│   ├── PatrimonyHeader/                # Header com botão adicionar
│   │   ├── index.tsx
│   │   ├── PatrimonyHeader.types.ts
│   │   └── PatrimonyHeader.styles.css
│   ├── PatrimonySummary/               # Cards de resumo (ativos, passivos, líquido)
│   │   ├── index.tsx
│   │   ├── PatrimonySummary.types.ts
│   │   └── PatrimonySummary.styles.css
│   ├── PatrimonyChart/                 # Gráfico de evolução temporal
│   │   ├── index.tsx
│   │   ├── PatrimonyChart.types.ts
│   │   └── PatrimonyChart.styles.css
│   ├── PatrimonyDistribution/          # Gráficos pizza (ativos/passivos)
│   │   ├── index.tsx
│   │   ├── PatrimonyDistribution.types.ts
│   │   └── PatrimonyDistribution.styles.css
│   ├── PatrimonyList/                  # Lista de patrimônios
│   │   ├── index.tsx
│   │   ├── PatrimonyList.types.ts
│   │   └── PatrimonyList.styles.css
│   ├── PatrimonyListItem/              # Item da lista
│   │   ├── index.tsx
│   │   ├── PatrimonyListItem.types.ts
│   │   └── PatrimonyListItem.styles.css
│   ├── PatrimonyForm/                  # Formulário criar/editar
│   │   ├── index.tsx
│   │   ├── PatrimonyForm.types.ts
│   │   ├── PatrimonyForm.styles.css
│   │   └── PatrimonyForm.definitions.ts
│   └── PatrimonyModal/                 # Modal para formulário
│       ├── index.tsx
│       ├── PatrimonyModal.types.ts
│       └── PatrimonyModal.styles.css
```

### 5.2 Hooks React Query ✅ IMPLEMENTADO

```
src/presentation/hooks/api/patrimonio/
├── index.ts
├── useGetPatrimonios/
│   ├── index.ts
│   ├── useGetPatrimonios.ts
│   └── useGetPatrimonios.types.ts
├── useGetPatrimonioId/
│   ├── index.ts
│   ├── useGetPatrimonioId.ts
│   └── useGetPatrimonioId.types.ts
├── usePostPatrimonio/
│   ├── index.ts
│   ├── usePostPatrimonio.tsx
│   └── usePostPatrimonio.types.ts
├── usePatchPatrimonioId/
│   ├── index.ts
│   ├── usePatchPatrimonioId.tsx
│   └── usePatchPatrimonioId.types.ts
├── useDeletePatrimonioId/
│   ├── index.ts
│   ├── useDeletePatrimonioId.tsx
│   └── useDeletePatrimonioId.types.ts
├── useGetResumoPatrimonio/
│   ├── index.ts
│   ├── useGetResumoPatrimonio.ts
│   └── useGetResumoPatrimonio.types.ts
└── useGetEvolucaoPatrimonio/
    ├── index.ts
    ├── useGetEvolucaoPatrimonio.ts
    └── useGetEvolucaoPatrimonio.types.ts
```

### 5.3 Exemplos de Hooks Implementados

#### Query Hook (GET)

```typescript
// src/presentation/hooks/api/patrimonio/useGetPatrimonios/useGetPatrimonios.ts

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type {
  GetPatrimoniosModel,
  GetPatrimoniosParams,
} from "@/domain/usecases";
import { makeGetPatrimoniosFactory } from "@/main/factories/usecases";
import type { UseGetPatrimoniosOptions } from "./useGetPatrimonios.types";

export const useGetPatrimonios = (
  params?: GetPatrimoniosParams,
  options?: UseGetPatrimoniosOptions,
): UseQueryResult<GetPatrimoniosModel, unknown> => {
  const getPatrimonios = makeGetPatrimoniosFactory();

  return useQuery({
    queryKey: ["get-patrimonios", params],
    queryFn: async () => {
      try {
        return await getPatrimonios.get(params || {});
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });
};
```

#### Mutation Hook (POST)

```typescript
// src/presentation/hooks/api/patrimonio/usePostPatrimonio/usePostPatrimonio.tsx

import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useToast } from "@rarui-react/components/dist/Toast";
import { makePostPatrimonioFactory } from "@/main/factories/usecases";
import type {
  PostPatrimonioParams,
  PostPatrimonioModel,
} from "@/domain/usecases";
import type { UsePostPatrimonioOptions } from "./usePostPatrimonio.types";

export const usePostPatrimonio = (
  options?: UsePostPatrimonioOptions,
): UseMutationResult<PostPatrimonioModel, AxiosError, PostPatrimonioParams> => {
  const { addToast } = useToast();
  const postPatrimonio = makePostPatrimonioFactory();
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationKey: ["post-patrimonio"],
    mutationFn: (body: PostPatrimonioParams) => postPatrimonio.post(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-patrimonios"] });
      queryClient.invalidateQueries({ queryKey: ["get-resumo-patrimonio"] });
    },
    onError: (error) => {
      addToast({
        title: error.message,
        appearance: "error",
        variant: "solid",
        duration: 4000,
      });
    },
  });
};
```

**Recursos Implementados nos Hooks:**

- ✅ Invalidação automática de queries relacionadas após mutations
- ✅ Toast de erro automático para mutations
- ✅ Types completos para cada hook
- ✅ Options customizáveis via parâmetros
- ✅ Seguindo padrão do projeto

---

## 6. Interface Visual (UI)

### 6.1 Tela Principal - Dashboard

```
┌───────────────────────────────────────────────────────────────┐
│  💼 Patrimônio                            [+ Adicionar]        │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  📊 Resumo Geral                                               │
│  ┌──────────────────┬──────────────────┬──────────────────┐   │
│  │   💰 Ativos      │   💳 Passivos    │  💎 Líquido      │   │
│  │   R$ 250.000,00  │   R$ 80.000,00   │  R$ 170.000,00   │   │
│  │   ↑ +5,2%        │   ↓ -2,1%        │   ↑ +8,3%        │   │
│  └──────────────────┴──────────────────┴──────────────────┘   │
│                                                                │
│  📈 Evolução do Patrimônio (últimos 12 meses)                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  [Gráfico de linha - Patrimônio Líquido ao longo do    │   │
│  │   tempo, mostrando ativos, passivos e líquido]         │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  📊 Distribuição                                               │
│  ┌──────────────────────┬──────────────────────────────┐      │
│  │  Ativos              │  Passivos                    │      │
│  │  [Gráfico Pizza]     │  [Gráfico Pizza]             │      │
│  │  - Imóveis 72%       │  - Financiamentos 100%       │      │
│  │  - Veículos 18%      │                              │      │
│  │  - Investimentos 10% │                              │      │
│  └──────────────────────┴──────────────────────────────┘      │
│                                                                │
│  [Tabs: 📋 Todos | 💰 Ativos | 💳 Passivos]                    │
│                                                                │
│  🏠 Imóveis                                   R$ 180.000,00    │
│  ├─ 🏠 Apartamento São Paulo                 R$ 180.000,00    │
│  │   Adquirido em 15/01/2020                                  │
│  │   [✏️ Editar] [🗑️ Deletar] [👁️ Detalhes]                 │
│                                                                │
│  🚗 Veículos                                  R$ 45.000,00     │
│  ├─ 🚗 Fiat Uno 2020                         R$ 45.000,00     │
│  │   Adquirido em 10/03/2020                                  │
│  │   [✏️ Editar] [🗑️ Deletar] [👁️ Detalhes]                 │
│                                                                │
│  💰 Investimentos                             R$ 25.000,00     │
│  ├─ 💰 Tesouro Direto                        R$ 15.000,00     │
│  │   Adquirido em 01/01/2021                                  │
│  ├─ 💰 Conta Investimento XP                 R$ 10.000,00     │
│  │   Adquirido em 05/05/2021                                  │
│                                                                │
│  💳 Financiamentos                            R$ 80.000,00     │
│  ├─ 💳 Financiamento Imóvel                  R$ 80.000,00     │
│  │   Vencimento: 15/01/2035                                   │
│  │   Taxa: 0,8% a.m. | Faltam 120 meses                       │
│  │   [✏️ Editar] [🗑️ Deletar] [👁️ Detalhes]                 │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

### 6.2 Modal de Cadastro/Edição

```
┌─────────────────────────────────────────────────────┐
│  [X] Adicionar Patrimônio                            │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Tipo *                                              │
│  [ ] Ativo    [X] Passivo                            │
│                                                      │
│  Categoria *                                         │
│  [Dropdown: Financiamento ▼]                         │
│                                                      │
│  Descrição *                                         │
│  [_____________________________________]             │
│                                                      │
│  Valor Atual *                                       │
│  [R$ _____________]                                  │
│                                                      │
│  Valor Inicial                                       │
│  [R$ _____________]                                  │
│                                                      │
│  Data de Aquisição *                                 │
│  [📅 __/__/____]                                     │
│                                                      │
│  ─────── Campos Específicos de Passivo ─────────    │
│                                                      │
│  Saldo Devedor *                                     │
│  [R$ _____________]                                  │
│                                                      │
│  Taxa de Juros (% a.m.)                              │
│  [_____%]                                            │
│                                                      │
│  Data de Vencimento                                  │
│  [📅 __/__/____]                                     │
│                                                      │
│  ──────────────────────────────────────────────     │
│                                                      │
│  Observações                                         │
│  [_____________________________________]             │
│  [_____________________________________]             │
│  [_____________________________________]             │
│                                                      │
│                     [Cancelar]  [Salvar]             │
└─────────────────────────────────────────────────────┘
```

**Comportamento Dinâmico:**

- Quando seleciona "Passivo", campos específicos aparecem (saldo devedor, taxa de juros, data vencimento)
- Categorias mudam baseado no tipo selecionado

### 6.3 Ícones RarUI Recomendados

Consultando a galeria: https://rarui.rarolabs.com.br/docs/icones/galeria

```typescript
import {
  // Navegação e ações
  AddIcon,
  EditOutlinedIcon,
  DeleteOutlinedIcon,
  VisibilityOutlinedIcon,
  CloseIcon,

  // Patrimônio
  HomeOutlinedIcon, // Imóveis
  DirectionsCarOutlinedIcon, // Veículos
  AccountBalanceOutlinedIcon, // Investimentos
  WalletOutlinedIcon, // Disponível
  CreditCardOutlinedIcon, // Passivos

  // Gráficos e estatísticas
  TrendingUpIcon,
  TrendingDownIcon,
  ShowChartOutlinedIcon,
  PieChartOutlinedIcon,

  // Calendário
  CalendarTodayOutlinedIcon,
} from "@rarui/icons";
```

---

## 7. Validação de Formulário

### 7.1 Schema Yup

```typescript
// src/presentation/pages/Patrimony/components/PatrimonyForm/PatrimonyForm.definitions.ts

import * as yup from "yup";

export const patrimonioSchema = yup.object({
  tipo: yup.string().oneOf(["ativo", "passivo"]).required("Tipo é obrigatório"),

  categoria: yup.string().required("Categoria é obrigatória"),

  descricao: yup
    .string()
    .required("Descrição é obrigatória")
    .min(3, "Descrição deve ter no mínimo 3 caracteres")
    .max(100, "Descrição deve ter no máximo 100 caracteres"),

  valorAtual: yup
    .number()
    .required("Valor atual é obrigatório")
    .positive("Valor atual deve ser positivo"),

  valorInicial: yup
    .number()
    .nullable()
    .positive("Valor inicial deve ser positivo"),

  dataAquisicao: yup.string().required("Data de aquisição é obrigatória"),

  observacoes: yup
    .string()
    .nullable()
    .max(500, "Observações devem ter no máximo 500 caracteres"),

  // Campos de passivo
  saldoDevedor: yup
    .number()
    .nullable()
    .when("tipo", {
      is: "passivo",
      then: (schema) =>
        schema.required("Saldo devedor é obrigatório para passivos"),
    })
    .positive("Saldo devedor deve ser positivo"),

  taxaJuros: yup
    .number()
    .nullable()
    .min(0, "Taxa de juros não pode ser negativa")
    .max(100, "Taxa de juros não pode ser maior que 100%"),

  dataVencimento: yup
    .string()
    .nullable()
    .when("tipo", {
      is: "passivo",
      then: (schema) =>
        schema.test(
          "data-futura",
          "Data de vencimento deve ser futura",
          (value) => {
            if (!value) return true;
            return new Date(value) > new Date();
          },
        ),
    }),
});

export type PatrimonioFormData = yup.InferType<typeof patrimonioSchema>;
```

---

## 8. Lógica de Snapshots Mensais

### 8.1 Backend - Job Automático ✅

**Implementado:** Backend já possui job automático (cron) que roda no primeiro dia de cada mês para criar snapshots de todos os patrimônios.

```
Cron: 0 0 1 * * (Às 00:00 do dia 1 de cada mês)

Para cada patrimônio:
  - Pegar valor atual (valorAtual)
  - Criar registro na tabela de snapshots
    - patrimonioId
    - valor (valorAtual do momento)
    - mesReferencia (YYYY-MM do mês anterior)
```

### 8.2 Uso dos Snapshots

Os snapshots são utilizados internamente pelo backend para:

- Calcular a evolução mensal (endpoint `/resumo`)
- Gerar série temporal (endpoint `/evolucao`)
- Comparar patrimônio líquido entre períodos

### 8.3 Frontend - Visualização

O frontend consome os dados já processados pelos endpoints:

- **Resumo**: `/api/patrimonios/resumo` - inclui evolução vs mês anterior
- **Evolução**: `/api/patrimonios/evolucao` - série temporal completa

Não há necessidade de endpoint de histórico específico, pois os dados já vêm agregados.

---

## 9. Integração com Outros Módulos

### 9.1 Meios de Pagamento

**Situação Atual:**

- Saldos de contas correntes/poupança já existem no módulo "Meios de Pagamento"

**Estratégia:**

- Por enquanto, o usuário cadastrará manualmente no módulo Patrimônio se quiser incluir na visão geral
- Categoria sugerida: `disponivel`
- Futuramente: integração automática para evitar duplicação

### 9.2 Transações

**Situação Atual:**

- Transações de parcelas de financiamento NÃO são lançadas automaticamente

**Estratégia:**

- Parcelas de financiamento devem ser lançadas manualmente pelo usuário como transações recorrentes se desejado
- Módulo de Patrimônio apenas rastreia o saldo devedor total

### 9.3 Analytics

**Nova Seção:**

- Adicionar card/gráfico no analytics mostrando evolução do patrimônio líquido
- Comparar patrimônio com receitas/despesas mensais

---

## 10. Rotas

### 10.1 Frontend

```typescript
// src/main/routes/index.tsx

{
  path: "/patrimonio",
  element: <PatrimonyPage />,
}
```

### 10.2 Backend (Referência)

```
GET    /api/patrimonios                    # Listar patrimônios
GET    /api/patrimonios/:id                # Buscar por ID
POST   /api/patrimonios                    # Criar patrimônio
PATCH  /api/patrimonios/:id                # Atualizar patrimônio
DELETE /api/patrimonios/:id                # Deletar patrimônio

GET    /api/patrimonios/resumo             # Resumo geral
GET    /api/patrimonios/evolucao           # Evolução temporal
GET    /api/patrimonios/:id/historico      # Histórico de snapshots
```

---

## 11. Regras de Negócio

### 11.1 Validações

1. **Valor Atual:**
   - Sempre obrigatório
   - Deve ser maior que zero
   - Para ativos, representa o valor estimado atual
   - Para passivos, pode ser diferente do saldo devedor (valor original vs saldo restante)

2. **Saldo Devedor (Passivos):**
   - Obrigatório para passivos
   - Deve ser menor ou igual ao valor inicial (se informado)
   - Deve ser maior que zero

3. **Data de Vencimento (Passivos):**
   - Deve ser futura
   - Opcional

4. **Taxa de Juros:**
   - Entre 0% e 100%
   - Opcional

5. **Depreciação/Valorização:**
   - Atualização manual pelo usuário
   - Sem cálculo automático

### 11.2 Cálculos

```typescript
// Patrimônio Líquido
patrimonioLiquido = totalAtivos - totalPassivos;

// Variação Percentual
variacaoPercentual = ((valorAtual - valorMesAnterior) / valorMesAnterior) * 100;

// Percentual de uma Categoria
percentualCategoria = (valorCategoria / totalAtivos) * 100;
```

---

## 12. Testes

### 12.1 Testes Unitários

**Domain Use Cases:**

- Validar interfaces dos use cases
- Validar types dos parâmetros

**Data Layer:**

- Mock de chamadas HTTP
- Validar transformação de dados
- Validar tratamento de erros

**Presentation Hooks:**

- Mock de react-query
- Validar chamadas aos use cases
- Validar estados de loading/error

### 12.2 Testes de Componentes

**PatrimonyForm:**

- Validação de campos obrigatórios
- Validação dinâmica (campos de passivo aparecem/desaparecem)
- Submit válido/inválido

**PatrimonyList:**

- Renderização correta dos itens
- Filtros funcionando
- Ações (editar, deletar)

**PatrimonySummary:**

- Cálculo correto dos totais
- Exibição de variação percentual
- Cores baseadas em tendência (verde/vermelho)

---

## 13. Melhorias Futuras (Fora do Escopo Inicial)

### 13.1 Curto Prazo

- [ ] Integração automática com "Meios de Pagamento" para saldos disponíveis
- [ ] Exportar relatório de patrimônio (PDF/Excel)
- [ ] Gráfico de evolução por categoria específica
- [ ] Tags/etiquetas personalizadas

### 13.2 Médio Prazo

- [ ] Lançamento automático de parcelas de financiamento como transações
- [ ] Alertas de vencimento de dívidas
- [ ] Calculadora de juros compostos
- [ ] Projeção de quitação de dívidas

### 13.3 Longo Prazo

- [ ] Integração com APIs de cotação (B3, criptomoedas)
- [ ] Atualização automática de valores de investimentos
- [ ] Cálculo automático de depreciação de veículos (tabela FIPE)
- [ ] Dashboard comparativo (patrimônio vs metas)
- [ ] Histórico de transações que impactaram patrimônio
- [ ] IA para sugestões de otimização patrimonial

---

## 14. Checklist de Implementação

### Backend ✅

- [x] Criar migrations para tabelas `patrimonios` e `patrimonio_snapshots`
- [x] Implementar CRUD de patrimônios
- [x] Implementar endpoint de resumo
- [x] Implementar endpoint de evolução
- [x] Implementar job de snapshots mensais
- [x] Testes unitários dos services
- [x] Testes de integração dos endpoints

### Frontend - Domain Layer ✅

- [x] Criar models em `src/domain/models/`
  - [x] patrimonio.ts
  - [x] createPatrimonioRequest.ts
  - [x] createPatrimonioResponse.ts
  - [x] editPatrimonioRequest.ts
  - [x] editPatrimonioResponse.ts
  - [x] getPatrimoniosResponse.ts
  - [x] getPatrimonioResponse.ts
  - [x] patrimonioPaginatedData.ts
  - [x] resumoPatrimonio.ts
  - [x] getResumoPatrimonioResponse.ts
  - [x] evolucaoPatrimonio.ts
  - [x] getEvolucaoPatrimonioResponse.ts
  - [x] evolucao.ts
  - [x] distribuicaoItem.ts
  - [x] serieItem.ts
- [x] Criar use cases em `src/domain/usecases/patrimonio/`
  - [x] getPatrimonios/getPatrimonios.ts
  - [x] getPatrimonioId/getPatrimonioId.ts
  - [x] postPatrimonio/postPatrimonio.ts
  - [x] patchPatrimonioId/patchPatrimonioId.ts
  - [x] deletePatrimonioId/deletePatrimonioId.ts
  - [x] getResumoPatrimonio/getResumoPatrimonio.ts
  - [x] getEvolucaoPatrimonio/getEvolucaoPatrimonio.ts
- [x] Exportar use cases em `index.ts`

### Frontend - Data Layer ✅

- [x] Implementar use cases concretos em `src/data/usecases/patrimonio/`
  - [x] GetPatrimonios
  - [x] GetPatrimonioId
  - [x] PostPatrimonio
  - [x] PatchPatrimonioId
  - [x] DeletePatrimonioId
  - [x] GetResumoPatrimonio
  - [x] GetEvolucaoPatrimonio
- [x] Criar protocols HTTP (usando HttpClient existente)

### Frontend - Infra Layer ✅

- [x] Endpoints configurados via factories (não requer mudanças no HTTP client)

### Frontend - Main Layer ✅

- [x] Criar factories dos use cases em `src/main/factories/usecases/patrimonio/`
  - [x] makeGetPatrimoniosFactory
  - [x] makeGetPatrimonioIdFactory
  - [x] makePostPatrimonioFactory
  - [x] makePatchPatrimonioFactory
  - [x] makeDeletePatrimonioFactory
  - [x] makeGetResumoPatrimonioFactory
  - [x] makeGetEvolucaoPatrimonioFactory
- [x] Exportar factories em `index.ts`
- [x] Adicionar rota em `src/presentation/router/`

### Frontend - Presentation Layer (Hooks) ✅

- [x] Implementar hooks React Query em `src/presentation/hooks/api/patrimonio/`
  - [x] useGetPatrimonios
  - [x] useGetPatrimonioId
  - [x] usePostPatrimonio
  - [x] usePatchPatrimonioId
  - [x] useDeletePatrimonioId
  - [x] useGetResumoPatrimonio
  - [x] useGetEvolucaoPatrimonio
- [x] Exportar hooks em `index.ts`

### Frontend - Presentation Layer (UI) 🚧

- [x] Criar estrutura de páginas `src/presentation/pages/Patrimony/`
- [x] Criar página principal com:
  - [x] Breadcrumb
  - [x] Header com botão adicionar
  - [x] Summary cards (Ativos/Passivos/Líquido)
  - [x] Lista de patrimônios
  - [x] Estados de loading/empty
- [ ] Criar componentes adicionais:
  - [ ] PatrimonyChart (gráfico de evolução)
  - [ ] PatrimonyDistribution (gráficos de distribuição)
  - [ ] PatrimonyForm (formulário)
  - [ ] PatrimonyModal (modal)
- [ ] Implementar validação com Yup
- [ ] Adicionar filtros e tabs
- [ ] Testes de componentes

### Integração

- [ ] Testar fluxo completo
- [ ] Ajustar responsividade
- [ ] Validar acessibilidade
- [ ] Documentar uso

---

## 15. Referências

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [RarUI Design System](https://rarui.rarolabs.com.br/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Yup Validation](https://github.com/jquense/yup)

---

**Última Atualização:** 2024-01-XX
**Versão:** 1.0.0
**Autor:** Squad Finanças M&J
