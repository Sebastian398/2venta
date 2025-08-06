// app/layout.tsx o app/layout.js (con use client)
"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AuthProvider } from "@/context/AuthContext";
import DarkModeToggle from "@/components/darkmode";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="no-touch">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <DarkModeToggle />
        </AuthProvider>
      </body>
    </html>
  );
}
