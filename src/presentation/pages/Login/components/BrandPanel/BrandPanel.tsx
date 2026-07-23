import { ChartNoAxesColumn, Menu } from "lucide-react";

import banner from "@/presentation/assets/images/banner.png";

/**
 * Painel de marca (coluna esquerda) do login "Nossa Grana". Foto do casal ao
 * fundo com dois overlays (gradiente roxo + brilho radial), em layout de fluxo
 * (flex column, space-between) — NÃO position:absolute com offsets fixos, para
 * não colidir em telas baixas. Some abaixo de 860px (só o cartão fica).
 */
export const BrandPanel = () => {
  return (
    <div className="relative hidden min-h-screen flex-[1.05] flex-col justify-between overflow-hidden px-12 pb-14 pt-11 min-[860px]:flex">
      {/* foto + overlays */}
      <img
        src={banner}
        alt="Casal cuidando das finanças"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(155deg,rgba(43,35,80,0.72)_0%,rgba(91,75,224,0.55)_55%,rgba(91,75,224,0.35)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_10%_0%,rgba(255,255,255,0.14),transparent_45%)]" />

      {/* topo: chip de marca */}
      <div className="relative flex items-center gap-[11px] text-white">
        <div className="flex size-10 items-center justify-center rounded-[12px] bg-white/15 backdrop-blur-sm">
          <ChartNoAxesColumn
            className="size-[22px] text-white"
            strokeWidth={2.4}
          />
        </div>
        <span className="font-display text-[19px] font-bold tracking-[0.01em]">
          Nossa Grana
        </span>
      </div>

      {/* meio: cards "glass" flutuantes */}
      <div className="relative my-6 flex flex-wrap items-start gap-[14px]">
        <div className="w-[250px] animate-om-float rounded-[20px] border border-white/25 bg-white/15 p-5 text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] backdrop-blur-lg">
          <span className="text-[12.5px] opacity-85">Saldo do mês</span>
          <div className="mt-[3px] font-display text-[30px] font-bold -tracking-[0.02em]">
            R$ 6.240
          </div>
          <div className="mt-3 flex gap-[6px]">
            <div className="flex-1">
              <div className="h-[6px] overflow-hidden rounded-pill bg-white/30">
                <div className="h-full w-[64%] rounded-pill bg-[#7BE0B0]" />
              </div>
              <span className="text-[10.5px] opacity-80">Receitas</span>
            </div>
            <div className="flex-1">
              <div className="h-[6px] overflow-hidden rounded-pill bg-white/30">
                <div className="h-full w-[48%] rounded-pill bg-[#FF9DA0]" />
              </div>
              <span className="text-[10.5px] opacity-80">Despesas</span>
            </div>
          </div>
        </div>

        <div className="animate-om-floatb self-end rounded-[18px] border border-white/25 bg-white/15 p-[15px] text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] backdrop-blur-lg">
          <div className="flex items-center gap-[9px]">
            <span className="flex size-[34px] items-center justify-center rounded-[10px] bg-white/20">
              <Menu className="size-[17px]" strokeWidth={2} />
            </span>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold">Orçamento</div>
              <div className="text-[11px] opacity-80">no controle ✓</div>
            </div>
          </div>
        </div>
      </div>

      {/* base: headline + chips de features */}
      <div className="relative">
        <h2 className="mb-4 font-display text-[40px] font-bold leading-[1.12] -tracking-[0.025em] text-white">
          Cuidar do que é
          <br />
          nosso, todos os dias.
        </h2>
        <div className="flex flex-wrap gap-2">
          {["Importe extratos", "Orçamento por categoria", "Patrimônio"].map(
            (feature) => (
              <span
                key={feature}
                className="rounded-pill border border-white/25 bg-white/[0.18] px-[13px] py-[6px] text-[12.5px] font-semibold text-white"
              >
                {feature}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
};
