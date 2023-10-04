import { useState, type ReactElement } from "react";
import Head from "next/head";

import { Navbar, Sidebar } from "@/components";
import Menu from "./Icons/Menu";
import Footer from "./Footer";

const Layout = ({ children }: { children: ReactElement }) => {
  const [isOpen, setIsOpen] = useState(true);
  const setSidebarOpen = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <Head>
        <title>MyTube UK</title>
        <meta name="description" content="A Youtube Clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col">
        <Navbar>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-2 inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <Menu className="h-6 w-6 stroke-gray-400" aria-hidden="true" />
            <span className="sr-only">Open Menu</span>
          </button>
        </Navbar>

        <div className="flex h-full flex-row">
          <Sidebar
            isOpen={isOpen}
            closeSidebar={closeSidebar}
            setSidebarOpen={setSidebarOpen}
          />
          <div className="lg:hidden">
            <Footer />
          </div>
          <div>{children}</div>
        </div>
      </main>
    </>
  );
};

export default Layout;
