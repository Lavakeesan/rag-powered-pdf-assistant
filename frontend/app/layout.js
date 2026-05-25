import { Inter } from "next/font/google";

import Head from "next/head";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "AskMyPDF AI - Smart PDF Assistant",
  description: "Upload PDFs, ask questions, and get instant AI explanations using RAG technology.",
  icons: {
    icon: "/logo.jpeg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <Head>
  <link rel="icon" href="/logo.jpeg" type="image/jpeg" />
  <link rel="shortcut icon" href="/logo.jpeg" type="image/jpeg" />
  <link rel="apple-touch-icon" href="/logo.jpeg" />
</Head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
