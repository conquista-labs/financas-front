import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StringParam, useQueryParam, withDefault } from "use-query-params";

import type { DesejoResponse, MetaResponse } from "@/domain/models";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui";
import {
  useGetDesejos,
  useGetMetas,
  useGetMetasResumo,
  useGetPessoas,
} from "@/presentation/hooks/api";

import {
  AporteDialog,
  DesejoCard,
  DesejoFormDialog,
  GoalsKpis,
  MetaCard,
  MetaDetalheDialog,
  MetaFormDialog,
} from "./components";
import { useGoalsMutations } from "./useGoalsMutations";

const OPT_LIMIT = { page: 1, limit: 100 };

type Tab = "metas" | "desejos";

/**
 * Metas & Desejos (nova identidade). Aba Metas: KPIs (herói guardado + ritmo) e
 * grid de metas (anel de progresso, aportar/editar/arquivar, detalhe com
 * gráfico). Aba Desejos: grid de desejos com voto do casal e "virar meta".
 * Criar/editar/aportar via modais; arquivar com desfazer (restaurar/recriar).
 */
const Goals = () => {
  // Aba persistida na URL (?tab=metas|desejos) — sobrevive ao F5.
  const [tabParam, setTabParam] = useQueryParam(
    "tab",
    withDefault(StringParam, "metas"),
  );
  const tab: Tab = tabParam === "desejos" ? "desejos" : "metas";
  const setTab = (t: Tab) => setTabParam(t);

  // Modais.
  const [detalhe, setDetalhe] = useState<MetaResponse | null>(null);
  const [aporte, setAporte] = useState<MetaResponse | null>(null);
  const [metaForm, setMetaForm] = useState<{
    open: boolean;
    meta: MetaResponse | null;
    desejo: DesejoResponse | null;
  }>({ open: false, meta: null, desejo: null });
  const [desejoForm, setDesejoForm] = useState<{
    open: boolean;
    desejo: DesejoResponse | null;
  }>({ open: false, desejo: null });

  const metas = useGetMetas();
  const resumo = useGetMetasResumo();
  const desejos = useGetDesejos();
  const pessoas = useGetPessoas(OPT_LIMIT);
  const {
    archiveMeta,
    restoreMeta,
    archiveDesejo,
    vote,
    unvote,
    createDesejo,
  } = useGoalsMutations();

  const metasRows = metas.data?.data ?? [];
  const desejosRows = desejos.data?.data ?? [];
  const pessoasRows = pessoas.data?.data?.rows ?? [];

  // --- Metas ---
  const openNewMeta = () =>
    setMetaForm({ open: true, meta: null, desejo: null });
  const openEditMeta = (meta: MetaResponse) => {
    setDetalhe(null);
    setMetaForm({ open: true, meta, desejo: null });
  };
  const openAporte = (meta: MetaResponse) => {
    setDetalhe(null);
    setAporte(meta);
  };

  const handleArchiveMeta = (meta: MetaResponse) =>
    archiveMeta.mutate(meta.id, {
      onSuccess: () =>
        toast.success(`"${meta.titulo}" arquivada.`, {
          action: {
            label: "Desfazer",
            onClick: () =>
              restoreMeta.mutate(meta.id, {
                onError: (e) => toast.error(e.message),
              }),
          },
        }),
      onError: (e) => toast.error(e.message),
    });

  // --- Desejos ---
  const openNewDesejo = () => setDesejoForm({ open: true, desejo: null });
  const openEditDesejo = (desejo: DesejoResponse) =>
    setDesejoForm({ open: true, desejo });
  const openPromote = (desejo: DesejoResponse) =>
    setMetaForm({ open: true, meta: null, desejo });

  const handleToggleVote = (desejo: DesejoResponse, pessoaId: string) => {
    const jaVotou = desejo.votos.some((v) => v.pessoaId === pessoaId);
    const mut = jaVotou ? unvote : vote;
    mut.mutate(
      { id: desejo.id, pessoaId },
      { onError: (e) => toast.error(e.message) },
    );
  };

  const handleArchiveDesejo = (desejo: DesejoResponse) =>
    archiveDesejo.mutate(desejo.id, {
      onSuccess: () =>
        toast.success(`"${desejo.titulo}" arquivado.`, {
          action: {
            // Sem restore de desejo no back — "Desfazer" recria com os votos.
            label: "Desfazer",
            onClick: () =>
              createDesejo.mutate(
                {
                  titulo: desejo.titulo,
                  prioridade: desejo.prioridade,
                  ...(desejo.nota ? { nota: desejo.nota } : {}),
                  ...(desejo.valorEstimado != null
                    ? { valorEstimado: desejo.valorEstimado }
                    : {}),
                  ...(desejo.votos.length
                    ? { votos: desejo.votos.map((v) => v.pessoaId) }
                    : {}),
                },
                { onError: (e) => toast.error(e.message) },
              ),
          },
        }),
      onError: (e) => toast.error(e.message),
    });

  const newLabel = tab === "metas" ? "Nova meta" : "Novo desejo";
  const onNew = tab === "metas" ? openNewMeta : openNewDesejo;

  return (
    <div className="animate-om-fade">
      {/* Header */}
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="font-display text-[30px] font-bold -tracking-[0.025em] text-fg">
            Metas &amp; desejos
          </h1>
          <p className="mt-[6px] text-sm text-muted">
            O que a gente quer, e o quanto já caminhou até lá.
          </p>
        </div>
        <button
          type="button"
          onClick={onNew}
          className="flex items-center gap-[7px] rounded-[12px] bg-primary px-[17px] py-[11px] text-sm font-semibold text-white shadow-primary transition-colors hover:bg-primary-strong"
        >
          <Plus className="size-4" strokeWidth={2.4} />
          {newLabel}
        </button>
      </div>

      {/* Abas */}
      <div className="mb-[18px] flex max-w-[420px] gap-[6px] rounded-[14px] bg-track p-[5px]">
        {(
          [
            { id: "metas", label: `Metas (${metasRows.length})` },
            { id: "desejos", label: `Desejos (${desejosRows.length})` },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 rounded-[10px] px-[14px] py-[10px] text-sm font-semibold transition-all",
              tab === t.id
                ? "bg-card text-primary shadow-[0_2px_6px_rgba(0,0,0,.08)]"
                : "text-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      {tab === "metas" ? (
        <>
          <GoalsKpis resumo={resumo.data?.data} isLoading={resumo.isLoading} />

          {metas.isLoading ? (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[124px] rounded-[20px]" />
              ))}
            </div>
          ) : metasRows.length === 0 ? (
            <EmptyState
              title="Nenhuma meta ainda"
              subtitle="Crie uma meta e vincule uma tag para acompanhar o progresso."
            />
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {metasRows.map((meta) => (
                <MetaCard
                  key={meta.id}
                  meta={meta}
                  isArchiving={
                    archiveMeta.isPending && archiveMeta.variables === meta.id
                  }
                  onOpen={setDetalhe}
                  onAporte={openAporte}
                  onEdit={openEditMeta}
                  onArchive={handleArchiveMeta}
                />
              ))}
            </div>
          )}

          <p className="mt-4 text-[12.5px] text-muted">
            Cada meta soma os lançamentos com a tag vinculada.
          </p>
        </>
      ) : (
        <>
          {desejos.isLoading ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[168px] rounded-[20px]" />
              ))}
            </div>
          ) : desejosRows.length === 0 ? (
            <EmptyState
              title="Nenhum desejo ainda"
              subtitle="Anote o que vocês querem — vira meta quando decidirem juntos."
            />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {desejosRows.map((desejo) => (
                <DesejoCard
                  key={desejo.id}
                  desejo={desejo}
                  pessoas={pessoasRows}
                  isArchiving={
                    archiveDesejo.isPending &&
                    archiveDesejo.variables === desejo.id
                  }
                  onToggleVote={handleToggleVote}
                  onPromote={openPromote}
                  onEdit={openEditDesejo}
                  onArchive={handleArchiveDesejo}
                />
              ))}
            </div>
          )}

          <p className="mt-4 text-[12.5px] text-muted">
            Desejo não tem compromisso: vira meta quando vocês decidem juntos.
            Ordenado por votos e prioridade.
          </p>
        </>
      )}

      {/* Modais */}
      <MetaDetalheDialog
        meta={detalhe}
        open={!!detalhe}
        onOpenChange={(o) => !o && setDetalhe(null)}
        onAporte={openAporte}
        onEdit={openEditMeta}
      />
      <AporteDialog
        meta={aporte}
        open={!!aporte}
        onOpenChange={(o) => !o && setAporte(null)}
      />
      <MetaFormDialog
        meta={metaForm.meta}
        desejo={metaForm.desejo}
        open={metaForm.open}
        onOpenChange={(open) => setMetaForm((s) => ({ ...s, open }))}
      />
      <DesejoFormDialog
        desejo={desejoForm.desejo}
        open={desejoForm.open}
        onOpenChange={(open) => setDesejoForm((s) => ({ ...s, open }))}
      />
    </div>
  );
};

const EmptyState = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) => (
  <div className="mt-4 rounded-[20px] border border-dashed border-line bg-card/50 px-6 py-16 text-center">
    <p className="text-sm font-semibold text-fg">{title}</p>
    <p className="mt-1 text-sm text-muted">{subtitle}</p>
  </div>
);

export default Goals;
