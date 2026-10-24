import type { LancamentoExterno } from "@/domain/models";

/** Dicas que a sincronização deixa num lançamento pendente. */
export const DICAS: Record<
  string,
  { label: string; tone: "success" | "warning" | "primary" }
> = {
  conta_recorrente: {
    label: "Conta recorrente · aceitar marca como paga",
    tone: "success",
  },
  possivel_casal: { label: "Parece Pix entre vocês", tone: "warning" },
  possivel_duplicada: { label: "Parece já lançada", tone: "warning" },
};

/** Por que um lançamento foi ignorado (automático ou manual). */
export const MOTIVOS_IGNORADO: Record<string, string> = {
  investimento: "Investimentos",
  mesma_pessoa: "Mesma pessoa",
  fatura: "Pagamento de fatura",
  casal: "Pix entre vocês",
  regra: "Regra",
  duplicada: "Pareciam já lançadas",
  manual: "Ignorados por vocês",
};

/** Como um lançamento ficou ligado a uma transação que já existia. */
export const MOTIVOS_VINCULADO: Record<string, string> = {
  ja_lancado: "Já estava lançado",
  conta_recorrente: "Conta recorrente paga",
};

export type InboxVisao = "pendente" | "vinculado" | "ignorado";

/** Edição local de uma linha antes de aceitar. */
export interface InboxEdit {
  categoriaId?: string;
  descricao?: string;
  /** Pessoa escolhida na revisão ("" = ninguém); sem edição vale o titular. */
  pessoaId?: string;
}

/** Categoria efetiva da linha: a escolhida, senão a sugerida. */
export const categoriaDe = (l: LancamentoExterno, edit?: InboxEdit) =>
  edit?.categoriaId ?? l.categoriaSugerida?.id ?? "";

/** "2026-10-09" → "09/10". */
export const diaMes = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;

/** Pessoa efetiva da linha: a escolhida na revisão, senão o titular da conta. */
export const pessoaDe = (l: LancamentoExterno, edit?: InboxEdit) =>
  edit?.pessoaId ?? l.pessoa?.id ?? "";
