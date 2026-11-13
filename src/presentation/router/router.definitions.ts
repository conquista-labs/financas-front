let navigateFn: (path: string) => void;

export const setNavigate = (navigate: (path: string) => void) => {
  navigateFn = navigate;
};

export const navigateTo = (path: string) => {
  if (navigateFn) {
    navigateFn(path);
  } else {
    console.warn("Navigation function is not set!");
  }
};

export const urlRouters = {
  root: "/",
  home: "/",
  login: "/login",
  // Repaginado: Calendário + Contas a pagar viram "Agenda".
  agenda: "/agenda",
  transactions: "/transactions",
  createTransactions: "/transactions/create",
  editTransactions: "/transactions/edit/:id",
  // Patrimônio (nova identidade): página-hub com KPIs/gráficos/lista; criar e
  // editar via modal na própria página (sem rotas create/edit separadas).
  patrimony: "/patrimony",
  // Metas & Desejos: página-hub com abas (Metas/Desejos), KPIs e grids.
  // Criar/editar/aportar via modal na própria página.
  goals: "/metas",
  // Repaginado: Cadastros vira "Ajustes" (Categorias/Pessoas/Meios numa
  // página-hub com abas; criar/editar via modal na própria página).
  ajustes: "/ajustes",
  // Repaginado: Caixa de entrada + Importar viram "Revisar" — uma fila só com
  // o que veio do banco e do extrato. `?importar=1` abre o painel de extrato.
  revisar: "/revisar",
  revisarImportar: "/revisar?importar=1",
  // Mobile: a aba "Mais" reúne o que não cabe na barra (Agenda, Patrimônio,
  // Metas, Ajustes, tema e sair).
  mais: "/mais",
  error: "/error",
};

/**
 * Rotas da versão anterior → rota nova. Mantidas como redirect para não
 * quebrar favoritos e links antigos.
 */
export const legacyRedirects: Record<string, string> = {
  "/calendar": urlRouters.agenda,
  "/cadastros": urlRouters.ajustes,
  "/caixa-de-entrada": urlRouters.revisar,
  "/importar": urlRouters.revisarImportar,
  "/revisar/importar": urlRouters.revisarImportar,
};
