import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const faktum = localFont({
  src: "./fonts/Faktum-Regular.otf",
  variable: "--font-faktum",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://smartdrugfinder.com"),
  title: "SmartDrugFinder - Health Dictionary",
  description: "Explore the most accurate database of Indian medical data.",
  openGraph: {
    title: "SmartDrugFinder - Health Dictionary",
    description: "Explore the most accurate database of Indian medical data.",
    url: "/",
    siteName: "SmartDrugFinder",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 600,
        alt: "SmartDrugFinder Preview Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartDrugFinder - Health Dictionary",
    description: "Explore the most accurate database of Indian medical data.",
    images: ["/og-image.png"],
  },
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
