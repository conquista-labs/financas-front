import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatMonth = (mes: string) => {
  // Formata "2025-07" para "07/25"
  const [year, month] = mes.split("-");
  return `${month}/${year.slice(2)}`;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
};

export const getLastUpdate = (atualizadoEm: string) => {
  console.log(atualizadoEm);
  const data = new Date(atualizadoEm);

  const hora = format(data, "HH:mm");
  const distancia = formatDistanceToNow(data, {
    addSuffix: true,
    locale: ptBR,
  });

  return `${hora} (${distancia})`;
};
