import Head from "next/head";
import { type ReactElement } from "react";

const Layout = ({ children }: { children: ReactElement }) => {
  return (
    <>
      <Head>
        <title>Family Chores</title>
        <meta name="description" content="Family Chores" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className="relative flex min-h-[100dvh] max-w-[100dvw] flex-col">
        {children}
      </main>
    </>
  );
};

export default Layout;
