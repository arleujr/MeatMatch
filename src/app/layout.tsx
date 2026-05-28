import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/shared/components/Header";

// Optimizing fonts locally via next/font
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MeatMatch | Smart BBQ Calculator",
  description: "Data-driven BBQ planning. Calculate meats, drinks, and split costs with precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-background text-text-main font-inter selection:bg-primary/30">
        <main className="max-w-screen-md mx-auto px-4 pb-12 flex flex-col min-h-screen">
          {/* Injecting the global header here */}
          <Header />
          {children}
        </main>
      </body>
    </html>
  );
}
