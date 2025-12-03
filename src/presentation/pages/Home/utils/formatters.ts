/**
 * Funções utilitárias de formatação para a Home page
 * Centralizadas para evitar duplicação de código
 */

/**
 * Formata um valor numérico como moeda brasileira (BRL)
 * @param value - Valor numérico a ser formatado
 * @returns String formatada como "R$ 1.234,56"
 * @example
 * formatCurrency(1234.56) // "R$ 1.234,56"
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
};

/**
 * Formata uma string de data "YYYY-MM" para o formato "MM/YY"
 * @param mes - String no formato "YYYY-MM"
 * @returns String formatada como "MM/YY"
 * @example
 * formatMonthShort("2025-07") // "07/25"
 */
export const formatMonthShort = (mes: string): string => {
  const [year, month] = mes.split("-");
  return `${month}/${year.slice(2)}`;
};

/**
 * Formata uma string de data "YYYY-MM" para o nome do mês por extenso
 * @param mes - String no formato "YYYY-MM"
 * @returns Nome do mês capitalizado
 * @example
 * formatMonthLong("2025-07") // "Julho"
 */
export const formatMonthLong = (mes: string): string => {
  const [year, month] = mes.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  const monthName = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
    date,
  );
  return capitalize(monthName);
};

/**
 * Formata uma string de data "YYYY-MM" para abreviação de 3 letras (jan, fev, etc)
 * @param mes - String no formato "YYYY-MM"
 * @returns Abreviação do mês em minúsculas
 * @example
 * formatMonthAbbr("2025-07") // "jul"
 */
export const formatMonthAbbr = (mes: string): string => {
  const [year, month] = mes.split("-");
  return new Date(Number(year), Number(month) - 1)
    .toLocaleString("pt-BR", { month: "short" })
    .toLowerCase()
    .replace(".", "");
};

/**
 * Capitaliza a primeira letra de uma string
 * @param str - String a ser capitalizada
 * @returns String com primeira letra maiúscula
 * @example
 * capitalize("janeiro") // "Janeiro"
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Formata um número como porcentagem
 * @param value - Valor numérico (0-100)
 * @param decimals - Número de casas decimais (padrão: 1)
 * @returns String formatada como "X.X%"
 * @example
 * formatPercentage(85.456, 1) // "85.5%"
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1,
): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Determina a cor com base no valor em relação ao teto
 * @param valor - Valor atual
 * @param teto - Valor máximo (opcional)
 * @returns Token de cor do design system
 * @example
 * getColorByThreshold(950, 1000) // "$warning-alt" (95% do teto)
 */
export const getColorByThreshold = (valor: number, teto?: number): string => {
  if (!teto) return "$primary";
  if (valor >= teto) return "$error";
  if (valor > teto * 0.85) return "$warning-alt";
  return "$primary";
};

/**
 * Determina a cor com base se o valor é positivo ou negativo
 * @param value - Valor numérico
 * @returns Token de cor do design system
 * @example
 * getColorBySign(100) // "$success"
 * getColorBySign(-50) // "$error"
 */
export const getColorBySign = (value: number): string => {
  return value >= 0 ? "$success" : "$error";
};

/**
 * Determina ícone de tendência baseado no status
 * @param tendencia - Status da tendência ("alta", "baixa", ou outro)
 * @returns Ícone emoji representando a tendência
 * @example
 * getTrendIcon("alta") // "↗️"
 */
export const getTrendIcon = (tendencia: string): string => {
  if (tendencia === "alta") return "↗️";
  if (tendencia === "baixa") return "↘️";
  return "→";
};
