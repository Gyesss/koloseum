import { Outlet } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingNav from "./components/FloatingNav";

function DashboardLayout() {
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

export default DashboardLayout;
