import { object, string } from "yup";

/** Paleta fixa do color picker de categoria (fiel ao protótipo). */
export const CATEGORY_COLORS = [
  "#6C5CE7",
  "#2D9CDB",
  "#12A66A",
  "#E58E26",
  "#EB5FA6",
  "#F2545B",
  "#17B6A5",
  "#9B59B6",
];

export const DEFAULT_COLOR = CATEGORY_COLORS[0];

/** Um schema por entidade — campos condicionais viram validações distintas. */
export const schemas = {
  categoria: object({
    nome: string().required("Nome é obrigatório"),
    tipo: string().required("Tipo é obrigatório"),
    tetoGasto: string().optional(),
    cor: string().optional(),
  }),
  pessoa: object({
    nome: string().required("Nome é obrigatório"),
    email: string().email("E-mail inválido").optional(),
  }),
  meio: object({
    nome: string().required("Nome é obrigatório"),
  }),
} as const;

export interface RegisterFormValues {
  nome: string;
  tipo?: string;
  tetoGasto?: string;
  cor?: string;
  email?: string;
  favorito?: boolean;
}

export const emptyForm: Record<string, RegisterFormValues> = {
  categoria: {
    nome: "",
    tipo: "despesa",
    tetoGasto: "",
    cor: DEFAULT_COLOR,
    favorito: false,
  },
  pessoa: { nome: "", email: "", favorito: false },
  meio: { nome: "", favorito: false },
};
