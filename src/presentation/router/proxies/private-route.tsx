import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";

import { urlRouters } from "@/presentation/router/router.definitions";
import { Suspense, Template } from "@/presentation/components";
import {
  Home,
  NotFound,
  Peoples,
  CreatePeoples,
  EditPeoples,
} from "@/presentation/pages";

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
      <Route
        path={urlRouters.people}
        element={
          <Suspense>
            <Peoples />
          </Suspense>
        }
      />
      <Route
        path={urlRouters.createPeople}
        element={
          <Suspense>
            <CreatePeoples />
          </Suspense>
        }
      />
      <Route
        path={urlRouters.editPeople}
        element={
          <Suspense>
            <EditPeoples />
          </Suspense>
        }
      />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default PrivateRoute;
