import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProTin — Protein Price Calculator",
  description:
    "Calculate the price per gram of protein and price per serving for any protein powder.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased text-white selection:bg-white/20">
        {children}
      </body>
    </html>
  );
}
