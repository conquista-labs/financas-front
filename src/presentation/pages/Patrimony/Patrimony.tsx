import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import type { Patrimonio } from "@/domain/models";
import {
  useGetEvolucaoPatrimonio,
  useGetPatrimonios,
  useGetResumoPatrimonio,
  usePatrimonioMutations,
} from "@/presentation/hooks/api";

import {
  EvolucaoChart,
  PatrimonioList,
  PatrimonyFormDialog,
  PatrimonyKpis,
  PatrimonyTabs,
  ReservasResumo,
  ResumoGrupos,
} from "./components";
import {
  type Aba,
  CATEGORIA_DA_ABA,
  evolucaoRange,
  resumoPorGrupo,
  toEvolucaoPoints,
} from "./patrimony.helpers";

const LISTA_COMPLETA = { page: 1, limit: 200 };

const NOVO_LABEL: Record<Aba, string> = {
  resumo: "Novo item",
  imoveis: "Novo imóvel",
  veiculos: "Novo veículo",
  reservas: "Novo investimento",
  dividas: "Nova dívida",
};

/**
 * Patrimônio (nova identidade). KPIs (líquido/ativos/dívidas) e abas: Resumo
 * (evolução + consolidado por grupo) e uma por grupo (Imóveis, Veículos,
 * Investimentos e reservas, Dívidas soltas) com a lista dele. A aba fica na
 * URL (?aba=). Criar/editar via modal; excluir com desfazer.
 */
const Patrimony = () => {
  const [dialog, setDialog] = useState<{
    open: boolean;
    item: Patrimonio | null;
    categoria?: string;
  }>({ open: false, item: null });

  // Janela do gráfico de evolução: últimos 12 meses (estável no mount).
  const range = useMemo(() => evolucaoRange(new Date()), []);

  // Todos os itens (o padrão da API é 10 por página e a tela não pagina).
  const patrimonios = useGetPatrimonios(LISTA_COMPLETA);
  const resumo = useGetResumoPatrimonio();
  const evolucao = useGetEvolucaoPatrimonio(range);
  const { remove } = usePatrimonioMutations();

  const rows = useMemo(
    () => patrimonios.data?.data?.rows ?? [],
    [patrimonios.data],
  );
  const grupos = useMemo(() => resumoPorGrupo(rows), [rows]);

  // Aba na URL (?aba=imoveis): volta e recarregar mantêm. Grupo sem itens
  // (ou valor inválido) cai no Resumo.
  const [params, setParams] = useSearchParams();
  const pedida = params.get("aba");
  const grupoAtual = grupos.find((g) => g.grupo === pedida);
  const aba: Aba = grupoAtual?.grupo ?? "resumo";
  const irPara = (nova: Aba) =>
    setParams(nova === "resumo" ? {} : { aba: nova }, { replace: true });
  const evolucaoPoints = useMemo(
    () => toEvolucaoPoints(evolucao.data?.data?.series ?? []),
    [evolucao.data],
  );

  const openNew = () =>
    setDialog({ open: true, item: null, categoria: CATEGORIA_DA_ABA[aba] });
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
          {NOVO_LABEL[aba]}
        </button>
      </div>

      {/* KPIs */}
      <PatrimonyKpis resumo={resumo.data?.data} isLoading={resumo.isLoading} />

      <div className="mt-5">
        <PatrimonyTabs aba={aba} grupos={grupos} onChange={irPara} />
      </div>

      {aba === "resumo" ? (
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <EvolucaoChart
            points={evolucaoPoints}
            isLoading={evolucao.isLoading}
          />
          <ResumoGrupos
            grupos={grupos}
            isLoading={patrimonios.isLoading}
            onAbrir={irPara}
          />
        </div>
      ) : (
        <>
          {aba === "reservas" && (
            <ReservasResumo
              linhas={grupoAtual?.linhas ?? []}
              saldoDisponivel={resumo.data?.data?.saldoDisponivel ?? 0}
            />
          )}
          <PatrimonioList
            rows={rows}
            linhas={grupoAtual?.linhas ?? []}
            isLoading={patrimonios.isLoading}
            deletingId={remove.isPending ? remove.variables : undefined}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        </>
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
