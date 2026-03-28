import { Sidebar } from "@/components/Sidebar";
import { Outlet } from "react-router-dom";
import ChatWidget from "@/components/ChatWidget/ChatWidget"; 

const Auth = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Sidebar */}
      <div className="hidden md:block md:w-64 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 pt-14 md:pt-0 p-5 overflow-auto bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Outlet />
      </main>

      <ChatWidget />
    </div>
  );
};

export default Auth;