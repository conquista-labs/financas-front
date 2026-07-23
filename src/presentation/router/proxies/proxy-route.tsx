import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { setNavigate } from "@/presentation/router/router.definitions";
import { useAuthStore } from "@/presentation/store";

import PrivateRoute from "./private-route";
import PublicRoutes from "./public-route";

/**
 * Bypass de auth para validação visual local (rebrand). Ligado apenas quando
 * VITE_SKIP_AUTH === "true" (ver .env.dev). Injeta um usuário fake no store e
 * libera as rotas privadas sem login — para inspecionar telas sem autenticar.
 * Desligado em qualquer outro ambiente.
 */
const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === "true";

const ProxyRoute: React.FC = () => {
  const navigate = useNavigate();

  setNavigate(navigate);

  const { auth, setAuth } = useAuthStore();

  useEffect(() => {
    if (SKIP_AUTH && !auth?.token) {
      setAuth({
        token: "dev-skip-auth",
        user: {
          id: "dev",
          nome: "Mavi & Júnior",
          email: "conta@nossagrana.dev",
          isGoogleUser: false,
        },
      });
    }
  }, [auth?.token, setAuth]);

  return auth?.token ? <PrivateRoute /> : <PublicRoutes />;
};

export default ProxyRoute;
