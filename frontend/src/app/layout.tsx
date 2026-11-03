import type { Metadata } from "next";
import "./globals.css";
import { EstateStoreProvider } from "@/context/estate-store";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "EstateAI — Yapay Zekâ Destekli Emlak Yönetim SaaS Platformu",
  description:
    "Emlak ofisleri ve gayrimenkul danışmanları için yapay zekâ destekli portföy, müşteri, randevu ve WhatsApp asistanı platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="font-sans">
        <EstateStoreProvider>
          <AppShell>{children}</AppShell>
        </EstateStoreProvider>
      </body>
    </html>
  );
}
