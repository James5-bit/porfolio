import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "James Peñero — Full Stack Developer & AI Automation Builder",
  description:
    "James Peñero — Full Stack Developer and AI Automation Builder based in the Philippines. Building AI-powered software that solves real problems.",
  openGraph: {
    title: "James Peñero — Full Stack Developer & AI Automation Builder",
    description:
      "Full Stack Developer and AI Automation Builder based in the Philippines.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
