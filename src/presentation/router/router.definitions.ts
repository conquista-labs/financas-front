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
  calendar: "/calendar",
  transactions: "/transactions",
  createTransactions: "/transactions/create",
  editTransactions: "/transactions/edit/:id",
  // Patrimônio (nova identidade): página-hub com KPIs/gráficos/lista; criar e
  // editar via modal na própria página (sem rotas create/edit separadas).
  patrimony: "/patrimony",
  // Rebrand "Nossa Grana": Cadastros agrupa Categorias/Pessoas/Meios numa
  // página-hub com abas. Criar/editar via modal na própria página.
  registers: "/cadastros",
  // Importar extrato — wizard analisar/confirmar (POST /importacoes/*).
  import: "/importar",
  error: "/error",
};
