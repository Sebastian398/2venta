"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Poppins, Russo_One } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

const russo = Russo_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-russo-one",
});

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    router.push("/");
  };

  const handlePublishClick = () => {
    setMenuOpen(false);
    if (isAuthenticated) {
      router.push("/publish");
    } else {
      router.push("/register");
    }
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav
      className={`${poppins.variable} ${russo.variable} font-sans bg-blue-400 text-white px-6 py-4 shadow-md flex items-center justify-between relative`}
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <Link
        href="/"
        className="flex items-center"
        onClick={handleLinkClick}
        aria-label="Ir a la página principal"
      >
        <Image
          src="/logo.png"
          alt="Logo SegundaMano"
          width={100}           
          height={96}
          priority={true}      
          quality={100}       
          style={{ objectFit: "contain" }}
        />
      </Link>

      <button
        className="sm:hidden flex flex-col justify-center items-center gap-[6px]"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <span
          className={`block w-8 h-1 bg-yellow-300 rounded transition-transform ${
            menuOpen ? "rotate-45 translate-y-[7px]" : ""
          }`}
        />
        <span
          className={`block w-8 h-1 bg-yellow-300 rounded transition-opacity ${
            menuOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`block w-8 h-1 bg-yellow-300 rounded transition-transform ${
            menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
          }`}
        />
      </button>

      <div
        className={`${
          menuOpen ? "flex" : "hidden"
        } absolute top-full left-0 w-full bg-blue-700 flex-col sm:flex sm:flex-row sm:static sm:w-auto sm:bg-transparent sm:gap-8 z-50`}
      >
        <Link
          href="/"
          onClick={handleLinkClick}
          className="block px-6 py-3 text-center hover:text-teal-300 transition"
        >
          Inicio
        </Link>
        <Link
          href="/products"
          onClick={handleLinkClick}
          className="block px-6 py-3 text-center hover:text-teal-300 transition"
        >
          Comprar
        </Link>

        <button
          onClick={handlePublishClick}
          className="block px-6 py-3 text-center hover:text-teal-300 transition bg-transparent border-none cursor-pointer"
        >
          Publicar producto
        </button>

        <Link
          href="/car"
          onClick={handleLinkClick}
          className="block px-6 py-3 text-center hover:text-teal-300 transition"
        >
          Carrito
        </Link>

        {isAuthenticated && (
          <button
            onClick={() => {
              handleLogout();
              handleLinkClick();
            }}
            className="block px-6 py-3 text-center hover:text-red-400 transition bg-transparent border-none cursor-pointer"
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </nav>
  );
}
