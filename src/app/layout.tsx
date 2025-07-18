import type { Metadata } from "next";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "Lang Live Simulator",
  description: "Lang Live Simulator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-transparent`}>{children}</body>
    </html>
  );
}
