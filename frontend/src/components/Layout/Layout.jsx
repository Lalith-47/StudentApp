import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ResponsiveContainer from "./ResponsiveContainer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 transition-all duration-300">
        <ResponsiveContainer className="py-4 sm:py-6 lg:py-8">
          <Outlet />
        </ResponsiveContainer>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
