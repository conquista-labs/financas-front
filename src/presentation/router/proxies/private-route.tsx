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
  Categories,
  CreateCategories,
  EditCategories,
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
        path={urlRouters.peoples}
        element={
          <Suspense>
            <Peoples />
          </Suspense>
        }
      />
      <Route
        path={urlRouters.createPeoples}
        element={
          <Suspense>
            <CreatePeoples />
          </Suspense>
        }
      />
      <Route
        path={urlRouters.editPeoples}
        element={
          <Suspense>
            <EditPeoples />
          </Suspense>
        }
      />
      <Route
        path={urlRouters.categories}
        element={
          <Suspense>
            <Categories />
          </Suspense>
        }
      />
      <Route
        path={urlRouters.createCategories}
        element={
          <Suspense>
            <CreateCategories />
          </Suspense>
        }
      />{" "}
      <Route
        path={urlRouters.editCategories}
        element={
          <Suspense>
            <EditCategories />
          </Suspense>
        }
      />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default PrivateRoute;
