"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AuthProvider } from "@/context/AuthContext";
import DarkModeToggle from "@/components/darkmode";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className="no-touch bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300"
      suppressHydrationWarning={true}
    >
      <body className="min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <DarkModeToggle />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
