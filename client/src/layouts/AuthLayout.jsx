import { Outlet } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingNav from "./components/FloatingNav";

function AuthLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingNav />
    </>
  );
}

export default AuthLayout;
