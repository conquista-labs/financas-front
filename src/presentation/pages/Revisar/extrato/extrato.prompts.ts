/**
 * Prompts de conversão por IA (ChatGPT/Claude) para faturas de cartão ou
 * arquivos em formato diferente. Cada formato tem duas versões: a exibida na
 * tela (com acentos e bullets `•`) e a copiada para o clipboard (ASCII-safe,
 * com `-`), que cola melhor em qualquer campo.
 */

export type ImportFmt = "ofx" | "csv";

const OFX_DISPLAY = `Converta o extrato/fatura em anexo para um arquivo OFX válido (1.0.2 / SGML). Regras:
• Um bloco <STMTTRN> por transação, dentro de <BANKTRANLIST>.
• <DTPOSTED> no formato AAAAMMDD.
• <TRNAMT> = valor com ponto decimal. Sinal NEGATIVO para gastos/despesas e POSITIVO para recebimentos. (Fatura de cartão: compras negativas; pagamento de fatura positivo.)
• <TRNTYPE> = DEBIT para gastos, CREDIT para recebimentos.
• <MEMO> = nome do estabelecimento / histórico. Se for parcelada, mantenha "Parcela N/T" no MEMO.
• <FITID> único por transação.
• Não invente saldos; foque nas transações.
Devolva só o conteúdo do arquivo OFX, nada mais.`;

const CSV_DISPLAY = `Converta o extrato/fatura em anexo para um CSV com as colunas: data,descricao,valor,formaPagamento (separador vírgula, primeira linha é o cabeçalho). Regras:
• data no formato AAAA-MM-DD.
• descricao = nome do estabelecimento / histórico.
• valor = número com ponto decimal, sem "R$" nem separador de milhar. Sinal NEGATIVO para gastos/despesas e POSITIVO para recebimentos/estornos. (Em fatura de cartão, compras são despesas → negativo; "pagamento de fatura" é positivo.)
• formaPagamento: se parcelada (ex.: "1 de 3", "2/12") escreva parcelaNx onde N é o TOTAL de parcelas (ex.: "1 de 3" → parcela3x). Se não for, deixe vazio. N vai de 2 a 12.
• Uma linha por transação. Não inclua saldos, totais ou cabeçalhos do banco.
Devolva só o CSV, nada mais.`;

/** Remove acentos e troca bullets por `-` para colar em qualquer lugar. */
const toAscii = (text: string): string =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/•/g, "-");

/** Prompt exibido na tela (bonito, acentuado). */
export const promptDisplay = (fmt: ImportFmt): string =>
  fmt === "csv" ? CSV_DISPLAY : OFX_DISPLAY;

/** Prompt copiado para o clipboard (ASCII-safe). */
export const promptClipboard = (fmt: ImportFmt): string =>
  toAscii(promptDisplay(fmt));
