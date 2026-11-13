import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { StringParam, useQueryParam, withDefault } from "use-query-params";

import { cn } from "@/lib/utils";
import { useQuickAdd } from "@/presentation/components/QuickAdd";
import {
  type CadastroKind,
  useGetCategorias,
  useGetContasVinculadas,
  useGetMeiosPagamento,
  useGetPessoas,
  useGetRecorrencias,
  useGetTags,
} from "@/presentation/hooks/api";

import {
  SecaoAparencia,
  SecaoBancos,
  SecaoCategorias,
  SecaoMeios,
  SecaoPessoas,
  SecaoRecorrentes,
  SecaoTags,
} from "./ajustes/Secoes";
import { RegisterFormDialog, type RegisterItem } from "./components";

const OPT = { page: 1, limit: 100 };

type Secao =
  | "categorias"
  | "pessoas"
  | "meios"
  | "recorrentes"
  | "tags"
  | "bancos"
  | "aparencia";

const TEXTOS: Record<Secao, { titulo: string; sub: string; novo?: string }> = {
  categorias: {
    titulo: "Categorias",
    sub: "Teto e cor direto na linha. As favoritas aparecem primeiro no Lançar.",
    novo: "+ Nova categoria",
  },
  pessoas: {
    titulo: "Pessoas",
    sub: "De quem é cada lançamento.",
    novo: "+ Nova pessoa",
  },
  meios: {
    titulo: "Meios de pagamento",
    sub: "Cartões, contas e Pix. Cartão de crédito com vencimento lança na data da fatura.",
    novo: "+ Novo meio",
  },
  recorrentes: {
    titulo: "Contas recorrentes",
    sub: "Contas que se repetem todo mês e aparecem na Agenda.",
    novo: "+ Nova conta",
  },
  tags: {
    titulo: "Tags",
    sub: "Agrupam gastos entre categorias (ex.: #viagem-praia).",
  },
  bancos: {
    titulo: "Bancos conectados",
    sub: "Contas do Open Finance (Pluggy) que trazem lançamentos para o Revisar.",
  },
  aparencia: { titulo: "Aparência", sub: "Tema claro ou escuro." },
};

/**
 * Ajustes do "Repaginado": menu de seções à esquerda (com contagens) e a
 * seção escolhida à direita, no padrão de lista do protótipo v2. A seção fica
 * na URL (?secao=), para dar para linkar direto (ex.: do "Pede atenção").
 */
const Registers = () => {
  const [secaoParam, setSecao] = useQueryParam(
    "secao",
    withDefault(StringParam, "categorias"),
  );
  const secao = (secaoParam in TEXTOS ? secaoParam : "categorias") as Secao;
  const { openQuickAddCom } = useQuickAdd();
  // Celular: centraliza o chip da seção escolhida (só rolagem lateral).
  const chipsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = chipsRef.current;
    const el = c?.querySelector<HTMLElement>("[aria-current=page]");
    if (c && el && c.scrollWidth > c.clientWidth)
      c.scrollLeft = el.offsetLeft - (c.clientWidth - el.clientWidth) / 2;
  }, [secao]);
  const [dialog, setDialog] = useState<{
    open: boolean;
    kind: CadastroKind;
    item: RegisterItem | null;
  }>({ open: false, kind: "categoria", item: null });

  const categorias = useGetCategorias(OPT);
  const pessoas = useGetPessoas(OPT);
  const meios = useGetMeiosPagamento(OPT);
  const recorrencias = useGetRecorrencias();
  const tags = useGetTags();
  const contas = useGetContasVinculadas();

  const menu: { id: Secao; n?: number }[] = [
    { id: "categorias", n: categorias.data?.data?.rows?.length },
    { id: "pessoas", n: pessoas.data?.data?.rows?.length },
    { id: "meios", n: meios.data?.data?.rows?.length },
    { id: "recorrentes", n: recorrencias.data?.data?.length },
    { id: "tags", n: tags.data?.data?.length },
    { id: "bancos", n: contas.data?.data?.length },
    { id: "aparencia" },
  ];

  const abrir = (kind: CadastroKind, item: RegisterItem | null) =>
    setDialog({ open: true, kind, item });
  const novo = () => {
    if (secao === "categorias") abrir("categoria", null);
    else if (secao === "pessoas") abrir("pessoa", null);
    else if (secao === "meios") abrir("meio", null);
    else if (secao === "recorrentes")
      openQuickAddCom({ repeticao: "mensal", status: "pendente" });
  };
  const t = TEXTOS[secao];

  return (
    <div className="flex animate-om-fade flex-wrap items-start gap-6 pb-8">
      <nav
        aria-label="Seções de ajustes"
        className="flex w-full flex-col gap-1 lg:w-auto lg:max-w-[260px] lg:flex-[1_1_220px]"
      >
        <h1 className="mb-3 font-display text-[26px] font-bold -tracking-[0.03em] text-fg sm:text-[30px]">
          Ajustes
        </h1>
        {/* Celular: seções numa linha de chips com rolagem; desktop: lista. */}
        <div
          ref={chipsRef}
          className="relative flex gap-1 max-lg:-mx-4 max-lg:overflow-x-auto max-lg:px-4 max-lg:[scrollbar-width:none] lg:flex-col"
        >
          {menu.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-current={secao === m.id ? "page" : undefined}
              onClick={() => setSecao(m.id === "categorias" ? undefined : m.id)}
              className={cn(
                "flex shrink-0 items-center justify-between gap-2 whitespace-nowrap text-sm font-semibold transition-colors max-lg:h-9 max-lg:rounded-full max-lg:border max-lg:px-[14px] lg:h-11 lg:rounded-[12px] lg:px-3",
                secao === m.id
                  ? "bg-card text-fg shadow-[0_1px_3px_rgba(0,0,0,.06)] max-lg:border-primary"
                  : "text-fg2 hover:bg-card/60 max-lg:border-line",
              )}
            >
              <span>{TEXTOS[m.id].titulo}</span>
              {m.n !== undefined && (
                <span className="font-medium text-muted">{m.n}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex min-w-0 flex-[3_1_520px] flex-col gap-[14px]">
        <div className="flex flex-wrap items-center justify-between gap-[10px]">
          <div>
            <h2 className="font-display text-[22px] font-bold">{t.titulo}</h2>
            <p className="mt-[2px] text-[13.5px] text-fg2">{t.sub}</p>
          </div>
          {t.novo && (
            <button
              type="button"
              onClick={novo}
              className="flex h-10 items-center gap-[6px] rounded-full bg-primary px-4 text-[13.5px] font-semibold text-white hover:bg-primary-strong"
            >
              <Plus className="size-4" strokeWidth={2.6} />
              {t.novo.replace("+ ", "")}
            </button>
          )}
        </div>

        {secao === "categorias" && <SecaoCategorias abrir={abrir} />}
        {secao === "pessoas" && <SecaoPessoas abrir={abrir} />}
        {secao === "meios" && <SecaoMeios abrir={abrir} />}
        {secao === "recorrentes" && <SecaoRecorrentes />}
        {secao === "tags" && <SecaoTags />}
        {secao === "bancos" && <SecaoBancos />}
        {secao === "aparencia" && <SecaoAparencia />}
      </div>

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
