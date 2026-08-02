import { object, string } from "yup";

import type {
  CreateMetaRequest,
  EditMetaRequest,
  MetaResponse,
} from "@/domain/models";
import { maskCurrencyInput, parseAmount } from "@/lib/format";

/** number → string mascarada ("4200" → "4.200,00"); vazio se null. */
const money = (n?: number | null): string =>
  n != null ? maskCurrencyInput(String(Math.round(n * 100))) : "";

/** Valores do form de meta (strings p/ inputs; convertidos no submit). */
export interface MetaFormValues {
  titulo: string;
  tipo: string;
  valorAlvo: string;
  valorInicial: string;
  aporteMensal: string;
  dataAlvo: string;
  tag: string;
  pessoaId: string;
}

export const emptyForm: MetaFormValues = {
  titulo: "",
  tipo: "acumular",
  valorAlvo: "",
  valorInicial: "",
  aporteMensal: "",
  dataAlvo: "",
  tag: "",
  pessoaId: "",
};

export const schema = object({
  titulo: string()
    .required("Informe o título")
    .min(2, "Mínimo de 2 caracteres")
    .max(80, "Máximo de 80 caracteres"),
  tipo: string().required("Selecione o tipo"),
  valorAlvo: string().required("Informe o valor alvo"),
  valorInicial: string().optional(),
  aporteMensal: string().optional(),
  dataAlvo: string().required("Informe a data alvo"),
  tag: string().optional(),
  pessoaId: string().optional(),
});

/** Pré-preenche o form a partir de uma meta existente (edição). */
export const fromMeta = (m: MetaResponse): MetaFormValues => ({
  titulo: m.titulo,
  tipo: m.tipo,
  valorAlvo: money(m.valorAlvo),
  valorInicial: money(m.valorAtual),
  aporteMensal: money(m.aporteMensal),
  dataAlvo: (m.dataAlvo ?? "").slice(0, 10),
  tag: m.tag.nome,
  pessoaId: m.pessoa?.id ?? "",
});

/** Pré-preenche o form ao promover um desejo (título + valor estimado). */
export const fromDesejo = (titulo: string, valorEstimado?: number | null) => ({
  ...emptyForm,
  titulo,
  valorAlvo: money(valorEstimado),
});

/**
 * Payload da API. Valores monetários vêm como string ("1.000,00") e viram
 * number; opcionais vazios são omitidos. `pessoaId` vazio = Casal (envia null).
 * Serve para create e edit (edit ignora `tipo`).
 */
export const toRequest = (
  v: MetaFormValues,
): CreateMetaRequest & EditMetaRequest => ({
  titulo: v.titulo,
  tipo: v.tipo as CreateMetaRequest.TipoEnum,
  valorAlvo: parseAmount(v.valorAlvo),
  dataAlvo: v.dataAlvo,
  pessoaId: v.pessoaId || null,
  ...(v.valorInicial ? { valorInicial: parseAmount(v.valorInicial) } : {}),
  ...(v.aporteMensal ? { aporteMensal: parseAmount(v.aporteMensal) } : {}),
  ...(v.tag ? { tag: v.tag } : {}),
});
