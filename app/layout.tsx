import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryClientProvider";
import {AuthProvider} from '@/providers/AuthProvider'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {Toaster} from 'react-hot-toast';
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DashLyt",
  description: "DashLyt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){



  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <Header />
            {children}
            <Toaster position="top-right"/>
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
