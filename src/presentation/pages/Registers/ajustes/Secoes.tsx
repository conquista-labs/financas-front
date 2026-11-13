import { Monitor, Moon, Search, Sun } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useTheme } from "@/App";
import type { ContaVinculada, Tag } from "@/domain/models";
import { enhance } from "@/lib/color";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Combobox, DateField } from "@/presentation/components";
import { Skeleton } from "@/presentation/components/ui";
import {
  type CadastroKind,
  useCadastroMutations,
  useContaVinculadaMutations,
  useGetAnalyticsOrcamento,
  useGetCategorias,
  useGetContasVinculadas,
  useGetMeiosPagamento,
  useGetPessoas,
  useGetRecorrencias,
  useGetTags,
  useRecorrenciaMutations,
  useTagMutations,
} from "@/presentation/hooks/api";

import type { RegisterItem } from "../components";
import {
  filtrarCategorias,
  type FiltroCategoria,
  iniciais,
  nomeTipoMeio,
  resumoCategoria,
  resumoConta,
  resumoRecorrencia,
} from "./ajustes.helpers";
import { CampoValor, Interruptor, LinhaAjuste } from "./LinhaAjuste";

const OPT = { page: 1, limit: 100 };
const VISIVEIS = 12;

export type AbrirCadastro = (
  kind: CadastroKind,
  item: RegisterItem | null,
) => void;

// ── Peças comuns ───────────────────────────────────────────────────────────
const Busca = ({
  valor,
  onChange,
  placeholder,
}: {
  valor: string;
  onChange: (v: string) => void;
  placeholder: string;
}) => (
  <label className="flex h-10 max-w-[340px] flex-[1_1_240px] items-center gap-2 rounded-[12px] border border-line bg-card px-3 text-muted focus-within:border-primary">
    <Search className="size-[15px] shrink-0" />
    <input
      type="search"
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted"
    />
  </label>
);

const Chip = ({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    aria-pressed={ativo}
    onClick={onClick}
    className={cn(
      "h-10 rounded-full px-[14px] text-[13px] font-semibold transition-colors",
      ativo
        ? "bg-fg text-card"
        : "border border-line bg-card text-fg hover:border-primary/40",
    )}
  >
    {children}
  </button>
);

const Lista = ({
  isLoading,
  vazio,
  children,
  mais,
}: {
  isLoading?: boolean;
  vazio?: string | false;
  children: React.ReactNode;
  mais?: { restante: number; onClick: () => void };
}) => (
  <section className="overflow-hidden rounded-[22px] border border-line bg-card">
    {isLoading ? (
      <div className="flex flex-col gap-2 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[52px] rounded-[12px]" />
        ))}
      </div>
    ) : vazio ? (
      <p className="px-[18px] py-7 text-center text-[13.5px] text-fg2">
        {vazio}
      </p>
    ) : (
      children
    )}
    {mais && mais.restante > 0 && (
      <button
        type="button"
        onClick={mais.onClick}
        className="h-[46px] w-full border-t border-line2 bg-card2 text-[13px] font-semibold text-primary-strong hover:underline dark:text-[#B3A9FF]"
      >
        Ver todas ({mais.restante} a mais)
      </button>
    )}
  </section>
);

const erro = (e: Error) => toast.error(e.message || "Não foi possível salvar.");

// ── Categorias ─────────────────────────────────────────────────────────────
export const SecaoCategorias = ({ abrir }: { abrir: AbrirCadastro }) => {
  const hoje = new Date();
  const { data, isLoading } = useGetCategorias(OPT);
  const orc = useGetAnalyticsOrcamento({
    ano: hoje.getFullYear(),
    mes: hoje.getMonth() + 1,
  });
  const { update, remove, toggleFavorito } = useCadastroMutations("categoria");
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroCategoria>("todas");
  const [todas, setTodas] = useState(false);

  const linhas = data?.data?.rows ?? [];
  const doMes = new Map(
    (orc.data?.data?.orcamentoCategorias ?? []).map((o) => [
      o.categoriaId,
      { realizado: o.valorRealizado, percentual: o.percentualUtilizado },
    ]),
  );
  const filtradas = filtrarCategorias(linhas, { busca, filtro });
  const visiveis = todas || busca ? filtradas : filtradas.slice(0, VISIVEIS);
  const n = (f: FiltroCategoria) =>
    filtrarCategorias(linhas, { filtro: f }).length;

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Busca
          valor={busca}
          onChange={setBusca}
          placeholder="Buscar entre as categorias"
        />
        {(
          [
            ["todas", "Todas"],
            ["despesa", "Despesas"],
            ["receita", "Receitas"],
            ["teto", "Com teto"],
          ] as const
        ).map(([f, t]) => (
          <Chip key={f} ativo={filtro === f} onClick={() => setFiltro(f)}>
            {t} <span className="ml-1 font-medium opacity-70">{n(f)}</span>
          </Chip>
        ))}
      </div>
      <Lista
        isLoading={isLoading}
        vazio={
          !filtradas.length &&
          (busca ? `Nada encontrado para "${busca}".` : "Nenhuma categoria.")
        }
        mais={
          !todas && !busca
            ? {
                restante: filtradas.length - visiveis.length,
                onClick: () => setTodas(true),
              }
            : undefined
        }
      >
        {visiveis.map((c) => (
          <LinhaAjuste
            key={c.id}
            cor={enhance(c.cor)}
            nome={c.nome}
            selo={
              c.tipo === "receita"
                ? { texto: "Receita", tom: "success" }
                : { texto: "Despesa", tom: "danger" }
            }
            sub={resumoCategoria(c, doMes.get(c.id))}
            extra={
              c.tipo === "despesa" && (
                <CampoValor
                  label="Teto"
                  valor={c.tetoGasto ?? 0}
                  onSalvar={(v) =>
                    update.mutate(
                      { id: c.id, body: { tetoGasto: v } },
                      {
                        onSuccess: () =>
                          toast.success(
                            v
                              ? `Teto de ${c.nome}: ${formatCurrency(v)}`
                              : `${c.nome} sem teto`,
                          ),
                        onError: erro,
                      },
                    )
                  }
                />
              )
            }
            favorito={c.favorito}
            onFavorito={() =>
              toggleFavorito.mutate({ id: c.id, favorito: !c.favorito })
            }
            onEditar={() =>
              abrir("categoria", {
                id: c.id,
                nome: c.nome,
                tipo: c.tipo,
                tetoGasto: c.tetoGasto,
                cor: c.cor,
                favorito: c.favorito,
              })
            }
            onExcluir={() =>
              remove.mutate(c.id, {
                onSuccess: () => toast.success(`${c.nome} excluída.`),
                onError: erro,
              })
            }
            ocupado={remove.isPending && remove.variables === c.id}
          />
        ))}
      </Lista>
    </>
  );
};

// ── Pessoas ────────────────────────────────────────────────────────────────
export const SecaoPessoas = ({ abrir }: { abrir: AbrirCadastro }) => {
  const { data, isLoading } = useGetPessoas(OPT);
  const { remove, toggleFavorito } = useCadastroMutations("pessoa");
  const linhas = [...(data?.data?.rows ?? [])].sort(
    (a, b) =>
      Number(b.favorito) - Number(a.favorito) ||
      b.totalLancamentos - a.totalLancamentos,
  );
  return (
    <Lista isLoading={isLoading} vazio={!linhas.length && "Nenhuma pessoa."}>
      {linhas.map((p) => (
        <LinhaAjuste
          key={p.id}
          iniciais={iniciais(p.nome)}
          nome={p.nome}
          sub={[`${p.totalLancamentos} lançamentos`, p.email]
            .filter(Boolean)
            .join(" · ")}
          favorito={p.favorito}
          onFavorito={() =>
            toggleFavorito.mutate({ id: p.id, favorito: !p.favorito })
          }
          onEditar={() =>
            abrir("pessoa", {
              id: p.id,
              nome: p.nome,
              email: p.email,
              favorito: p.favorito,
            })
          }
          onExcluir={() =>
            remove.mutate(p.id, {
              onSuccess: () => toast.success(`${p.nome} excluída.`),
              onError: erro,
            })
          }
          ocupado={remove.isPending && remove.variables === p.id}
        />
      ))}
    </Lista>
  );
};

// ── Meios de pagamento ─────────────────────────────────────────────────────
export const SecaoMeios = ({ abrir }: { abrir: AbrirCadastro }) => {
  const { data, isLoading } = useGetMeiosPagamento(OPT);
  const { remove, toggleFavorito } = useCadastroMutations("meio");
  const linhas = [...(data?.data?.rows ?? [])].sort(
    (a, b) =>
      Number(b.favorito) - Number(a.favorito) ||
      b.totalLancamentos - a.totalLancamentos,
  );
  return (
    <Lista
      isLoading={isLoading}
      vazio={!linhas.length && "Nenhum meio de pagamento."}
    >
      {linhas.map((m) => (
        <LinhaAjuste
          key={m.id}
          iniciais={iniciais(m.nome)}
          nome={m.nome}
          selo={{
            texto: nomeTipoMeio(m.tipo),
            tom: m.tipo === "credito" ? "primary" : "neutral",
          }}
          sub={[
            `${m.totalLancamentos} lançamentos`,
            m.tipo === "credito" && m.diaVencimento
              ? `vence dia ${m.diaVencimento}`
              : null,
          ]
            .filter(Boolean)
            .join(" · ")}
          favorito={m.favorito}
          onFavorito={() =>
            toggleFavorito.mutate({ id: m.id, favorito: !m.favorito })
          }
          onEditar={() =>
            abrir("meio", {
              id: m.id,
              nome: m.nome,
              tipo: m.tipo,
              diaVencimento: m.diaVencimento,
              favorito: m.favorito,
            })
          }
          onExcluir={() =>
            remove.mutate(m.id, {
              onSuccess: () => toast.success(`${m.nome} excluído.`),
              onError: erro,
            })
          }
          ocupado={remove.isPending && remove.variables === m.id}
        />
      ))}
    </Lista>
  );
};

// ── Contas recorrentes ─────────────────────────────────────────────────────
type RecorrenciaComRelacoes = {
  id: string;
  descricao: string;
  valor: number;
  diaVencimento: number;
  ativa: boolean;
  categoria?: { nome: string } | null;
  meioPagamento?: { nome: string } | null;
  pessoa?: { nome: string } | null;
};

export const SecaoRecorrentes = () => {
  const { data, isLoading } = useGetRecorrencias();
  const { atualizar, excluir } = useRecorrenciaMutations();
  const linhas = (data?.data ?? []) as RecorrenciaComRelacoes[];
  return (
    <>
      <Lista
        isLoading={isLoading}
        vazio={
          !linhas.length &&
          'Nenhuma conta recorrente. Use "+ Nova conta" (ou Mensal no Lançar).'
        }
      >
        {linhas.map((r) => (
          <LinhaAjuste
            key={r.id}
            iniciais={iniciais(r.descricao)}
            nome={r.descricao}
            selo={r.ativa ? undefined : { texto: "Pausada", tom: "neutral" }}
            sub={resumoRecorrencia(r)}
            extra={
              <>
                <CampoValor
                  label="Valor"
                  valor={r.valor}
                  onSalvar={(v) =>
                    v > 0 &&
                    atualizar.mutate(
                      { id: r.id, body: { valor: v } },
                      {
                        onSuccess: () =>
                          toast.success(
                            "Valor atualizado nas próximas contas.",
                          ),
                        onError: erro,
                      },
                    )
                  }
                />
                <Interruptor
                  ligado={r.ativa}
                  label={`${r.descricao} ativa`}
                  disabled={atualizar.isPending}
                  onChange={(ativa) =>
                    atualizar.mutate(
                      { id: r.id, body: { ativa } },
                      {
                        onSuccess: () =>
                          toast.success(
                            ativa
                              ? "Reativada: as próximas contas voltaram."
                              : "Pausada: as próximas contas saíram da Agenda.",
                          ),
                        onError: erro,
                      },
                    )
                  }
                />
              </>
            }
            onExcluir={() =>
              excluir.mutate(r.id, {
                onSuccess: () =>
                  toast.success(
                    `${r.descricao} excluída (e as próximas pendentes).`,
                  ),
                onError: erro,
              })
            }
            ocupado={excluir.isPending && excluir.variables === r.id}
          />
        ))}
      </Lista>
      <p className="text-[12.5px] text-fg2">
        Pausar tira as próximas contas pendentes da Agenda; reativar traz de
        volta. Mudar o valor vale para as próximas que ainda não foram pagas.
      </p>
    </>
  );
};

// ── Tags ───────────────────────────────────────────────────────────────────
export const SecaoTags = () => {
  const { data, isLoading } = useGetTags();
  const { rename, remove } = useTagMutations();
  const [editando, setEditando] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const linhas = [...((data?.data ?? []) as Tag[])].sort(
    (a, b) => b.count - a.count,
  );

  const salvarNome = (t: Tag) => {
    const novo = nome
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/#/g, "");
    setEditando(null);
    if (!novo || novo === t.nome) return;
    rename.mutate(
      { id: t.id, nome: novo },
      {
        onSuccess: () => toast.success(`#${t.nome} agora é #${novo}.`),
        onError: erro,
      },
    );
  };

  return (
    <>
      <Lista
        isLoading={isLoading}
        vazio={!linhas.length && "Nenhuma tag ainda. Elas nascem ao lançar."}
      >
        {linhas.map((t) =>
          editando === t.id ? (
            <form
              key={t.id}
              onSubmit={(e) => {
                e.preventDefault();
                salvarNome(t);
              }}
              className="flex items-center gap-3 border-b border-line2 px-[18px] py-3"
            >
              <span className="text-[14.5px] font-semibold text-fg2">#</span>
              <input
                autoFocus
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                onBlur={() => salvarNome(t)}
                aria-label={`Novo nome para #${t.nome}`}
                className="h-9 flex-1 rounded-[10px] border border-primary px-[10px] text-sm outline-none"
              />
            </form>
          ) : (
            <LinhaAjuste
              key={t.id}
              iniciais="#"
              nome={`#${t.nome}`}
              sub={`${t.count} ${t.count === 1 ? "transação" : "transações"}`}
              onEditar={() => {
                setNome(t.nome);
                setEditando(t.id);
              }}
              editarLabel="Renomear"
              onExcluir={() =>
                remove.mutate(t.id, {
                  onSuccess: () =>
                    toast.success(
                      t.count
                        ? `#${t.nome} removida de ${t.count} ${t.count === 1 ? "transação" : "transações"}.`
                        : `#${t.nome} excluída.`,
                    ),
                  onError: erro,
                })
              }
              ocupado={remove.isPending && remove.variables === t.id}
            />
          ),
        )}
      </Lista>
      <p className="text-[12.5px] text-fg2">
        Renomear e excluir valem para todas as transações com a tag.
      </p>
    </>
  );
};

// ── Bancos conectados ──────────────────────────────────────────────────────
const ConfigConta = ({ c }: { c: ContaVinculada }) => {
  const { data: pessoas } = useGetPessoas(OPT);
  const { data: meios } = useGetMeiosPagamento(OPT);
  const { atualizar } = useContaVinculadaMutations();
  const salvar = (body: Parameters<typeof atualizar.mutate>[0]["body"]) =>
    atualizar.mutate(
      { id: c.id, body },
      { onSuccess: () => toast.success("Conta atualizada."), onError: erro },
    );

  return (
    <div className="grid grid-cols-1 gap-3 bg-card2 px-[18px] py-4 sm:grid-cols-3">
      <label className="flex flex-col gap-[5px] text-xs font-semibold text-fg2">
        Titular
        <Combobox
          inline
          options={(pessoas?.data?.rows ?? []).map((p) => ({
            value: p.id,
            label: p.nome,
          }))}
          value={c.pessoaId ?? undefined}
          onChange={(v) => v !== (c.pessoaId ?? "") && salvar({ pessoaId: v })}
          placeholder="Escolher"
          clearLabel="Ninguém"
          searchPlaceholder="Buscar pessoa…"
        />
      </label>
      <label className="flex flex-col gap-[5px] text-xs font-semibold text-fg2">
        Meio de pagamento
        <Combobox
          inline
          options={(meios?.data?.rows ?? []).map((m) => ({
            value: m.id,
            label: m.nome,
          }))}
          value={c.meioPagamentoId ?? undefined}
          onChange={(v) =>
            v !== (c.meioPagamentoId ?? "") && salvar({ meioPagamentoId: v })
          }
          placeholder="Escolher"
          clearLabel="Nenhum"
          searchPlaceholder="Buscar meio…"
        />
      </label>
      <label className="flex flex-col gap-[5px] text-xs font-semibold text-fg2">
        Trazer lançamentos desde
        <DateField
          inline
          value={c.sincronizarDesde.slice(0, 10)}
          onChange={(v) =>
            v &&
            v !== c.sincronizarDesde.slice(0, 10) &&
            salvar({ sincronizarDesde: v })
          }
        />
        {c.sugestaoSincronizarDesde &&
          c.sugestaoSincronizarDesde !== c.sincronizarDesde.slice(0, 10) && (
            <button
              type="button"
              onClick={() =>
                salvar({ sincronizarDesde: c.sugestaoSincronizarDesde! })
              }
              className="self-start text-[12px] font-semibold text-primary-strong hover:underline dark:text-[#B3A9FF]"
            >
              Usar {c.sugestaoSincronizarDesde.split("-").reverse().join("/")}{" "}
              (dia após o último lançamento)
            </button>
          )}
      </label>
    </div>
  );
};

export const SecaoBancos = () => {
  const { data, isLoading } = useGetContasVinculadas();
  const { atualizar } = useContaVinculadaMutations();
  const [aberta, setAberta] = useState<string | null>(null);
  const linhas = data?.data ?? [];
  return (
    <>
      <Lista
        isLoading={isLoading}
        vazio={!linhas.length && "Nenhuma conta conectada pelo Pluggy ainda."}
      >
        {linhas.map((c) => (
          <LinhaAjuste
            key={c.id}
            iniciais={iniciais(c.nome)}
            nome={c.nome}
            selo={{
              texto: c.tipo === "CREDIT" ? "Cartão" : "Conta",
              tom: "neutral",
            }}
            sub={
              c.ultimoErro
                ? `⚠ ${c.ultimoErro}`
                : resumoConta(c) +
                  (c.ultimaSincronizacao
                    ? ` · sincronizou ${new Date(c.ultimaSincronizacao).toLocaleDateString("pt-BR")}`
                    : "")
            }
            extra={
              <Interruptor
                ligado={c.ativa}
                label={`${c.nome} ativa`}
                disabled={atualizar.isPending}
                onChange={(ativa) => {
                  if (ativa && !c.pessoaId) {
                    toast.error("Defina o titular antes de ativar.");
                    setAberta(c.id);
                    return;
                  }
                  atualizar.mutate(
                    { id: c.id, body: { ativa } },
                    {
                      onSuccess: () =>
                        toast.success(
                          ativa
                            ? `${c.nome} vai sincronizar.`
                            : `${c.nome} pausada.`,
                        ),
                      onError: erro,
                    },
                  );
                }}
              />
            }
            onEditar={() => setAberta(aberta === c.id ? null : c.id)}
            editarLabel={aberta === c.id ? "Fechar" : "Configurar"}
          >
            {aberta === c.id && <ConfigConta c={c} />}
          </LinhaAjuste>
        ))}
      </Lista>
      <p className="text-[12.5px] text-fg2">
        Conta nova chega pausada: escolha o titular, o meio e a data de corte, e
        ative.
      </p>
    </>
  );
};

// ── Aparência ──────────────────────────────────────────────────────────────
export const SecaoAparencia = () => {
  const { darkMode, setDarkMode } = useTheme();
  const opcoes = [
    { escuro: false, label: "Claro", Icone: Sun },
    { escuro: true, label: "Escuro", Icone: Moon },
  ];
  return (
    <section className="rounded-[22px] border border-line bg-card p-5">
      <p className="mb-3 text-sm font-semibold">Tema</p>
      <div className="grid max-w-[420px] grid-cols-2 gap-3">
        {opcoes.map(({ escuro, label, Icone }) => (
          <button
            key={label}
            type="button"
            aria-pressed={darkMode === escuro}
            onClick={() => setDarkMode(escuro)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-[16px] border-2 p-4 text-sm font-semibold transition-colors",
              darkMode === escuro
                ? "border-primary"
                : "border-line hover:border-primary/40",
            )}
          >
            <Icone className="size-6" />
            {label}
          </button>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-[6px] text-[12.5px] text-fg2">
        <Monitor className="size-[14px]" /> As cores das categorias se ajustam
        sozinhas para ficarem legíveis nos dois temas.
      </p>
    </section>
  );
};
