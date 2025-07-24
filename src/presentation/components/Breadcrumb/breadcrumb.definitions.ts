import { urlRouters } from "@/presentation/router/router.definitions";

export type CrumbKey = keyof typeof urlRouters;

export const crumbsMapper: Partial<
  Record<CrumbKey, { label: string; link: string }>
> = {
  root: {
    label: "Início",
    link: urlRouters.root,
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
  peoples: {
    label: "Pessoas",
    link: urlRouters.peoples,
  },
  createPeoples: {
    label: "Criar",
    link: urlRouters.createPeoples,
  },
  editPeoples: {
    label: "Editar",
    link: urlRouters.editPeoples,
  },
  categories: {
    label: "Categorias",
    link: urlRouters.categories,
  },
  createCategories: {
    label: "Criar",
    link: urlRouters.createCategories,
  },
  editCategories: {
    label: "Editar",
    link: urlRouters.editCategories,
  },
  meansOfPayment: {
    label: "Meios de pagamento",
    link: urlRouters.meansOfPayment,
  },
  createMeansOfPayment: {
    label: "Criar",
    link: urlRouters.createMeansOfPayment,
  },
  editMeansOfPayment: {
    label: "Editar",
    link: urlRouters.editMeansOfPayment,
  },
};
