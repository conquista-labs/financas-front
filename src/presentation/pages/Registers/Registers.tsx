import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  useGetCategorias,
  useGetMeiosPagamento,
  useGetPessoas,
} from "@/presentation/hooks/api";

import {
  CategoriaList,
  MeioList,
  PessoaList,
  RegisterFormDialog,
  type RegisterItem,
} from "./components";
import { registerTab } from "./registers.styles";
import {
  type RegisterKind,
  useRegisterMutations,
} from "./useRegisterMutations";

const OPT_LIMIT = { page: 1, limit: 100 };

type Tab = RegisterKind | "recorrente" | "tag";

const TABS: { id: Tab; label: string }[] = [
  { id: "categoria", label: "Categorias" },
  { id: "pessoa", label: "Pessoas" },
  { id: "meio", label: "Meios de pagamento" },
  { id: "recorrente", label: "Recorrentes" },
  { id: "tag", label: "Tags" },
];

/** É uma aba de cadastro com CRUD (categoria/pessoa/meio)? */
const isRegisterKind = (tab: Tab): tab is RegisterKind =>
  tab === "categoria" || tab === "pessoa" || tab === "meio";

/**
 * Hub de Cadastros (nova identidade). Abas Categorias/Pessoas/Meios com CRUD
 * completo + favorito; Recorrentes/Tags como placeholder (Etapa 3). Criar/
 * editar via modal único.
 */
const Registers = () => {
  const [tab, setTab] = useState<Tab>("categoria");
  const [dialog, setDialog] = useState<{
    open: boolean;
    kind: RegisterKind;
    item: RegisterItem | null;
  }>({ open: false, kind: "categoria", item: null });

  const categorias = useGetCategorias(OPT_LIMIT);
  const pessoas = useGetPessoas(OPT_LIMIT);
  const meios = useGetMeiosPagamento(OPT_LIMIT);

  // Mutations da aba ativa (fallback categoria nas abas sem CRUD).
  const activeKind: RegisterKind = isRegisterKind(tab) ? tab : "categoria";
  const { remove, toggleFavorito } = useRegisterMutations(activeKind);

  const openNew = () => {
    if (!isRegisterKind(tab)) {
      toast.info(
        tab === "tag"
          ? "Tags são criadas ao lançar uma transação."
          : "Recorrentes chegam em breve.",
      );
      return;
    }
    setDialog({ open: true, kind: tab, item: null });
  };

  const openEdit = (kind: RegisterKind) => (item: RegisterItem) =>
    setDialog({ open: true, kind, item });

  const handleDelete = (id: string) =>
    remove.mutate(id, {
      onSuccess: () => toast.success("Cadastro excluído."),
      onError: (e) => toast.error(e.message),
    });

  const handleFavorito = (id: string, favorito: boolean) =>
    toggleFavorito.mutate({ id, favorito });

  return (
    <div className="animate-om-fade">
      <h1 className="mb-4 font-display text-[30px] font-bold -tracking-[0.025em] text-fg">
        Cadastros
      </h1>

      {/* Abas + Novo */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={registerTab({ active: tab === t.id })}
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          onClick={openNew}
          className="ml-auto flex items-center gap-[7px] rounded-[12px] bg-primary px-[17px] py-[11px] text-sm font-semibold text-white shadow-primary transition-colors hover:bg-primary-strong"
        >
          <Plus className="size-4" strokeWidth={2.4} />
          Novo
        </button>
      </div>

      {/* Conteúdo da aba */}
      {tab === "categoria" && (
        <CategoriaList
          rows={categorias.data?.data?.rows ?? []}
          isLoading={categorias.isLoading}
          onEdit={openEdit("categoria")}
          onDelete={handleDelete}
          onToggleFavorito={handleFavorito}
        />
      )}
      {tab === "pessoa" && (
        <PessoaList
          rows={pessoas.data?.data?.rows ?? []}
          isLoading={pessoas.isLoading}
          onEdit={openEdit("pessoa")}
          onDelete={handleDelete}
          onToggleFavorito={handleFavorito}
        />
      )}
      {tab === "meio" && (
        <MeioList
          rows={meios.data?.data?.rows ?? []}
          isLoading={meios.isLoading}
          onEdit={openEdit("meio")}
          onDelete={handleDelete}
          onToggleFavorito={handleFavorito}
        />
      )}
      {(tab === "recorrente" || tab === "tag") && (
        <div className="rounded-card border border-dashed border-line bg-card/50 px-6 py-16 text-center">
          <p className="text-sm font-semibold text-fg">
            {tab === "tag" ? "Tags" : "Contas recorrentes"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {tab === "tag"
              ? "As tags são criadas ao lançar uma transação. Em breve você poderá gerenciá-las aqui."
              : "Contas a pagar recorrentes chegam em breve."}
          </p>
        </div>
      )}

      <RegisterFormDialog
        kind={dialog.kind}
        item={dialog.item}
        open={dialog.open}
        onOpenChange={(open) => setDialog((d) => ({ ...d, open }))}
      />
    </div>
  );
};

export default Registers;
