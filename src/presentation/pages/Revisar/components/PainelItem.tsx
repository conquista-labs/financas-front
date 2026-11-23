import { keepPreviousData } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Check,
  EyeOff,
  Link2,
  Loader2,
  RotateCcw,
  Search,
  Trash2,
  Unlink,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { TransacaoResponse } from "@/domain/models";
import { formatCurrency, parseAmount } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Combobox, type ComboboxOption } from "@/presentation/components";
import {
  useGetCaixaEntradaCandidatas,
  useGetTransacoes,
} from "@/presentation/hooks/api";
import { useDebounce } from "@/presentation/hooks/core";
import type { LinhaExtrato } from "@/presentation/store/filaExtrato";

import { isoDate, numParcelas } from "../extrato/extrato.helpers";
import type { ItemFila } from "../revisar.fila";
import {
  categoriaDe,
  diaMes,
  DICAS,
  type InboxEdit,
  type InboxVisao,
  meioDe,
  MOTIVOS_IGNORADO,
  MOTIVOS_VINCULADO,
  parcelasRestantes,
  pessoaDe,
  VINCULOS_DESFAZIVEIS,
} from "../revisar.helpers";

const TONS = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  primary: "bg-primary-soft text-primary-strong dark:text-[#B3A9FF]",
  neutral: "bg-track text-fg2",
} as const;

const Chip = ({
  tom,
  children,
}: {
  tom: keyof typeof TONS;
  children: React.ReactNode;
}) => (
  <span
    className={cn("rounded-full px-[10px] py-1 text-xs font-bold", TONS[tom])}
  >
    {children}
  </span>
);

const Campo = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-[5px]">
    <span className="text-xs font-semibold text-fg2">{label}</span>
    {children}
  </div>
);

export interface PainelOpcoes {
  categorias: { receita: ComboboxOption[]; despesa: ComboboxOption[] };
  pessoas: ComboboxOption[];
  meios: ComboboxOption[];
  formas: ComboboxOption[];
  /** Opções ainda carregando (os selects mostram "Carregando…"). */
  carregando?: boolean;
}

export interface PainelAcoes {
  onAceitar: () => void;
  onIgnorar: () => void;
  /** Banco: liga à transação escolhida (sem id, à melhor). Extrato: tira da fila. */
  onJaLancei: (transacaoId?: string) => void;
  onExcluir: () => void;
  onRestaurar: () => void;
  onDesvincular: () => void;
}

interface PainelItemProps extends PainelAcoes {
  item: ItemFila;
  visao: InboxVisao;
  posicao: number;
  total: number;
  ocupado: boolean;
  opcoes: PainelOpcoes;
  /** Edição local do item do banco (antes de aceitar). */
  edit?: InboxEdit;
  onEditBanco: (patch: InboxEdit) => void;
  onEditExtrato: (patch: Partial<LinhaExtrato>) => void;
  onAnterior: () => void;
  onProximo: () => void;
}

/** Uma transação que dá para ligar ao lançamento do banco. */
const LinhaCandidata = ({
  titulo,
  detalhe,
  valor,
  onLigar,
  ocupado,
}: {
  titulo: string;
  detalhe: string;
  valor?: number;
  onLigar: () => void;
  ocupado?: boolean;
}) => (
  <div className="flex items-center gap-3 rounded-[10px] bg-card px-3 py-2">
    <div className="min-w-0 flex-1">
      <p className="truncate text-[13px] font-semibold">{titulo}</p>
      <p className="truncate text-[11.5px] text-fg2">{detalhe}</p>
    </div>
    {valor !== undefined && (
      <span className="shrink-0 font-display text-[13px] font-bold tabular-nums">
        {formatCurrency(valor)}
      </span>
    )}
    <button
      type="button"
      onClick={onLigar}
      disabled={ocupado}
      className="text-[13px] font-bold text-primary hover:underline disabled:opacity-50 dark:text-[#B3A9FF]"
    >
      Ligar
    </button>
  </div>
);

/**
 * "Já lancei?": transações com o mesmo valor por perto, para ligar — e uma
 * busca por descrição para achar o lançamento quando o valor ou a data não
 * batem (ex.: lançado com outro valor, ou há mais de 45 dias).
 */
const Candidatas = ({
  id,
  tipo,
  onLigar,
  ocupado,
}: {
  id: string;
  tipo: "receita" | "despesa";
  onLigar: (transacaoId: string) => void;
  ocupado?: boolean;
}) => {
  const { data, isLoading, isError } = useGetCaixaEntradaCandidatas(id);
  const lista = data?.data ?? [];

  const [busca, setBusca] = useState("");
  const termo = useDebounce(busca.trim(), 300);
  const buscando = termo.length >= 2;
  // Enquanto digita, os resultados anteriores ficam na tela (esmaecidos)
  // até chegarem os novos — sem piscar nem esqueleto.
  const achadas = useGetTransacoes(
    { page: 1, limit: 6, search: termo, tipo },
    { enabled: buscando, placeholderData: keepPreviousData },
  );
  // Trocou de item na fila: limpa a busca.
  useEffect(() => setBusca(""), [id]);
  const resultados = (achadas.data?.data?.rows ?? []) as TransacaoResponse[];
  const trocando = achadas.isPlaceholderData;

  return (
    <div className="rounded-[14px] bg-bg px-[14px] py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[12.5px] font-semibold text-fg2">
          {buscando
            ? "Buscando nos lançamentos"
            : "Já lancei? Mesmo valor, até 45 dias"}
        </p>
        <label className="flex h-8 w-full items-center gap-[6px] rounded-[10px] bg-card px-[10px] sm:w-[220px]">
          <Search className="size-[14px] shrink-0 text-muted" />
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar outro lançamento…"
            aria-label="Buscar lançamento para ligar"
            className="min-w-0 flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted"
          />
          {buscando && achadas.isFetching && (
            <Loader2 className="size-[14px] shrink-0 animate-spin text-muted" />
          )}
        </label>
      </div>

      {buscando ? (
        // Primeira busca (ou a anterior não achou nada): só uma linha
        // discreta; o spinner do campo já indica que está buscando.
        achadas.isLoading || (trocando && !resultados.length) ? (
          <p className="mt-2 text-[12.5px] text-muted" aria-busy="true">
            Buscando…
          </p>
        ) : achadas.isError ? (
          <p className="mt-2 text-[12.5px] text-danger">
            Não foi possível buscar agora.
          </p>
        ) : !resultados.length ? (
          <p className="mt-2 text-[12.5px] text-muted">
            Nenhum lançamento com &quot;{termo}&quot;.
          </p>
        ) : (
          <div
            aria-busy={trocando || undefined}
            className={cn(
              "mt-2 flex flex-col gap-[6px] transition-opacity",
              trocando && "opacity-60",
            )}
          >
            {resultados.map((t) => (
              <LinhaCandidata
                key={t.id}
                titulo={`${t.descricao} · ${diaMes(t.data)}`}
                detalhe={[
                  t.categoria?.nome,
                  t.meioPagamento?.nome,
                  t.pessoa?.nome,
                  t.status === "pendente" ? "pendente, vira paga" : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
                valor={parseAmount(t.valor)}
                onLigar={() => onLigar(t.id)}
                ocupado={ocupado}
              />
            ))}
          </div>
        )
      ) : isLoading ? (
        <p className="mt-2 flex items-center gap-2 text-[12.5px] text-muted">
          <Loader2 className="size-4 animate-spin" /> Procurando…
        </p>
      ) : isError ? (
        <p className="mt-2 text-[12.5px] text-danger">
          Não foi possível buscar agora.
        </p>
      ) : !lista.length ? (
        <p className="mt-2 text-[12.5px] text-muted">
          Nenhuma transação com esse valor por perto. Use a busca acima.
        </p>
      ) : (
        <div className="mt-2 flex flex-col gap-[6px]">
          {lista.slice(0, 3).map((t) => (
            <LinhaCandidata
              key={t.id}
              titulo={`${t.descricao} · ${diaMes(t.data)}`}
              detalhe={
                [t.categoria, t.meioPagamento, t.pessoa]
                  .filter(Boolean)
                  .join(" · ") +
                (t.mesmoMeio ? " · mesmo meio" : "") +
                (t.status === "pendente" ? " · pendente, vira paga" : "")
              }
              onLigar={() => onLigar(t.id)}
              ocupado={ocupado}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Painel do item em revisão (à direita da fila): descrição, valor, dicas,
 * campos e as ações. Serve aos dois tipos de item — do banco e do extrato.
 */
export const PainelItem = ({
  item,
  visao,
  posicao,
  total,
  ocupado,
  opcoes,
  edit,
  onEditBanco,
  onEditExtrato,
  onAnterior,
  onProximo,
  onAceitar,
  onIgnorar,
  onJaLancei,
  onExcluir,
  onRestaurar,
  onDesvincular,
}: PainelItemProps) => {
  const b = item.origem === "banco" ? item.banco : undefined;
  const e = item.origem === "extrato" ? item.extrato : undefined;
  const tipo = (b?.tipo ?? e!.tipo) as "receita" | "despesa";
  const receita = tipo === "receita";
  const valor = b?.valor ?? e!.valor;
  const data = b?.data ?? isoDate(e!.data);
  const descricao = b ? (edit?.descricao ?? b.descricao) : e!.descricao;
  const pendente = visao === "pendente";
  // Qual ação foi clicada: ela ganha o spinner enquanto `ocupado`.
  const [clicada, setClicada] = useState<string | null>(null);
  useEffect(() => {
    if (!ocupado) setClicada(null);
  }, [ocupado]);
  const icone = (acao: string, padrao: React.ReactNode, cls = "size-4") =>
    ocupado && clicada === acao ? (
      <Loader2 className={cn(cls, "animate-spin")} />
    ) : (
      padrao
    );
  const clicar = (acao: string, fn: () => void) => () => {
    setClicada(acao);
    fn();
  };

  const categoriaId = b ? categoriaDe(b, edit) : e!.categoriaId;
  const pessoaId = b ? pessoaDe(b, edit) : e!.pessoaId;
  const meioId = b ? meioDe(b, edit) : e!.meioPagamentoId;

  const restantesBanco = b ? parcelasRestantes(b) : 0;
  const parcelasExtrato = e ? numParcelas(e.formaPagamento) : 0;
  const dica = b?.motivo && pendente ? DICAS[b.motivo] : undefined;

  return (
    <section
      aria-label="Item em revisão"
      className="flex min-w-0 flex-col gap-[14px] rounded-[26px] border-2 border-primary bg-card p-4 sm:p-[22px]"
    >
      {/* Posição + origem */}
      <div className="flex items-center justify-between gap-3 text-[12.5px] text-fg2">
        <span className="flex min-w-0 items-center gap-[6px]">
          <span className="shrink-0">
            {posicao} de {total}
          </span>
          ·
          <span className="shrink-0 rounded-full bg-track px-2 py-[2px] font-bold">
            {b ? (b.banco ?? "Banco") : "Extrato"}
          </span>
          <span className="truncate">
            {b ? b.conta.nome : e!.arquivo} · {diaMes(data)}
          </span>
        </span>
        <span className="flex shrink-0 gap-1">
          <button
            type="button"
            aria-label="Anterior"
            onClick={onAnterior}
            disabled={posicao <= 1}
            className="grid size-[30px] place-items-center rounded-[8px] border border-line bg-card disabled:opacity-40"
          >
            <ArrowUp className="size-[14px]" />
          </button>
          <button
            type="button"
            aria-label="Próximo"
            onClick={onProximo}
            disabled={posicao >= total}
            className="grid size-[30px] place-items-center rounded-[8px] border border-line bg-card disabled:opacity-40"
          >
            <ArrowDown className="size-[14px]" />
          </button>
        </span>
      </div>

      {/* Descrição + valor */}
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <input
          value={descricao}
          onChange={(ev) =>
            b
              ? onEditBanco({ descricao: ev.target.value })
              : onEditExtrato({ descricao: ev.target.value })
          }
          disabled={!pendente}
          aria-label="Descrição"
          className="h-11 min-w-[180px] flex-1 rounded-[12px] border border-transparent bg-bg px-3 font-display text-[20px] font-bold outline-none focus:border-primary disabled:bg-transparent disabled:px-0"
        />
        <p
          className={cn(
            "shrink-0 pt-[6px] font-display text-[22px] font-bold sm:text-[26px] tabular-nums -tracking-[0.02em]",
            receita ? "text-success" : "text-fg",
          )}
        >
          {receita ? "+ " : "- "}
          {formatCurrency(valor)}
        </p>
      </div>

      {/* Dicas e marcas */}
      <div className="flex flex-wrap gap-[6px]">
        {dica && <Chip tom={dica.tone}>{dica.label}</Chip>}
        {b?.dataFatura && (
          <Chip tom="neutral">Fatura · vence {diaMes(b.dataFatura)}</Chip>
        )}
        {b?.statusBanco === "PENDING" && (
          <Chip tom="neutral">Fatura aberta</Chip>
        )}
        {b?.parcelaNumero && b.totalParcelas && (
          <Chip tom="primary">
            Parcela {b.parcelaNumero}/{b.totalParcelas}
          </Chip>
        )}
        {e?.possivelDuplicada && pendente && (
          <Chip tom="warning">Parece já lançada</Chip>
        )}
        {e?.tag && <Chip tom="neutral">#{e.tag}</Chip>}
        {b?.status === "ignorado" && b.motivo && (
          <Chip tom="neutral">{MOTIVOS_IGNORADO[b.motivo] ?? b.motivo}</Chip>
        )}
        {b?.status === "vinculado" && b.motivo && (
          <Chip tom="success">{MOTIVOS_VINCULADO[b.motivo] ?? b.motivo}</Chip>
        )}
        {pendente && (restantesBanco > 0 || parcelasExtrato > 1) && (
          <button
            type="button"
            role="checkbox"
            aria-checked={b ? !!edit?.criarFuturas : e!.propagarParcelas}
            onClick={() =>
              b
                ? onEditBanco({ criarFuturas: !edit?.criarFuturas })
                : onEditExtrato({ propagarParcelas: !e!.propagarParcelas })
            }
            className={cn(
              "rounded-full border px-[10px] py-1 text-xs font-bold transition-colors",
              (b ? edit?.criarFuturas : e!.propagarParcelas)
                ? "border-primary bg-primary text-white"
                : "border-primary/40 text-primary dark:text-[#B3A9FF]",
            )}
          >
            {(b ? edit?.criarFuturas : e!.propagarParcelas) ? "✓ " : ""}
            Criar as {b ? restantesBanco : parcelasExtrato - 1} futuras
          </button>
        )}
      </div>

      {/* Já ligado a uma transação */}
      {b?.status === "vinculado" && b.transacao && (
        <div className="rounded-[14px] bg-bg px-[14px] py-3 text-[13px]">
          <span className="text-fg2">Ligado a </span>
          <strong>{b.transacao.descricao}</strong>
          <span className="text-fg2"> · {diaMes(b.transacao.data)}</span>
        </div>
      )}

      {/* Campos */}
      {pendente && (
        <div className="grid grid-cols-1 gap-[10px] sm:grid-cols-2">
          <Campo label="Categoria">
            <Combobox
              loading={opcoes.carregando}
              inline
              options={opcoes.categorias[tipo]}
              value={categoriaId || undefined}
              onChange={(v) =>
                b
                  ? onEditBanco({ categoriaId: v })
                  : onEditExtrato({ categoriaId: v })
              }
              placeholder="Escolher"
              searchPlaceholder="Buscar categoria…"
            />
          </Campo>
          <Campo label="Pessoa">
            <Combobox
              loading={opcoes.carregando}
              inline
              options={opcoes.pessoas}
              value={pessoaId || undefined}
              onChange={(v) =>
                b
                  ? onEditBanco({ pessoaId: v })
                  : onEditExtrato({ pessoaId: v })
              }
              placeholder="Ninguém"
              clearLabel="Ninguém"
              searchPlaceholder="Buscar pessoa…"
            />
          </Campo>
          <Campo label="Meio de pagamento">
            <Combobox
              loading={opcoes.carregando}
              inline
              options={opcoes.meios}
              value={meioId || undefined}
              onChange={(v) =>
                b
                  ? onEditBanco({ meioPagamentoId: v })
                  : onEditExtrato({ meioPagamentoId: v })
              }
              placeholder="Não informado"
              clearLabel="Não informado"
              searchPlaceholder="Buscar meio…"
            />
          </Campo>
          {e && (
            <Campo label="Forma de pagamento">
              <Combobox
                loading={opcoes.carregando}
                inline
                options={opcoes.formas}
                value={e.formaPagamento || undefined}
                onChange={(v) =>
                  onEditExtrato({ formaPagamento: v || "avista" })
                }
                placeholder="À vista"
                searchPlaceholder="Buscar forma…"
              />
            </Campo>
          )}
        </div>
      )}

      {b && pendente && (
        <Candidatas
          id={b.id}
          tipo={tipo}
          onLigar={(id) => {
            setClicada("ja-lancei");
            onJaLancei(id);
          }}
          ocupado={ocupado}
        />
      )}

      {/* Ações (no celular ficam presas embaixo, acima da barra de abas) */}
      <div className="flex gap-2 max-lg:sticky sm:flex-wrap max-lg:bottom-[calc(88px+env(safe-area-inset-bottom))] max-lg:z-10 max-lg:-mx-4 max-lg:-mb-4 max-lg:rounded-b-[24px] max-lg:bg-card max-lg:px-4 max-lg:py-3 max-lg:shadow-[0_-8px_16px_-12px_rgba(0,0,0,.25)]">
        {pendente ? (
          <>
            <button
              type="button"
              onClick={clicar("aceitar", onAceitar)}
              disabled={ocupado}
              className="flex h-12 min-w-[120px] flex-1 items-center justify-center gap-2 rounded-[13px] bg-primary px-5 text-[15px] font-bold text-white transition-colors hover:bg-primary-strong disabled:opacity-60"
            >
              {icone(
                "aceitar",
                <Check className="size-[18px]" strokeWidth={2.6} />,
                "size-[18px]",
              )}{" "}
              Aceitar
            </button>
            <button
              type="button"
              onClick={clicar("ja-lancei", () => onJaLancei())}
              disabled={ocupado}
              title={
                b
                  ? "Liga à transação mais parecida que já existe"
                  : "Tira da fila sem lançar"
              }
              className="flex h-12 items-center gap-2 rounded-[13px] border border-line bg-card px-4 text-sm font-semibold disabled:opacity-60"
            >
              {icone("ja-lancei", <Link2 className="size-4" />)}
              <span className="max-sm:sr-only">Já lancei</span>
            </button>
            <button
              type="button"
              onClick={clicar("ignorar", onIgnorar)}
              disabled={ocupado}
              className="flex h-12 items-center gap-2 rounded-[13px] border border-line bg-card px-4 text-sm font-semibold disabled:opacity-60"
            >
              {icone("ignorar", <EyeOff className="size-4" />)}
              <span className="max-sm:sr-only">Ignorar</span>
            </button>
            <button
              type="button"
              onClick={clicar("excluir", onExcluir)}
              disabled={ocupado}
              className="flex h-12 items-center gap-2 rounded-[13px] bg-danger/10 px-4 text-sm font-semibold text-danger disabled:opacity-60"
            >
              {icone("excluir", <Trash2 className="size-4" />)}
              <span className="max-sm:sr-only">Excluir</span>
            </button>
          </>
        ) : visao === "ignorado" ? (
          <>
            <button
              type="button"
              onClick={clicar("restaurar", onRestaurar)}
              disabled={ocupado}
              className="flex h-11 items-center gap-2 rounded-[13px] bg-primary px-5 text-sm font-bold text-white disabled:opacity-60"
            >
              {icone("restaurar", <RotateCcw className="size-4" />)} Restaurar
            </button>
            <button
              type="button"
              onClick={clicar("excluir", onExcluir)}
              disabled={ocupado}
              className="flex h-11 items-center gap-2 rounded-[13px] bg-danger/10 px-4 text-sm font-semibold text-danger disabled:opacity-60"
            >
              {icone("excluir", <Trash2 className="size-4" />)} Excluir
            </button>
          </>
        ) : (
          b?.motivo &&
          VINCULOS_DESFAZIVEIS.has(b.motivo) && (
            <button
              type="button"
              onClick={clicar("desvincular", onDesvincular)}
              disabled={ocupado}
              className="flex h-11 items-center gap-2 rounded-[13px] border border-line bg-card px-4 text-sm font-semibold disabled:opacity-60"
            >
              {icone("desvincular", <Unlink className="size-4" />)} Desvincular
            </button>
          )
        )}
      </div>
      {pendente && (
        <p className="hidden text-xs leading-relaxed text-fg2 sm:block">
          {b
            ? "Ignorar deixa em Ignorados (dá para restaurar). Excluir some e não volta na sincronização."
            : "Ignorar deixa em Ignorados. Excluir e Já lancei tiram da fila sem lançar."}{" "}
          Atalhos: <kbd className="font-sans font-bold">A</kbd> aceita ·{" "}
          <kbd className="font-sans font-bold">I</kbd> ignora ·{" "}
          <kbd className="font-sans font-bold">J</kbd> já lancei ·{" "}
          <kbd className="font-sans font-bold">↑↓</kbd> navega
        </p>
      )}
    </section>
  );
};
