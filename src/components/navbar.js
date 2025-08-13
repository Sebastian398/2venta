"use client";

import { useState, useEffect, useRef } from "react";
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
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const accountMenuRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!user);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false);
      }
    }
    if (accountMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [accountMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    router.push("/");
    setAccountMenuOpen(false);
    setMenuOpen(false);
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
    setAccountMenuOpen(false);
  };

  const handleChangePassword = () => {
    setAccountMenuOpen(false);
    setMenuOpen(false);
    router.push("/password");
  };

  return (
    <nav
      className={`${poppins.variable} ${russo.variable} font-sans bg-blue-400 text-white px-3 py-2 shadow-md flex items-center justify-between relative`}
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center"
        onClick={handleLinkClick}
        aria-label="Ir a la página principal"
      >
        <Image
          src="/logo.png"
          alt="Logo 2venta"
          width={80}
          height={76}
          priority={true}
          quality={100}
          style={{ objectFit: "contain" }}
        />
      </Link>

      <button
        className="sm:hidden flex flex-col justify-center items-center gap-[5px]"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Alternar menú"
        aria-expanded={menuOpen}
      >
        <span
          className={`block w-7 h-0.5 bg-white rounded transition-transform ${
            menuOpen ? "rotate-45 translate-y-[6px]" : ""
          }`}
        />
        <span
          className={`block w-7 h-0.5 bg-white rounded transition-opacity ${
            menuOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`block w-7 h-0.5 bg-white rounded transition-transform ${
            menuOpen ? "-rotate-45 -translate-y-[6px]" : ""
          }`}
        />
      </button>

      {/* Menú principal */}
      <div
        className={`${
          menuOpen ? "flex" : "hidden"
        } absolute top-full left-0 w-full bg-blue-700 flex-col sm:flex sm:flex-row sm:static sm:w-auto sm:bg-transparent sm:gap-6 z-50`}
      >
        <Link
          href="/"
          onClick={handleLinkClick}
          className="block px-3 py-1.5 text-center hover:text-teal-300 transition text-sm w-full sm:w-auto"
        >
          Inicio
        </Link>
        <Link
          href="/products"
          onClick={handleLinkClick}
          className="block px-3 py-1.5 text-center hover:text-teal-300 transition text-sm w-full sm:w-auto"
        >
          Comprar
        </Link>

        <button
          onClick={handlePublishClick}
          className="block px-3 py-1.5 text-center hover:text-teal-300 transition bg-transparent border-none cursor-pointer text-sm w-full sm:w-auto"
        >
          Publicar producto
        </button>

        <Link
          href="/car"
          onClick={handleLinkClick}
          className="block px-3 py-1.5 text-center hover:text-teal-300 transition text-sm w-full sm:w-auto"
        >
          Carrito
        </Link>

        {/* Menú cuenta */}
        {isAuthenticated && (
          <div className="relative w-full sm:w-auto" ref={accountMenuRef}>
            <button
              onClick={() => setAccountMenuOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={accountMenuOpen}
              className="block w-full sm:w-auto px-3 py-1.5 text-center hover:text-teal-300 transition bg-transparent border-none cursor-pointer whitespace-nowrap text-sm"
              type="button"
            >
              Cuenta ▾
            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 light:bg-white light:text-black rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:text-white">
                <button
                  onClick={handleChangePassword}
                  className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
                  type="button"
                >
                  Cambiar contraseña
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 text-sm"
                  type="button"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
