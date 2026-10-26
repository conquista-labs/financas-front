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

/**
 * Valores do form de meta. Meta é só um MARCO: título, valor, quando
 * (opcional) e de quem — o sistema não acompanha quanto já foi juntado.
 */
export interface MetaFormValues {
  titulo: string;
  valorAlvo: string;
  /** "yyyy-MM-01" ou vazio (sem prazo). */
  dataAlvo: string;
  pessoaId: string;
}

export const emptyForm: MetaFormValues = {
  titulo: "",
  valorAlvo: "",
  dataAlvo: "",
  pessoaId: "",
};

export const schema = object({
  titulo: string()
    .required("Informe o título")
    .min(3, "Mínimo de 3 caracteres")
    .max(80, "Máximo de 80 caracteres"),
  valorAlvo: string().required("Informe o valor"),
  dataAlvo: string().optional(),
  pessoaId: string().optional(),
});

/** Pré-preenche o form a partir de uma meta existente (edição). */
export const fromMeta = (m: MetaResponse): MetaFormValues => ({
  titulo: m.titulo,
  valorAlvo: money(m.valorAlvo),
  dataAlvo: (m.dataAlvo ?? "").slice(0, 10),
  pessoaId: m.pessoa?.id ?? "",
});

/** Pré-preenche o form ao promover um desejo (título + valor estimado). */
export const fromDesejo = (titulo: string, valorEstimado?: number | null) => ({
  ...emptyForm,
  titulo,
  valorAlvo: money(valorEstimado),
});

/**
 * Payload da API. Criar: sem prazo = omite `dataAlvo`. Editar: sem prazo =
 * `null` (tira o prazo). `pessoaId` vazio = Casal (null). A tag continua
 * sendo gerada pelo backend a partir do título, sem aparecer na tela.
 */
export const toRequest = (
  v: MetaFormValues,
  isEdit: boolean,
): Omit<CreateMetaRequest, "dataAlvo"> & EditMetaRequest => ({
  titulo: v.titulo.trim(),
  valorAlvo: parseAmount(v.valorAlvo),
  pessoaId: v.pessoaId || null,
  ...(v.dataAlvo ? { dataAlvo: v.dataAlvo } : isEdit ? { dataAlvo: null } : {}),
});
