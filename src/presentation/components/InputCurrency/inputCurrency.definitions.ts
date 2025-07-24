export const formatCurrency = (value: string) => {
  const onlyDigits = value.replace(/\D/g, "");
  const numeric = parseFloat(onlyDigits) / 100;

  return isNaN(numeric)
    ? ""
    : new Intl.NumberFormat("pt-BR", {
        currency: "BRL",
        minimumFractionDigits: 2,
      }).format(numeric);
};
