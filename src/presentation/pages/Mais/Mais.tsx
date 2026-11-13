import {
  CalendarDays,
  ChevronRight,
  Landmark,
  type LucideIcon,
  Target,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useTheme } from "@/App";
import { cn } from "@/lib/utils";
import { useNavCounts } from "@/presentation/components/AppShell/useNavCounts";
import {
  useGetCategorias,
  useGetContasVinculadas,
  useGetMeiosPagamento,
  useGetMetas,
  useGetPessoas,
  useGetRecorrencias,
  useGetResumoPatrimonio,
  useGetTags,
  usePostLogoutGoogle,
} from "@/presentation/hooks/api";
import { urlRouters } from "@/presentation/router/router.definitions";
import { useAuthStore } from "@/presentation/store";

const OPT = { page: 1, limit: 100 };

const compacto = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

const plural = (n: number, um: string, varios: string) =>
  `${n} ${n === 1 ? um : varios}`;

interface Atalho {
  titulo: string;
  sub?: string;
  to: string;
  icon: LucideIcon;
  tom: string;
}

/**
 * "Mais" (mobile, prototipo/v2/m-Mais): atalhos para as telas fora da barra
 * (Agenda, Patrimônio, Metas, Importar extrato), as seções de Ajustes com
 * contagem, tema escuro e a conta (sair).
 */
const Mais = () => {
  const { darkMode, setDarkMode } = useTheme();
  const { auth, resetState } = useAuthStore();
  const { mutate: logout, isPending: saindo } = usePostLogoutGoogle();
  const counts = useNavCounts();
  const patrimonio = useGetResumoPatrimonio();
  const metas = useGetMetas();
  const categorias = useGetCategorias(OPT);
  const pessoas = useGetPessoas(OPT);
  const meios = useGetMeiosPagamento(OPT);
  const recorrencias = useGetRecorrencias();
  const tags = useGetTags();
  const contas = useGetContasVinculadas();

  const liquido = patrimonio.data?.data?.patrimonioLiquido;
  const emAndamento = (metas.data?.data ?? []).filter(
    (m) => m.status !== "concluida",
  ).length;

  const atalhos: Atalho[] = [
    {
      titulo: "Agenda",
      sub:
        counts.agenda !== undefined
          ? plural(counts.agenda, "conta a pagar", "contas a pagar")
          : undefined,
      to: urlRouters.agenda,
      icon: CalendarDays,
      tom: "bg-danger/10 text-danger",
    },
    {
      titulo: "Patrimônio",
      sub:
        liquido !== undefined
          ? `${compacto.format(liquido)} líquido`
          : undefined,
      to: urlRouters.patrimony,
      icon: Landmark,
      tom: "bg-success/10 text-success",
    },
    {
      titulo: "Metas",
      sub: metas.data ? `${emAndamento} em andamento` : undefined,
      to: urlRouters.goals,
      icon: Target,
      tom: "bg-warning/10 text-warning",
    },
    {
      titulo: "Importar extrato",
      sub: "CSV ou OFX",
      to: urlRouters.revisarImportar,
      icon: Upload,
      tom: "bg-primary-soft text-primary-strong dark:text-[#B3A9FF]",
    },
  ];

  const secoes: { titulo: string; secao: string; n?: number }[] = [
    {
      titulo: "Categorias",
      secao: "categorias",
      n: categorias.data?.data?.rows?.length,
    },
    {
      titulo: "Pessoas",
      secao: "pessoas",
      n: pessoas.data?.data?.rows?.length,
    },
    {
      titulo: "Meios de pagamento",
      secao: "meios",
      n: meios.data?.data?.rows?.length,
    },
    {
      titulo: "Contas recorrentes",
      secao: "recorrentes",
      n: recorrencias.data?.data?.length,
    },
    { titulo: "Tags", secao: "tags", n: tags.data?.data?.length },
    {
      titulo: "Bancos conectados",
      secao: "bancos",
      n: contas.data?.data?.length,
    },
  ];

  const nome = auth?.user?.nome ?? "Usuário";
  const iniciais = nome
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex animate-om-fade flex-col gap-3">
      <h1 className="font-display text-2xl font-bold">Mais</h1>

      <div className="grid grid-cols-2 gap-[10px]">
        {atalhos.map((a) => (
          <Link
            key={a.titulo}
            to={a.to}
            className="flex h-[104px] flex-col justify-between rounded-[20px] border border-line bg-card p-[14px] transition-colors hover:border-primary/40"
          >
            <span
              className={cn(
                "grid size-9 place-items-center rounded-[12px]",
                a.tom,
              )}
            >
              <a.icon className="size-[18px]" strokeWidth={2.1} />
            </span>
            <span>
              <span className="block text-[15px] font-bold">{a.titulo}</span>
              <span className="block min-h-[18px] truncate text-xs text-fg2">
                {a.sub}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <section className="overflow-hidden rounded-[20px] border border-line bg-card">
        {secoes.map((s) => (
          <Link
            key={s.secao}
            to={`${urlRouters.ajustes}?secao=${s.secao}`}
            className="flex min-h-[52px] items-center justify-between border-t border-line2 px-4 text-[15px] font-semibold first:border-t-0 hover:bg-bg"
          >
            <span>{s.titulo}</span>
            <span className="flex items-center gap-1 text-[13px] font-medium text-muted">
              {s.n}
              <ChevronRight className="size-4" />
            </span>
          </Link>
        ))}
      </section>

      <section className="overflow-hidden rounded-[20px] border border-line bg-card">
        <div className="flex min-h-[52px] items-center justify-between px-4 text-[15px] font-semibold">
          <span id="mais-tema">Tema escuro</span>
          <button
            type="button"
            role="switch"
            aria-checked={darkMode}
            aria-labelledby="mais-tema"
            onClick={() => setDarkMode(!darkMode)}
            className={cn(
              "flex h-[26px] w-11 items-center rounded-full p-[3px] transition-colors",
              darkMode ? "justify-end bg-primary" : "justify-start bg-track",
            )}
          >
            <span className="size-5 rounded-full bg-white shadow-sm" />
          </button>
        </div>
        <div className="flex min-h-[60px] items-center gap-3 border-t border-line2 px-4">
          <span className="grid size-[34px] shrink-0 place-items-center rounded-full bg-primary-soft text-[13px] font-bold text-primary-strong dark:text-[#B3A9FF]">
            {iniciais}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14.5px] font-semibold">
              {nome}
            </span>
            <span className="text-xs text-fg2">conta compartilhada</span>
          </span>
          <button
            type="button"
            disabled={saindo}
            onClick={() => logout(undefined, { onSuccess: () => resetState() })}
            className="h-9 rounded-[10px] bg-danger/10 px-3 text-[13px] font-semibold text-danger disabled:opacity-60"
          >
            Sair
          </button>
        </div>
      </section>
    </div>
  );
};

export default Mais;
