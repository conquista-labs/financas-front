import React from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import { AppShell, Suspense } from "@/presentation/components";
import {
  Calendar,
  CreateTransactions,
  EditTransactions,
  Goals,
  Home,
  Import,
  Inbox,
  NotFound,
  Patrimony,
  Registers,
  Transactions,
} from "@/presentation/pages";
import {
  legacyRedirects,
  urlRouters,
} from "@/presentation/router/router.definitions";

/** Redireciona uma rota antiga para a nova, mantendo query string e hash. */
const LegacyRedirect: React.FC<{ to: string }> = ({ to }) => {
  const { search, hash } = useLocation();
  return <Navigate to={`${to}${search}${hash}`} replace />;
};

const PrivateRoute: React.FC = () => (
  <Routes>
    <Route
      path={urlRouters.root}
      element={
        <Suspense>
          <AppShell>
            <Outlet />
          </AppShell>
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
      <Route
        path={urlRouters.agenda}
        element={
          <Suspense>
            <Calendar />
          </Suspense>
        }
      />
      <Route
        path={urlRouters.transactions}
        element={
          <Suspense>
            <Transactions />
          </Suspense>
        }
      />
      <Route
        path={urlRouters.createTransactions}
        element={
          <Suspense>
            <CreateTransactions />
          </Suspense>
        }
      />
      <Route
        path={urlRouters.editTransactions}
        element={
          <Suspense>
            <EditTransactions />
          </Suspense>
        }
      />
      <Route
        path={urlRouters.ajustes}
        element={
          <Suspense>
            <Registers />
          </Suspense>
        }
      />
      <Route
        path={urlRouters.revisarImportar}
        element={
          <Suspense>
            <Import />
          </Suspense>
        }
      />
      <Route
        path={urlRouters.revisar}
        element={
          <Suspense>
            <Inbox />
          </Suspense>
        }
      />
      <Route
        path={urlRouters.patrimony}
        element={
          <Suspense>
            <Patrimony />
          </Suspense>
        }
      />
      <Route
        path={urlRouters.goals}
        element={
          <Suspense>
            <Goals />
          </Suspense>
        }
      />
      {Object.entries(legacyRedirects).map(([from, to]) => (
        <Route key={from} path={from} element={<LegacyRedirect to={to} />} />
      ))}
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default PrivateRoute;
