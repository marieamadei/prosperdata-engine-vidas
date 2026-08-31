import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProsperData Engine per gara VIDAS — Proposta strategica e operativa",
  description:
    "Sistema di intelligence, segmentazione e attivazione proposto da DataProsper e Kiwi Data Science per VIDAS.",
  icons: {
    icon: "/vidas.png",
    shortcut: "/vidas.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
