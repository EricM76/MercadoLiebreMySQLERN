import React, { useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { Home } from "../pages/Home";
import { Detail } from "../pages/Detail";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Login } from "../pages/Login";
import { Profile } from "../pages/Profile";
import { PrivateRouter } from "./PrivateRouter";
import { NotFound } from "../pages/NotFound";
import { Admin } from "../pages/Admin";
import { AdminRouter } from "./AdminRouter";

import "../App.css";
import { Root } from "./Root";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Root />}>
      <Route path="/" element={<Home />} />
        <Route path="/products/detail/:id" element={<Detail />} />
        <Route path="/users/login" element={<Login />} />
        <Route element={<PrivateRouter />}>
          <Route path="/users/profile" element={<Profile />} />
        </Route>
        <Route element={<AdminRouter/>}>
        <Route path="/products/create" element={<Admin />} />
        </Route>
      </Route>

      <Route errorElement={<NotFound />} />
    </>
  )
);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
