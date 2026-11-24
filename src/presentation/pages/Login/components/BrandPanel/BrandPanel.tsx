/**
 * Painel de marca (coluna esquerda) do login no layout Repaginado: fundo
 * "tinta" da sidebar, dois cartões de amostra levemente inclinados (saldo do
 * mês e o que pede atenção) e a headline. Layout em fluxo (flex column,
 * space-between) para não colidir em telas baixas. Some abaixo de 860px —
 * no celular o LoginCard mostra a marca no topo.
 */
export const BrandPanel = () => {
  return (
    <section
      aria-label="Nossa Grana"
      className="relative hidden min-h-screen flex-[1.15] flex-col justify-between gap-10 overflow-hidden border-r border-sidebar-edge bg-sidebar p-12 text-white min-[860px]:flex"
    >
      <div className="flex items-center gap-[10px]">
        <div className="grid size-[38px] place-items-center rounded-[12px] bg-primary font-display text-lg font-bold">
          N
        </div>
        <span className="font-display text-xl font-bold">Nossa Grana</span>
      </div>

      <div aria-hidden="true" className="relative h-[300px]">
        {/* a animação mexe em transform; a inclinação fica num div interno */}
        <div className="absolute left-0 top-[10px] w-[300px] animate-om-float">
          <div className="-rotate-3 rounded-[22px] border border-white/[0.08] bg-[#23212D] px-[22px] py-5">
            <p className="text-[12.5px] text-[#B9B5C6]">Saldo do mês</p>
            <p className="mb-3 mt-[6px] font-display text-[34px] font-bold -tracking-[0.03em]">
              R$ 3.482
            </p>
            <svg
              viewBox="0 0 260 50"
              width="100%"
              height="44"
              preserveAspectRatio="none"
            >
              <polyline
                fill="none"
                stroke="#7B6CF0"
                strokeWidth="3"
                strokeLinejoin="round"
                points="0,40 40,42 70,32 100,14 160,18 260,24"
              />
            </svg>
          </div>
        </div>

        <div className="absolute left-[250px] top-[150px] w-[250px] animate-om-floatb">
          <div className="rotate-2 rounded-[20px] bg-white px-[18px] py-4 text-[#17161B] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]">
            <p className="text-xs font-bold text-[#5E5C68]">Pede atenção</p>
            <p className="mt-2 flex items-center gap-2 text-[13.5px] font-semibold">
              <span className="grid size-[26px] place-items-center rounded-[8px] bg-[#EEEBFB] text-xs font-bold text-[#4536C9]">
                30
              </span>
              para revisar
            </p>
            <p className="mt-[6px] flex items-center gap-2 text-[13.5px] font-semibold">
              <span className="grid size-[26px] place-items-center rounded-[8px] bg-[#E3F5EC] text-xs text-[#0B7F50]">
                ★
              </span>
              Reserva chegou lá
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="max-w-[520px] font-display text-[50px] font-bold leading-[1.04] -tracking-[0.035em]">
          Cuidar do que é nosso, todos os dias.
        </h2>
        <p className="mt-[14px] max-w-[440px] text-base leading-normal text-[#B9B5C6]">
          O dinheiro da casa num lugar só: o que entrou, o que saiu, o que vem
          por aí e o que vocês estão construindo juntos.
        </p>
      </div>
    </section>
  );
};
