import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { setNavigate } from "@/presentation/router/router.definitions";
import { useAuthStore } from "@/presentation/store";

import PrivateRoute from "./private-route";
import PublicRoutes from "./public-route";

/**
 * Bypass de auth para desenvolvimento local. Ligado apenas quando
 * VITE_SKIP_AUTH === "true" e nunca num build de produção.
 *
 * Com VITE_DEV_TOKEN (gerado por `financas-api/scripts/gerar-token-dev.js` em
 * `.env.dev.local`), entra com um JWT real do banco de dev: as telas carregam
 * dados. Sem ele, injeta um usuário fake só para inspecionar layout — a API
 * responde 401 e as telas ficam vazias.
 */
const SKIP_AUTH =
  import.meta.env.VITE_SKIP_AUTH === "true" && !import.meta.env.PROD;
const DEV_TOKEN = import.meta.env.VITE_DEV_TOKEN as string | undefined;

const devAuth = () =>
  DEV_TOKEN
    ? {
        token: DEV_TOKEN,
        user: {
          id: import.meta.env.VITE_DEV_USER_ID ?? "dev",
          nome: import.meta.env.VITE_DEV_USER_NOME ?? "Dev",
          email: import.meta.env.VITE_DEV_USER_EMAIL ?? "",
          isGoogleUser: import.meta.env.VITE_DEV_USER_GOOGLE === "true",
        },
      }
    : {
        token: "dev-skip-auth",
        user: {
          id: "dev",
          nome: "Mavi & Júnior",
          email: "conta@nossagrana.dev",
          isGoogleUser: false,
        },
      };

const ProxyRoute: React.FC = () => {
  const navigate = useNavigate();

  setNavigate(navigate);

  const { auth, setAuth } = useAuthStore();

  useEffect(() => {
    // Também troca um token antigo/fake pelo token de dev atual.
    if (
      SKIP_AUTH &&
      (!auth?.token || (DEV_TOKEN && auth.token !== DEV_TOKEN))
    ) {
      setAuth(devAuth());
    }
  }, [auth?.token, setAuth]);

  return auth?.token ? <PrivateRoute /> : <PublicRoutes />;
};

export default ProxyRoute;
