import { BrandPanel, LoginCard } from "./components";

/**
 * Tela de login "Nossa Grana" no layout Repaginado — split em duas colunas:
 * painel de marca escuro (cartões de amostra + headline) à esquerda e a
 * coluna de login à direita. Abaixo de 860px o painel some e a marca vai
 * para o topo da coluna de login.
 */
const Login: React.FC = () => (
  <div className="flex min-h-screen bg-bg">
    <BrandPanel />
    <LoginCard />
  </div>
);

export default Login;
