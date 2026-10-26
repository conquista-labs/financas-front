/**
 * API de finanças M&J
 * API de controle financeiro do Júnior e da Vivi
 *
 * The version of the OpenAPI document: 1.0
 */
import type { TagResumo } from "./tagResumo";
import type { PessoaResumo } from "./pessoaResumo";

export interface MetaResponse {
  id: string;
  titulo: string;
  tipo: MetaResponse.TipoEnum;
  valorAlvo: number;
  /** Derivado: valorInicial + Σ transações da tag. */
  valorAtual: number;
  /** max(0, valorAlvo - valorAtual). */
  falta: number;
  /** 0-100 (capado). */
  percentual: number;
  aporteMensal: number;
  /** falta / mesesRestantes. */
  aporteNecessario: number;
  noRitmo: boolean;
  /** Status de progresso derivado (≠ status persistido). */
  statusProgresso: MetaResponse.StatusProgressoEnum;
  /** Status persistido. */
  status: MetaResponse.StatusEnum;
  /** ceil(falta/aporteMensal); null se aporte 0. */
  etaMeses?: number | null;
  /** null = sem prazo. */
  dataAlvo: string | null;
  tag: TagResumo;
  /** null = Casal. */
  pessoa?: PessoaResumo | null;
  /** ISO — quando foi conquistada (status "concluida"). */
  concluidaEm?: string | null;
  /** Quanto custou no fim (informado ao concluir). */
  valorFinal?: number | null;
  /** Compras que realizaram a meta (várias = parcelas). */
  compras?: Array<{
    id: string;
    descricao: string;
    data: string;
    valor: number;
    parcelaNumero?: number | null;
    totalParcelas?: number | null;
  }>;
}
export namespace MetaResponse {
  export type TipoEnum = "acumular" | "quitar";
  export type StatusProgressoEnum = "no_ritmo" | "atrasada" | "concluida";
  export type StatusEnum = "ativa" | "concluida" | "arquivada";
}
