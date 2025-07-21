export const formatMonth = (mes: string) => {
  // Formata "2025-07" para "07/25"
  const [year, month] = mes.split("-");
  return `${month}/${year.slice(2)}`;
};
