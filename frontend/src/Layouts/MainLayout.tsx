
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-950 dark:text-white">
      <Navbar />

      <main className="flex-grow pt-22 ">
        <Outlet />
      </main>

      <Footer />
  
    </div>
  );
};

export default MainLayout;