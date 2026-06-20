import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const faktum = localFont({
  src: "./fonts/Faktum-Regular.otf",
  variable: "--font-faktum",
});

export const metadata: Metadata = {
  title: "SmartDrugFinder - Health Dictionary",
  description: "Explore the most accurate database of Indian medical data.",
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
