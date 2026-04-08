import type { Metadata } from "next";

import "./globals.css";
import { PlanningStoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "SEM / LSA Planning MVP",
  description: "Productized LSA planning and onboarding workflow"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <PlanningStoreProvider>{children}</PlanningStoreProvider>
      </body>
    </html>
  );
}
