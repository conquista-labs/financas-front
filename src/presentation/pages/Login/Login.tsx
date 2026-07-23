import { BrandPanel, LoginCard } from "./components";

/**
 * Tela de login "Nossa Grana" — split em duas colunas: painel de marca
 * (foto + cards glass + headline) à esquerda e cartão de login à direita.
 * Abaixo de 860px o painel de marca some e fica só o cartão centralizado.
 */
const Login: React.FC = () => (
  <div className="flex min-h-screen bg-bg">
    <BrandPanel />
    <LoginCard />
  </div>
);

export default Login;
