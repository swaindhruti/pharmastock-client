import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const faktum = localFont({
  src: "./fonts/Faktum-Regular.otf",
  variable: "--font-faktum",
});

export const metadata: Metadata = {
  title: "Pharmastock - Health Dictionary",
  description: "Your trusted dictionary for health, medicine, diseases and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${faktum.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-faktum">{children}</body>
    </html>
  );
}
