import type { Metadata } from "next";
import { inter } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "BashUI by MadCorp",
  description: "Create quick and easy bash scripts with UI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} antialiased`}
      >
        <div className="grid place-items-center h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
