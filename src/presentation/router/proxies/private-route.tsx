import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";

import { AppShell, Suspense } from "@/presentation/components";
import {
  Calendar,
  CreateTransactions,
  EditTransactions,
  Home,
  Import,
  NotFound,
  Patrimony,
  Registers,
  Transactions,
} from "@/presentation/pages";
import { urlRouters } from "@/presentation/router/router.definitions";

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
        path={urlRouters.calendar}
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
        path={urlRouters.registers}
        element={
          <Suspense>
            <Registers />
          </Suspense>
        }
      />
      <Route
        path={urlRouters.import}
        element={
          <Suspense>
            <Import />
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
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default PrivateRoute;
