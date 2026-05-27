import { BrowserRouter, Routes, Route } from "react-router-dom";

import RequireGuest from "../components/auth/RequireGuest";
import RequireAuth from "../components/auth/RequireAuth";
// import RequireRole from "../components/auth/RequireRole"

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/Home";
import About from "../pages/About";
import Help from "../pages/Help";
import PrivacyPolicy from "../pages/PrivacyPolicy";

import Register from "../pages/Register";
import Login from "../pages/Login";

import Dashboard from "../pages/Dashboard";

import Forbidden from "../pages/Forbidden";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="help" element={<Help />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
        </Route>

        <Route
          element={
            <RequireGuest>
              <AuthLayout />
            </RequireGuest>
          }
        >
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>

        <Route
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route path="dashboard">
            <Route index element={<Dashboard />} />
          </Route>
        </Route>

        <Route path="403" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
