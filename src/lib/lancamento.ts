import { format, subDays } from "date-fns";

import { parseAmount } from "./format";

/**
 * Interpretador do "Lançar" (⌘K): transforma uma frase escrita do jeito que a
 * pessoa falaria — "mercado 312,45 nubank 3x", "uber 45 pix ontem",
 * "salário 9800" — em campos de um lançamento, casando as palavras com as
 * categorias, meios de pagamento e pessoas que existem no banco.
 *
 * Função pura: não chama API nem conhece React. O que não entender fica de
 * fora (a pessoa ajusta nos campos do modal).
 */

export const MAX_PARCELAS = 12; // enum FormaPagamento vai até parcela12x

export interface OpcaoCategoria {
  id: string;
  nome: string;
  tipo: "receita" | "despesa" | string;
  /** Favoritas desempatam quando a palavra casa mais de uma categoria. */
  favorito?: boolean;
}
export interface OpcaoMeio {
  id: string;
  nome: string;
  tipo?: string | null;
}
export interface OpcaoPessoa {
  id: string;
  nome: string;
}

export interface OpcoesLancamento {
  categorias: OpcaoCategoria[];
  meios: OpcaoMeio[];
  pessoas: OpcaoPessoa[];
  /** Data de referência para "hoje"/"ontem" (testes). */
  hoje?: Date;
}

export interface LancamentoInterpretado {
  valor?: number;
  parcelas?: number;
  tipo?: "receita" | "despesa";
  categoriaId?: string;
  meioPagamentoId?: string;
  pessoaId?: string;
  /** "yyyy-MM-dd" quando a frase cita a data (hoje, ontem, 05/11…). */
  data?: string;
  status?: "paga" | "pendente";
  /** Palavras que sobraram, com a primeira letra maiúscula. */
  descricao: string;
}

/** minúsculas, sem acento. */
export const normalizar = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

const palavrasDe = (s: string) =>
  normalizar(s)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

/**
 * Palavras do dia a dia que não aparecem no nome da categoria. Cada uma aponta
 * para nomes de categoria candidatos (normalizados), na ordem de preferência;
 * vale o primeiro que existir no banco.
 */
const SINONIMOS_CATEGORIA: Record<string, string[]> = {
  uber: ["transporte"],
  "99": ["transporte"],
  taxi: ["transporte"],
  onibus: ["transporte"],
  metro: ["transporte"],
  estacionamento: ["transporte"],
  pedagio: ["transporte"],
  gasolina: ["combustivel", "transporte"],
  etanol: ["combustivel", "transporte"],
  posto: ["combustivel", "transporte"],
  ifood: ["delivery", "restaurante", "fast food", "alimentacao"],
  rappi: ["delivery", "restaurante", "fast food", "alimentacao"],
  almoco: ["restaurante", "alimentacao"],
  jantar: ["restaurante", "alimentacao"],
  mercado: ["mercado", "supermercado", "alimentacao"],
  padaria: ["padaria", "mercado", "supermercado", "alimentacao"],
  feira: ["hortifruti", "mercado", "supermercado", "alimentacao"],
  supermercado: ["supermercado", "mercado", "alimentacao"],
  lanche: ["fast food", "restaurante", "alimentacao"],
  aluguel: ["moradia", "casa"],
  condominio: ["moradia", "casa"],
  luz: ["moradia", "casa"],
  energia: ["moradia", "casa"],
  agua: ["moradia", "casa"],
  internet: ["moradia", "casa", "assinaturas"],
  farmacia: ["farmacia", "saude"],
  remedio: ["farmacia", "saude"],
  drogaria: ["farmacia", "saude"],
  medico: ["saude"],
  consulta: ["saude"],
  netflix: ["assinaturas"],
  spotify: ["assinaturas"],
  cinema: ["lazer"],
  show: ["lazer"],
  racao: ["pets"],
  veterinario: ["pets"],
  escola: ["educacao", "estudos"],
  curso: ["educacao", "estudos"],
  faculdade: ["educacao", "estudos"],
  roupa: ["vestuario"],
  salario: ["salario"],
  freela: ["freela", "renda extra"],
  bonus: ["bonus"],
  reembolso: ["reembolso"],
};

const PALAVRAS_RECEITA = new Set([
  "recebi",
  "receita",
  "entrada",
  "salario",
  "ganhei",
]);
const PALAVRAS_PAGA = new Set(["pago", "paga", "paguei"]);
const PALAVRAS_PENDENTE = new Set(["pendente", "pagar", "vence", "vencimento"]);
const PALAVRAS_CREDITO = new Set(["credito", "cartao"]);
const PALAVRAS_DEBITO = new Set(["debito"]);
const CONECTIVOS = new Set([
  "de",
  "do",
  "da",
  "no",
  "na",
  "em",
  "com",
  "pra",
  "para",
  "r$",
]);

const RE_PARCELAS = /^(\d{1,2})x$/i;
const RE_VALOR =
  /^(r\$)?\d+(?:\.\d{3})*(?:,\d{1,2})?$|^(r\$)?\d+(?:\.\d{1,2})?$/i;
const RE_DATA = /^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/;

/** "1.200" (milhar) vs "45.90" (decimal): ponto com 3 dígitos depois = milhar. */
const valorDe = (token: string) => {
  const limpo = token.replace(/^r\$/i, "");
  if (/^\d+\.\d{3}$/.test(limpo)) return Number(limpo.replace(".", ""));
  return parseAmount(limpo);
};

/** Casa uma palavra com um nome: palavra inteira igual, ou prefixo (4+ letras). */
const casa = (palavra: string, nome: string) => {
  const nomePalavras = palavrasDe(nome);
  if (nomePalavras.includes(palavra)) return true;
  if (palavra.length >= 4)
    return nomePalavras.some(
      (n) => n.startsWith(palavra) || (n.length >= 4 && palavra.startsWith(n)),
    );
  return false;
};

/**
 * Escolhe UMA categoria entre as que casaram: nome idêntico à palavra >
 * favorita > a única. Empate sem critério → nenhuma (a pessoa escolhe; melhor
 * do que chutar "Transporte (Jetta)" quando poderia ser a Moto).
 */
const escolherCategoria = (
  candidatas: OpcaoCategoria[],
  palavra: string,
): OpcaoCategoria | undefined => {
  if (candidatas.length <= 1) return candidatas[0];
  const exata = candidatas.find((c) => normalizar(c.nome) === palavra);
  if (exata) return exata;
  const favoritas = candidatas.filter((c) => c.favorito);
  return favoritas.length === 1 ? favoritas[0] : undefined;
};

/** Categorias cujo nome é (ou começa com) o nome candidato do sinônimo. */
const porSinonimo = (categorias: OpcaoCategoria[], palavra: string) => {
  for (const alvo of SINONIMOS_CATEGORIA[palavra] ?? []) {
    const exatas = categorias.filter((c) => normalizar(c.nome) === alvo);
    if (exatas.length) return exatas;
    const prefixo = categorias.filter((c) =>
      normalizar(c.nome).startsWith(alvo),
    );
    if (prefixo.length) return prefixo;
  }
  return [];
};

export const interpretarLancamento = (
  frase: string,
  { categorias, meios, pessoas, hoje = new Date() }: OpcoesLancamento,
): LancamentoInterpretado => {
  const tokens = frase.trim().split(/\s+/).filter(Boolean);
  const norm = tokens.map(normalizar);
  const usados = new Set<number>(); // índices que não vão para a descrição
  const out: LancamentoInterpretado = { descricao: "" };

  // 1) Parcelas ("3x") e valor (primeiro número que não é parcela nem data).
  norm.forEach((t, i) => {
    const p = t.match(RE_PARCELAS);
    if (p && out.parcelas === undefined) {
      const n = Number(p[1]);
      if (n >= 2) out.parcelas = Math.min(n, MAX_PARCELAS);
      usados.add(i);
    }
  });
  norm.forEach((t, i) => {
    if (usados.has(i) || out.valor !== undefined) return;
    if (t === "r$") return void usados.add(i);
    if (RE_VALOR.test(t)) {
      const v = valorDe(t);
      if (v > 0) out.valor = v;
      usados.add(i);
    }
  });

  // 2) Data e situação.
  norm.forEach((t, i) => {
    if (usados.has(i)) return;
    if (t === "hoje") {
      out.data = format(hoje, "yyyy-MM-dd");
      usados.add(i);
    } else if (t === "ontem") {
      out.data = format(subDays(hoje, 1), "yyyy-MM-dd");
      usados.add(i);
    } else if (t === "anteontem") {
      out.data = format(subDays(hoje, 2), "yyyy-MM-dd");
      usados.add(i);
    } else {
      const d = t.match(RE_DATA);
      if (d) {
        const ano = d[3]
          ? Number(d[3].length === 2 ? `20${d[3]}` : d[3])
          : hoje.getFullYear();
        const dt = new Date(ano, Number(d[2]) - 1, Number(d[1]));
        if (dt.getDate() === Number(d[1])) out.data = format(dt, "yyyy-MM-dd");
        usados.add(i);
      } else if (PALAVRAS_PAGA.has(t)) {
        out.status = "paga";
        usados.add(i);
      } else if (PALAVRAS_PENDENTE.has(t)) {
        out.status = "pendente";
        usados.add(i);
      }
    }
  });

  // 3) Meio de pagamento. "crédito"/"débito" na frase desempatam
  //    (ex.: "nubank" casa "Cartão Nubank" e "Débito Nubank").
  const querCredito = norm.some((t) => PALAVRAS_CREDITO.has(t));
  const querDebito = norm.some((t) => PALAVRAS_DEBITO.has(t));
  for (let i = 0; i < norm.length && !out.meioPagamentoId; i++) {
    const t = norm[i];
    // "crédito"/"débito"/"cartão" só desempatam; não escolhem o meio sozinhas.
    // 2 letras basta para o banco ("xp"), mas aí só palavra inteira (casa()).
    if (
      usados.has(i) ||
      t.length < 2 ||
      CONECTIVOS.has(t) ||
      PALAVRAS_CREDITO.has(t) ||
      PALAVRAS_DEBITO.has(t)
    )
      continue;
    const candidatos = meios.filter(
      (m) => casa(t, m.nome) || (t === "pix" && m.tipo === "pix"),
    );
    if (!candidatos.length) continue;
    const preferido =
      (querDebito && candidatos.find((m) => m.tipo === "debito")) ||
      (querCredito && candidatos.find((m) => m.tipo === "credito")) ||
      candidatos.find((m) => m.tipo === "credito") ||
      candidatos[0];
    out.meioPagamentoId = preferido.id;
    usados.add(i);
  }
  // "crédito"/"débito"/"cartão" já serviram para escolher o meio.
  norm.forEach((t, i) => {
    if (
      out.meioPagamentoId &&
      (PALAVRAS_CREDITO.has(t) || PALAVRAS_DEBITO.has(t))
    )
      usados.add(i);
  });

  // 4) Pessoa ("de quem"): nome ou primeiro nome.
  for (let i = 0; i < norm.length && !out.pessoaId; i++) {
    const t = norm[i];
    if (usados.has(i) || t.length < 3 || CONECTIVOS.has(t)) continue;
    const pessoa = pessoas.find((p) => palavrasDe(p.nome).includes(t));
    if (pessoa) {
      out.pessoaId = pessoa.id;
      usados.add(i);
    }
  }

  // 5) Categoria — a palavra continua na descrição ("Mercado").
  for (let i = 0; i < norm.length && !out.categoriaId; i++) {
    const t = norm[i];
    if (usados.has(i) || t.length < 3 || CONECTIVOS.has(t)) continue;
    const diretas = categorias.filter((c) => casa(t, c.nome));
    const cat = diretas.length
      ? escolherCategoria(diretas, t)
      : escolherCategoria(porSinonimo(categorias, t), t);
    if (cat) out.categoriaId = cat.id;
  }

  // 6) Tipo: pela categoria; senão, por palavras de receita.
  const categoria = categorias.find((c) => c.id === out.categoriaId);
  if (categoria?.tipo === "receita" || categoria?.tipo === "despesa")
    out.tipo = categoria.tipo;
  else if (norm.some((t) => PALAVRAS_RECEITA.has(t))) out.tipo = "receita";

  // 7) Descrição: o que sobrou, sem conectivos soltos nas pontas.
  const resto = tokens.filter((_, i) => !usados.has(i));
  while (resto.length && CONECTIVOS.has(normalizar(resto[0]))) resto.shift();
  while (resto.length && CONECTIVOS.has(normalizar(resto[resto.length - 1])))
    resto.pop();
  const texto = resto.join(" ");
  out.descricao = texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : "";

  return out;
};
