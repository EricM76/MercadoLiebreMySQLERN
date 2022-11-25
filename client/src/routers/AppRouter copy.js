import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/detail/:id" element={<Detail />} />
        <Route path="/users/login" element={<Login />} />
        <Route element={<PrivateRouter />}>
          <Route path="/users/profile" element={<Profile />} />
          <Route path="/products/create" element={<Admin />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};
