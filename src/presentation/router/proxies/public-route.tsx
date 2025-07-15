import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { Suspense } from "@/presentation/components";
import { Login } from "@/presentation/pages";
import { urlRouters } from "@/presentation/router";

const PublicRoutes: React.FC = () => (
  <Routes>
    <Route
      path={urlRouters.login}
      element={
        <Suspense>
          <Login />
        </Suspense>
      }
    />
    <Route path="*" element={<Navigate to={urlRouters.login} replace />} />
  </Routes>
);

export default PublicRoutes;
