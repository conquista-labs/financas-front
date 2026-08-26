import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";

import { ProxyRoute } from "./proxies";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <QueryParamProvider
        adapter={ReactRouter6Adapter}
        options={{
          // Params iguais ao withDefault(...) (ex.: filtros "") NÃO vão para a
          // URL — evita a query cheia de ?tipo=&categoriaId=&... vazios.
          removeDefaultsFromUrl: true,
          // Agrupa múltiplas alterações (applyFilters seta vários params) numa
          // única navegação/entrada de histórico.
          enableBatching: true,
        }}
      >
        <ProxyRoute />
      </QueryParamProvider>
    </BrowserRouter>
  );
};

export default Router;
