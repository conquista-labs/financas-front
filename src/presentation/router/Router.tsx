import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";

import { ProxyRoute } from "./proxies";

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <ProxyRoute />
      </QueryParamProvider>
    </BrowserRouter>
  );
};

export default Router;
