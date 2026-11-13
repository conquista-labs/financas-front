import { useMemo, useState } from "react";
import { toast } from "sonner";

import type { Patrimonio } from "@/domain/models";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/presentation/components/ui";
import {
  useGetEvolucaoPatrimonio,
  useGetPatrimonios,
  useGetResumoPatrimonio,
  usePatrimonioMutations,
} from "@/presentation/hooks/api";

import { GrupoCard, PatrimonioHero, PatrimonyFormDialog } from "./components";
import {
  COR_DO_GRUPO,
  evolucaoRange,
  fatiasDaBarra,
  GRUPO_LABEL,
  NOVOS,
  resumoPorGrupo,
  toEvolucaoPoints,
} from "./patrimony.helpers";

const LISTA_COMPLETA = { page: 1, limit: 200 };

/**
 * Patrimônio do "Repaginado": card escuro com o líquido e a evolução, barra
 * de composição por grupo e um card por grupo com os itens. "+ Imóvel / +
 * Veículo / + Investimento / + Dívida" abrem o formulário já na categoria.
 * Excluir tem "Desfazer" (recria a partir do item).
 */
const Patrimony = () => {
  const [dialog, setDialog] = useState<{
    open: boolean;
    item: Patrimonio | null;
    categoria?: string;
  }>({ open: false, item: null });

  // Janela da evolução: últimos 12 meses (estável no mount).
  const range = useMemo(() => evolucaoRange(new Date()), []);

  const patrimonios = useGetPatrimonios(LISTA_COMPLETA);
  const resumo = useGetResumoPatrimonio();
  const evolucao = useGetEvolucaoPatrimonio(range);
  const { remove } = usePatrimonioMutations();

  const rows = useMemo(
    () => patrimonios.data?.data?.rows ?? [],
    [patrimonios.data],
  );
  const grupos = useMemo(() => resumoPorGrupo(rows), [rows]);
  const fatias = fatiasDaBarra(grupos);
  const pontos = useMemo(
    () => toEvolucaoPoints(evolucao.data?.data?.series ?? []),
    [evolucao.data],
  );

  const openEdit = (item: Patrimonio) => setDialog({ open: true, item });

  const handleDelete = (item: Patrimonio) =>
    remove.mutate(item.id, {
      onSuccess: () =>
        toast.success(`"${item.descricao}" excluído.`, {
          // O back não expõe restore; "Desfazer" recria a partir do item.
          action: {
            label: "Desfazer",
            onClick: () => setDialog({ open: true, item }),
          },
        }),
      onError: (e) => toast.error(e.message),
    });

  return (
    <div className="flex animate-om-fade flex-col gap-4 pb-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-[30px] font-bold -tracking-[0.03em] text-fg">
          Patrimônio
        </h1>
        <div className="flex flex-wrap gap-[6px]">
          {NOVOS.map((n) => (
            <button
              key={n.categoria}
              type="button"
              onClick={() =>
                setDialog({ open: true, item: null, categoria: n.categoria })
              }
              className="h-10 rounded-full border border-line bg-card px-[14px] text-[13px] font-semibold text-fg transition-colors hover:bg-bg"
            >
              + {n.label}
            </button>
          ))}
        </div>
      </header>

      <PatrimonioHero
        resumo={resumo.data?.data}
        pontos={pontos}
        isLoading={resumo.isLoading}
      />

      {fatias.length > 1 && (
        <div
          role="img"
          aria-label={`Composição do patrimônio: ${fatias
            .map((f) => `${GRUPO_LABEL[f.grupo]} ${formatCurrency(f.valor)}`)
            .join(", ")}`}
          className="flex h-[14px] gap-[3px] overflow-hidden rounded-full"
        >
          {fatias.map((f) => (
            <span
              key={f.grupo}
              title={`${GRUPO_LABEL[f.grupo]}: ${formatCurrency(f.valor)}`}
              style={{ flex: f.valor, backgroundColor: COR_DO_GRUPO[f.grupo] }}
            />
          ))}
        </div>
      )}

      {patrimonios.isLoading ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[200px] rounded-[24px]" />
          ))}
        </div>
      ) : grupos.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-line bg-card/50 px-6 py-16 text-center">
          <p className="text-sm font-semibold text-fg">
            Nenhum patrimônio ainda
          </p>
          <p className="mt-1 text-sm text-muted">
            Adicione seus bens e dívidas para acompanhar o patrimônio líquido.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-4">
          {grupos.map((g) => (
            <GrupoCard
              key={g.grupo}
              grupo={g}
              rows={rows}
              deletingId={remove.isPending ? remove.variables : undefined}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <PatrimonyFormDialog
        item={dialog.item}
        categoriaInicial={dialog.categoria}
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
      />
    </div>
  );
};

export default Patrimony;
