import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import appCss from "../styles.css?url";
import { MobileNav } from "@/components/MobileNav";
import { DesktopNav } from "@/components/DesktopNav";
import { SosModal } from "@/components/SosModal";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-7xl font-serif font-black text-primary">404</h1>
        <h2 className="text-2xl font-serif font-bold">Page Not Found</h2>
        <p className="rs-body-sm">This page doesn't exist.</p>
        <a href="/" className="mt-4 inline-block rs-btn rs-btn-primary">
          Go Home
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#dc2626" },
      { title: "RaktSetu — Real-Time Blood Donor Network" },
      {
        name: "description",
        content:
          "Find blood donors near you in seconds. RaktSetu connects donors and recipients across Gujarat. Ek Boond, Ek Zindagi.",
      },
      { name: "author", content: "RaktSetu" },
      { property: "og:title", content: "RaktSetu — Real-Time Blood Donor Network" },
      {
        property: "og:description",
        content: "Find compatible blood donors near you. Save lives in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      {
        rel: "icon",
        href:
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%A9%B8%3C/text%3E%3C/svg%3E",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const [sosOpen, setSosOpen] = useState(false);
  return (
    <>
      <DesktopNav onSos={() => setSosOpen(true)} />
      <main className="min-h-screen pb-24 lg:pb-0">
        <Outlet />
      </main>
      <MobileNav />
      <SosModal open={sosOpen} onClose={() => setSosOpen(false)} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#111111",
            color: "#f5f5f0",
            border: "1px solid #1f1f1f",
            fontFamily: "DM Mono, ui-monospace, monospace",
            fontSize: "13px",
            borderRadius: "12px",
          },
          success: { iconTheme: { primary: "#22c55e", secondary: "#111111" } },
          error: { iconTheme: { primary: "#dc2626", secondary: "#111111" } },
        }}
      />
    </>
  );
}
