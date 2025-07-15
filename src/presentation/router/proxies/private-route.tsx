import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";

import { Suspense, Template } from "@/presentation/components";
import { Home, NotFound } from "@/presentation/pages";
import { urlRouters } from "@/presentation/router";

const PrivateRoute: React.FC = () => (
  <Routes>
    <Route
      path={urlRouters.root}
      element={
        <Suspense>
          <Template>
            <Outlet />
          </Template>
        </Suspense>
      }
    >
      <Route
        path={urlRouters.root}
        element={
          <Suspense>
            <Home />
          </Suspense>
        }
      />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default PrivateRoute;
