import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { DesejoResponse, MetaResponse } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/presentation/components/ui";
import {
  useGetDesejos,
  useGetMetas,
  useGetPessoas,
} from "@/presentation/hooks/api";

import {
  ConcluirMetaDialog,
  ConquistasList,
  DesejoCard,
  DesejoFormDialog,
  MetaCard,
  MetaFormDialog,
  RealizarDesejoDialog,
} from "./components";
import { useGoalsMutations } from "./useGoalsMutations";

const OPT_LIMIT = { page: 1, limit: 100 };

/**
 * Metas do "Repaginado": um quadro do "a gente quer" ao "conseguimos".
 * Queremos (desejos, com voto do casal, "Virar meta" e "Já realizei") →
 * Rumo a (metas em andamento: concluir/editar/arquivar) → Conquistado
 * (metas concluídas e desejos realizados, com "Reabrir"). Arquivar tem desfazer.
 */
const Goals = () => {
  const [todosDesejos, setTodosDesejos] = useState(false);
  // Celular: uma coluna por vez (abas); no desktop as três lado a lado.
  const [colunaCelular, setColunaCelular] = useState<
    "queremos" | "rumo" | "conquistado"
  >("rumo");

  // Modais.
  const [concluir, setConcluir] = useState<MetaResponse | null>(null);
  const [realizar, setRealizar] = useState<DesejoResponse | null>(null);
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
  const desejos = useGetDesejos();
  const realizados = useGetDesejos({ realizados: true });
  const pessoas = useGetPessoas(OPT_LIMIT);
  const {
    archiveMeta,
    restoreMeta,
    archiveDesejo,
    vote,
    unvote,
    createDesejo,
    reabrirMeta,
    reabrirDesejo,
  } = useGoalsMutations();

  const todasMetas = metas.data?.data ?? [];
  // Em andamento x conquistadas (status persistido).
  const metasRows = todasMetas.filter((m) => m.status !== "concluida");
  const metasConcluidas = todasMetas.filter((m) => m.status === "concluida");
  const desejosRealizados = realizados.data?.data ?? [];
  const desejosRows = desejos.data?.data ?? [];
  const pessoasRows = pessoas.data?.data?.rows ?? [];

  // --- Metas ---
  const openNewMeta = () =>
    setMetaForm({ open: true, meta: null, desejo: null });
  const openEditMeta = (meta: MetaResponse) =>
    setMetaForm({ open: true, meta, desejo: null });

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

  // --- Conquistas ---
  const openConcluir = (meta: MetaResponse) => setConcluir(meta);
  const handleReabrirMeta = (meta: MetaResponse) =>
    reabrirMeta.mutate(meta.id, {
      onSuccess: () => toast.success(`"${meta.titulo}" voltou para as metas.`),
      onError: (e) => toast.error(e.message),
    });
  const handleReabrirDesejo = (desejo: DesejoResponse) =>
    reabrirDesejo.mutate(desejo.id, {
      onSuccess: () =>
        toast.success(`"${desejo.titulo}" voltou para os desejos.`),
      onError: (e) => toast.error(e.message),
    });
  const reabrindo = reabrirMeta.isPending
    ? reabrirMeta.variables
    : reabrirDesejo.isPending
      ? reabrirDesejo.variables
      : null;

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
                  ...(desejo.link ? { link: desejo.link } : {}),
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

  const totalMetas = metasRows.reduce((soma, m) => soma + m.valorAlvo, 0);
  const anoAtual = new Date().getFullYear();
  const conquistasDoAno =
    metasConcluidas.filter((m) => m.concluidaEm?.startsWith(String(anoAtual)))
      .length +
    desejosRealizados.filter((d) => d.realizadoEm?.startsWith(String(anoAtual)))
      .length;
  const desejosVisiveis = todosDesejos
    ? desejosRows
    : desejosRows.slice(0, DESEJOS_VISIVEIS);

  return (
    <div className="flex animate-om-fade flex-col gap-4 pb-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[26px] font-bold -tracking-[0.03em] text-fg sm:text-[30px]">
            Metas
          </h1>
          <p className="mt-1 hidden text-sm text-fg2 sm:block">
            Do &quot;a gente quer&quot; ao &quot;conseguimos&quot;.
          </p>
        </div>
        <div className="flex flex-wrap gap-[10px] text-[13px]">
          <span className="rounded-[16px] border border-line bg-card px-[14px] py-[10px]">
            <strong className="font-display text-[17px]">
              {metasRows.length}
            </strong>{" "}
            {metasRows.length === 1 ? "meta" : "metas"} ·{" "}
            {formatCurrency(totalMetas)}
          </span>
          <span className="rounded-[16px] bg-success/10 px-[14px] py-[10px] text-success">
            <strong className="font-display text-[17px]">
              {conquistasDoAno}
            </strong>{" "}
            {conquistasDoAno === 1 ? "conquista" : "conquistas"} em {anoAtual}
          </span>
        </div>
      </header>

      <div
        role="tablist"
        aria-label="Colunas"
        className="flex gap-1 rounded-full bg-track p-1 lg:hidden"
      >
        {(
          [
            ["queremos", "Queremos", desejosRows.length],
            ["rumo", "Rumo a", metasRows.length],
            [
              "conquistado",
              "Conquistado",
              metasConcluidas.length + desejosRealizados.length,
            ],
          ] as const
        ).map(([id, t, n]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={colunaCelular === id}
            onClick={() => setColunaCelular(id)}
            className={cn(
              "h-9 flex-1 rounded-full text-[13px] font-semibold transition-colors",
              colunaCelular === id
                ? "bg-card text-fg shadow-[0_1px_3px_rgba(0,0,0,.08)]"
                : "text-fg2",
            )}
          >
            {t} <span className="opacity-60">{n}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        {/* Queremos */}
        <Coluna
          titulo="Queremos"
          quantidade={desejosRows.length}
          tom="bg-track"
          oculta={colunaCelular !== "queremos"}
          acao={{ label: "Desejo", onClick: openNewDesejo, primaria: false }}
        >
          {desejos.isLoading ? (
            <Esqueleto />
          ) : !desejosRows.length ? (
            <Vazio texto="Anote o que vocês querem — vira meta quando decidirem juntos." />
          ) : (
            <>
              {desejosVisiveis.map((desejo) => (
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
                  onRealizar={setRealizar}
                />
              ))}
              {desejosRows.length > DESEJOS_VISIVEIS && (
                <button
                  type="button"
                  onClick={() => setTodosDesejos((v) => !v)}
                  className="h-10 rounded-[14px] border border-dashed border-muted/60 text-[13px] font-semibold text-primary-strong hover:bg-card/60 dark:text-[#B3A9FF]"
                >
                  {todosDesejos
                    ? "Ver menos"
                    : `Ver mais ${desejosRows.length - DESEJOS_VISIVEIS} desejos`}
                </button>
              )}
            </>
          )}
        </Coluna>

        {/* Rumo a */}
        <Coluna
          titulo="Rumo a"
          quantidade={metasRows.length}
          tom="bg-primary-soft/70"
          oculta={colunaCelular !== "rumo"}
          acao={{ label: "Meta", onClick: openNewMeta, primaria: true }}
        >
          {metas.isLoading ? (
            <Esqueleto />
          ) : !metasRows.length ? (
            <Vazio texto="Nenhuma meta em andamento. Transforme um desejo ou crie uma." />
          ) : (
            metasRows.map((meta) => (
              <MetaCard
                key={meta.id}
                meta={meta}
                isArchiving={
                  archiveMeta.isPending && archiveMeta.variables === meta.id
                }
                onEdit={openEditMeta}
                onArchive={handleArchiveMeta}
                onConcluir={openConcluir}
              />
            ))
          )}
        </Coluna>

        {/* Conquistado */}
        <Coluna
          titulo={`Conquistado`}
          quantidade={metasConcluidas.length + desejosRealizados.length}
          tom="bg-success/10"
          oculta={colunaCelular !== "conquistado"}
        >
          {metas.isLoading || realizados.isLoading ? (
            <Esqueleto />
          ) : !metasConcluidas.length && !desejosRealizados.length ? (
            <Vazio texto="Quando concluírem uma meta ou realizarem um desejo, aparece aqui." />
          ) : (
            <ConquistasList
              metas={metasConcluidas}
              desejos={desejosRealizados}
              reabrindo={reabrindo}
              onReabrirMeta={handleReabrirMeta}
              onReabrirDesejo={handleReabrirDesejo}
            />
          )}
        </Coluna>
      </div>

      <p className="text-[12.5px] text-fg2">
        Desejo não tem compromisso: vira meta quando vocês decidem juntos.
        Marcou por engano? &quot;Reabrir&quot; volta para as metas ou desejos.
      </p>

      {/* Modais */}
      <ConcluirMetaDialog
        meta={concluir}
        open={!!concluir}
        onOpenChange={(o) => !o && setConcluir(null)}
      />
      <RealizarDesejoDialog
        desejo={realizar}
        open={!!realizar}
        onOpenChange={(o) => !o && setRealizar(null)}
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

const DESEJOS_VISIVEIS = 5;

/** Uma coluna do quadro (protótipo v2): título com contagem + ação. */
const Coluna = ({
  titulo,
  quantidade,
  tom,
  acao,
  oculta,
  children,
}: {
  titulo: string;
  quantidade: number;
  tom: string;
  /** Escondida só no celular (aba não selecionada). */
  oculta?: boolean;
  acao?: { label: string; onClick: () => void; primaria: boolean };
  children: React.ReactNode;
}) => (
  <section
    aria-label={titulo}
    className={cn(
      "flex flex-col gap-[10px] rounded-[24px] p-[14px]",
      tom,
      oculta && "max-lg:hidden",
    )}
  >
    <div className="flex items-center justify-between px-[6px] pb-1 pt-1">
      <h2 className="text-[15px] font-bold">
        {titulo} <span className="font-semibold text-fg2">{quantidade}</span>
      </h2>
      {acao && (
        <button
          type="button"
          onClick={acao.onClick}
          className={cn(
            "flex h-8 items-center gap-1 rounded-full px-3 text-[13px] font-bold",
            acao.primaria ? "bg-primary text-white" : "bg-card text-fg",
          )}
        >
          <Plus className="size-[13px]" strokeWidth={2.6} />
          {acao.label}
        </button>
      )}
    </div>
    {children}
  </section>
);

const Esqueleto = () => (
  <>
    {Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={i} className="h-[130px] rounded-[18px]" />
    ))}
  </>
);

const Vazio = ({ texto }: { texto: string }) => (
  <p className="px-[6px] py-3 text-[13px] text-fg2">{texto}</p>
);

export default Goals;
