import type { Patrimonio } from "@/domain/models";
import { formatCurrency } from "@/lib/format";

interface ReservasResumoProps {
  linhas: Patrimonio[];
  /** Saldo das contas (receitas - despesas lançadas). */
  saldoDisponivel: number;
}

const soma = (rows: Patrimonio[]) => rows.reduce((s, r) => s + r.valorAtual, 0);

const nomes = (rows: Patrimonio[]) => rows.map((r) => r.descricao).join(", ");

/**
 * Topo da aba Investimentos e reservas: o dinheiro separado pelo quanto dá
 * para usar — na conta, investido e as outras reservas (FGTS, previdência…).
 */
export const ReservasResumo = ({
  linhas,
  saldoDisponivel,
}: ReservasResumoProps) => {
  const naConta = linhas.filter((r) => r.categoria === "disponivel");
  const investido = linhas.filter((r) => r.categoria === "investimento");
  const outras = linhas.filter(
    (r) => r.categoria !== "disponivel" && r.categoria !== "investimento",
  );
  const cards = [
    {
      label: "Na conta",
      valor: saldoDisponivel + soma(naConta),
      sub: naConta.length
        ? `saldo das contas + ${nomes(naConta)}`
        : "saldo das contas",
    },
    {
      label: "Investido",
      valor: soma(investido),
      sub: investido.length ? nomes(investido) : "nada cadastrado",
    },
    ...(outras.length
      ? [{ label: "Outras reservas", valor: soma(outras), sub: nomes(outras) }]
      : []),
  ];
  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-[16px] border border-line bg-card px-5 py-4"
        >
          <p className="text-[12.5px] text-muted">{c.label}</p>
          <p className="mt-1 font-display text-[22px] font-bold -tracking-[0.02em] text-fg">
            {formatCurrency(c.valor)}
          </p>
          <p className="mt-[2px] truncate text-[12px] text-muted">{c.sub}</p>
        </div>
      ))}
    </div>
  );
};
