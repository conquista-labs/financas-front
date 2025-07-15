import React from "react";
import { useNavigate } from "react-router-dom";

import { setNavigate } from "@/presentation/router";
import { useAuthStore } from "@/presentation/store";

import PrivateRoute from "./private-route";
import PublicRoutes from "./public-route";

const ProxyRoute: React.FC = () => {
  const navigate = useNavigate();

  setNavigate(navigate);

  const { auth } = useAuthStore();

  return auth?.access_token ? <PrivateRoute /> : <PublicRoutes />;
};

export default ProxyRoute;
