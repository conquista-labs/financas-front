# 🛠️ Utils - Funções de Formatação

Funções utilitárias consolidadas para formatação de dados na Home page.

## 📚 Funções Disponíveis

### 💰 Formatação de Moeda

```typescript
formatCurrency(value: number): string
```

Formata um valor numérico como moeda brasileira (BRL).

**Exemplo:**

```typescript
formatCurrency(1234.56); // "R$ 1.234,56"
formatCurrency(0); // "R$ 0,00"
formatCurrency(-500.25); // "-R$ 500,25"
```

---

### 📅 Formatação de Datas/Meses

#### `formatMonthShort`

```typescript
formatMonthShort(mes: string): string
```

Formata "YYYY-MM" para "MM/YY".

**Exemplo:**

```typescript
formatMonthShort("2025-07"); // "07/25"
formatMonthShort("2024-12"); // "12/24"
```

#### `formatMonthLong`

```typescript
formatMonthLong(mes: string): string
```

Formata "YYYY-MM" para o nome do mês por extenso.

**Exemplo:**

```typescript
formatMonthLong("2025-07"); // "Julho"
formatMonthLong("2025-01"); // "Janeiro"
```

#### `formatMonthAbbr`

```typescript
formatMonthAbbr(mes: string): string
```

Formata "YYYY-MM" para abreviação de 3 letras.

**Exemplo:**

```typescript
formatMonthAbbr("2025-07"); // "jul"
formatMonthAbbr("2025-01"); // "jan"
```

---

### 📊 Formatação de Percentuais

```typescript
formatPercentage(value: number, decimals?: number): string
```

Formata um número como porcentagem.

**Exemplo:**

```typescript
formatPercentage(85.456); // "85.5%"
formatPercentage(85.456, 2); // "85.46%"
formatPercentage(100, 0); // "100%"
```

---

### 🎨 Funções de Cor/Status

#### `getColorByThreshold`

```typescript
getColorByThreshold(valor: number, teto?: number): string
```

Determina a cor com base no valor em relação ao teto.

**Lógica:**

- Sem teto: `$primary`
- Valor >= teto: `$error`
- Valor > 85% do teto: `$warning-alt`
- Valor < 85% do teto: `$primary`

**Exemplo:**

```typescript
getColorByThreshold(1000, 1000); // "$error" (100%)
getColorByThreshold(950, 1000); // "$warning-alt" (95%)
getColorByThreshold(800, 1000); // "$primary" (80%)
getColorByThreshold(500); // "$primary" (sem teto)
```

#### `getColorBySign`

```typescript
getColorBySign(value: number): string
```

Determina a cor com base se o valor é positivo ou negativo.

**Exemplo:**

```typescript
getColorBySign(100); // "$success"
getColorBySign(-50); // "$error"
getColorBySign(0); // "$success"
```

---

### 📈 Ícones e Indicadores

```typescript
getTrendIcon(tendencia: string): string
```

Retorna ícone emoji baseado no status de tendência.

**Exemplo:**

```typescript
getTrendIcon("alta"); // "↗️"
getTrendIcon("baixa"); // "↘️"
getTrendIcon("estavel"); // "→"
```

---

### 🔤 Formatação de Texto

```typescript
capitalize(str: string): string
```

Capitaliza a primeira letra de uma string.

**Exemplo:**

```typescript
capitalize("janeiro"); // "Janeiro"
capitalize("teste"); // "Teste"
```

---

## 📝 Uso

### Importação

```typescript
import {
  formatCurrency,
  formatMonthLong,
  getColorByThreshold,
} from "@/presentation/pages/Home/utils";
```

### Exemplo Prático

```typescript
// Em uma definição de coluna de tabela
columns.setColum("Valor", "valor", {
  formatter: (field, row) => {
    const color = getColorByThreshold(field, row.limite);
    return (
      <Text color={color}>
        {formatCurrency(field)}
      </Text>
    );
  },
});
```

---

## ♻️ Migração

### Antes (código duplicado)

```typescript
// Em múltiplos arquivos diferentes:

// Arquivo 1
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Arquivo 2
const getColorByTeto = (valor: number, teto?: number) => {
  if (!teto) return "$primary";
  if (valor >= teto) return "$error";
  // ...
};

// Arquivo 3
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
```

### Depois (consolidado)

```typescript
import {
  formatCurrency,
  getColorByThreshold,
  capitalize,
} from "@/presentation/pages/Home/utils";
```

---

## ✅ Benefícios

1. **DRY (Don't Repeat Yourself)** - Zero duplicação de código
2. **Manutenibilidade** - Mudanças em um único lugar
3. **Consistência** - Formatação uniforme em toda a aplicação
4. **Testabilidade** - Funções puras facilmente testáveis
5. **Documentação** - JSDoc completo em todas as funções
6. **Type Safety** - TypeScript garantindo tipos corretos

---

## 🧪 Testing

Todas as funções são puras (sem side effects), facilitando testes unitários:

```typescript
import { formatCurrency, getColorByThreshold } from "./formatters";

describe("formatCurrency", () => {
  it("should format positive values", () => {
    expect(formatCurrency(1234.56)).toBe("R$ 1.234,56");
  });

  it("should format negative values", () => {
    expect(formatCurrency(-500)).toBe("-R$ 500,00");
  });
});
```

---

## 🔄 Compatibilidade

O arquivo `home.definitions.ts` foi mantido por compatibilidade:

```typescript
// home.definitions.ts
export { formatCurrency, formatMonthShort as formatMonth } from "./utils";
```

**Recomendação:** Migre gradualmente para importar diretamente de `./utils`.
