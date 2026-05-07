import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KiraPass",
  description: "Cross-chain event ticketing powered by KIRAPAY."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
