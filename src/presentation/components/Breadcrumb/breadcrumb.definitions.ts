import { urlRouters } from "@/presentation/router/router.definitions";

export type CrumbKey = keyof typeof urlRouters;

export const crumbsMapper: Partial<
  Record<CrumbKey, { label: string; link: string }>
> = {
  root: {
    label: "Início",
    link: urlRouters.root,
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
};
