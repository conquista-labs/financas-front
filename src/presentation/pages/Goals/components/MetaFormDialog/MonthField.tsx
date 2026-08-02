import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui";

interface MonthFieldProps {
  /** ISO "yyyy-MM-dd" (o dia é sempre o 1º). Vazio = nada selecionado. */
  value: string;
  onChange: (value: string) => void;
}

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

/**
 * Seletor de mês/ano para a data alvo da meta (o backend normaliza pro dia 1º,
 * então dia não importa). Dois Selects (mês + ano) em vez de calendário: são
 * componentes pequenos e o Radix Select tem portal + collision, então funciona
 * bem dentro do Dialog — ao contrário do calendário em popover, que cobria o
 * modal. Ano corrente + 15 anos à frente.
 */
export const MonthField = ({ value, onChange }: MonthFieldProps) => {
  const [ano, mes] = value
    ? value.split("-").map(Number)
    : [undefined, undefined];

  const anoAtual = new Date().getUTCFullYear();
  const anos = Array.from({ length: 16 }, (_, i) => anoAtual + i);

  const emit = (m: number, a: number) =>
    onChange(`${a}-${String(m).padStart(2, "0")}-01`);

  return (
    <div className="grid grid-cols-2 gap-2">
      <Select
        value={mes ? String(mes) : undefined}
        onValueChange={(v) => emit(Number(v), ano ?? anoAtual)}
      >
        <SelectTrigger className="rounded-[11px] border-line">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {MESES.map((nome, i) => (
            <SelectItem key={i} value={String(i + 1)}>
              {nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={ano ? String(ano) : undefined}
        onValueChange={(v) => emit(mes ?? 1, Number(v))}
      >
        <SelectTrigger className="rounded-[11px] border-line">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {anos.map((a) => (
            <SelectItem key={a} value={String(a)}>
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
