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
  parcela_prevista: {
    label: "Parcela prevista · aceitar marca como paga",
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
  /** Meio escolhido ("" = nenhum); sem edição vale o sugerido. */
  meioPagamentoId?: string;
  /** Compra parcelada: criar as parcelas restantes como pendentes. */
  criarFuturas?: boolean;
}

/** Categoria efetiva da linha: a escolhida, senão a sugerida. */
export const categoriaDe = (l: LancamentoExterno, edit?: InboxEdit) =>
  edit?.categoriaId ?? l.categoriaSugerida?.id ?? "";

/** "2026-10-09" → "09/10". */
export const diaMes = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;

/** Pessoa efetiva da linha: a escolhida na revisão, senão o titular da conta. */
export const pessoaDe = (l: LancamentoExterno, edit?: InboxEdit) =>
  edit?.pessoaId ?? l.pessoa?.id ?? "";

/** Meio efetivo da linha: o escolhido na revisão, senão o sugerido. */
export const meioDe = (l: LancamentoExterno, edit?: InboxEdit) =>
  edit?.meioPagamentoId ?? l.meioSugerido?.id ?? "";

/** Quantas parcelas ainda vão cair depois desta (0 se não der para criar). */
export const parcelasRestantes = (l: LancamentoExterno) =>
  l.totalParcelas && l.parcelaNumero && l.motivo !== "parcela_prevista"
    ? l.totalParcelas - l.parcelaNumero
    : 0;
