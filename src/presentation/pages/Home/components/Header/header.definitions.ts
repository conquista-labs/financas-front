import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const getLastUpdate = (atualizadoEm: string) => {
  const data = new Date(atualizadoEm);

  const hora = format(data, "HH:mm");
  const distancia = formatDistanceToNow(data, {
    addSuffix: true,
    locale: ptBR,
  });

  return `${hora} (${distancia})`;
};
