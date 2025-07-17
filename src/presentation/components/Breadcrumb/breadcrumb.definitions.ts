import { urlRouters } from "@/presentation/router/router.definitions";

export type CrumbKey = keyof typeof urlRouters;

export const crumbsMapper: Partial<
  Record<CrumbKey, { label: string; link: string }>
> = {
  root: {
    label: "Início",
    link: urlRouters.root,
  },
  people: {
    label: "Pessoas",
    link: urlRouters.people,
  },
  createPeople: {
    label: "Criar",
    link: urlRouters.createPeople,
  },
  editPeople: {
    label: "Editar",
    link: urlRouters.editPeople,
  },
};
