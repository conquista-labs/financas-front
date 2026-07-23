import { urlRouters } from "@/presentation/router/router.definitions";

export type CrumbKey = keyof typeof urlRouters;

export const crumbsMapper: Partial<
  Record<CrumbKey, { label: string; link: string }>
> = {
  root: {
    label: "Início",
    link: urlRouters.root,
  },
  calendar: {
    label: "Calendário",
    link: urlRouters.calendar,
  },
  transactions: {
    label: "Transações",
    link: urlRouters.transactions,
  },
  createTransactions: {
    label: "Criar",
    link: urlRouters.createTransactions,
  },
  editTransactions: {
    label: "Editar",
    link: urlRouters.editTransactions,
  },
  registers: {
    label: "Cadastros",
    link: urlRouters.registers,
  },
  patrimony: {
    label: "Patrimônio",
    link: urlRouters.patrimony,
  },
};
