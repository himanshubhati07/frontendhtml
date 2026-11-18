import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "./toast-provider";

export const metadata: Metadata = {
  title: "Green Go — Online Fashion Shopping",
  description:
    "Green Go is a fashion marketplace to browse, wishlist and buy clothing, footwear and accessories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
