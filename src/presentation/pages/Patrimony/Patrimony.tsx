import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import type { Patrimonio } from "@/domain/models";
import {
  useGetEvolucaoPatrimonio,
  useGetPatrimonios,
  useGetResumoPatrimonio,
} from "@/presentation/hooks/api";

import {
  ComposicaoAtivos,
  EvolucaoChart,
  PatrimonioList,
  PatrimonyFormDialog,
  PatrimonyKpis,
} from "./components";
import { evolucaoRange, toEvolucaoPoints } from "./patrimony.helpers";
import { usePatrimonyMutations } from "./usePatrimonyMutations";

/**
 * Patrimônio (nova identidade). KPIs (líquido/ativos/passivos), gráfico de
 * evolução (Recharts) + composição dos ativos e a lista de itens. Criar/editar
 * via modal; excluir com desfazer.
 */
const Patrimony = () => {
  const [dialog, setDialog] = useState<{
    open: boolean;
    item: Patrimonio | null;
  }>({ open: false, item: null });

  // Janela do gráfico de evolução: últimos 12 meses (estável no mount).
  const range = useMemo(() => evolucaoRange(new Date()), []);

  const patrimonios = useGetPatrimonios();
  const resumo = useGetResumoPatrimonio();
  const evolucao = useGetEvolucaoPatrimonio(range);
  const { remove } = usePatrimonyMutations();

  const rows = patrimonios.data?.data?.rows ?? [];
  const evolucaoPoints = useMemo(
    () => toEvolucaoPoints(evolucao.data?.data?.series ?? []),
    [evolucao.data],
  );

  const openNew = () => setDialog({ open: true, item: null });
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
    <div className="animate-om-fade">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-[30px] font-bold -tracking-[0.025em] text-fg">
          Patrimônio
        </h1>
        <button
          type="button"
          onClick={openNew}
          className="flex items-center gap-[7px] rounded-[12px] bg-primary px-[17px] py-[11px] text-sm font-semibold text-white shadow-primary transition-colors hover:bg-primary-strong"
        >
          <Plus className="size-4" strokeWidth={2.4} />
          Novo item
        </button>
      </div>

      {/* KPIs */}
      <PatrimonyKpis resumo={resumo.data?.data} isLoading={resumo.isLoading} />

      {/* Gráficos */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <EvolucaoChart points={evolucaoPoints} isLoading={evolucao.isLoading} />
        <ComposicaoAtivos
          itens={resumo.data?.data?.distribuicaoAtivos ?? []}
          isLoading={resumo.isLoading}
        />
      </div>

      {/* Lista de itens */}
      <div className="mt-4">
        <PatrimonioList
          rows={rows}
          isLoading={patrimonios.isLoading}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </div>

      <PatrimonyFormDialog
        item={dialog.item}
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
      />
    </div>
  );
};

export default Patrimony;
