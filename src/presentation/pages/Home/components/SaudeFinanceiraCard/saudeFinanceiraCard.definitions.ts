export const getStatusInfo = (status: string): any => {
  switch (status) {
    case "excelente":
      return {
        emoji: "🌟",
        corFundo: "$success",
        corTexto: "$on-success",
        corProgress: "$success",
        titulo: "Excelente",
        descricao: "Suas finanças estão em ótimo estado!",
      };
    case "saudavel":
      return {
        emoji: "✅",
        corFundo: "$success",
        corTexto: "$on-success",
        corProgress: "$success",
        titulo: "Saudável",
        descricao: "Você está no caminho certo!",
      };
    case "atencao":
      return {
        emoji: "⚠️",
        corFundo: "$warning",
        corTexto: "$on-warning",
        corProgress: "$warning",
        titulo: "Atenção",
        descricao: "Alguns pontos precisam de atenção.",
      };
    case "critico":
      return {
        emoji: "🚨",
        corFundo: "$error",
        corTexto: "$on-error",
        corProgress: "$error",
        titulo: "Crítico",
        descricao: "É hora de revisar seus gastos.",
      };
    default:
      return {
        emoji: "📊",
        corFundo: "$secondary",
        corTexto: "$primary",
        corProgress: "$secondary",
        titulo: "Analisando",
        descricao: "Analisando sua situação financeira.",
      };
  }
};
