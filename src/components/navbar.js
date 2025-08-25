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
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoriaOpen, setCategoriaOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productos, setProductos] = useState([]);
  const router = useRouter();
  const accountMenuRef = useRef(null);
  const categoriaRef = useRef(null);

  const categorias = [
    "Todas",
    "Ropa",
    "Utiles",
    "Calzado",
    "Libros",
    "Electrónica",
    "Hogar",
    "Juguetes",
    "Deportes",
    "Accesorios",
  ];

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const user = localStorage.getItem("user");
    setIsAuthenticated(!!user);

    const storedProducts = JSON.parse(localStorage.getItem("productos")) || [];
    setProductos(storedProducts);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    let prods = productos;

    if (selectedCategory && selectedCategory !== "Todas") {
      prods = prods.filter((p) => p.categoria === selectedCategory);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      prods = prods.filter((p) => p.nombre.toLowerCase().includes(term));
    }

    setFilteredProducts(prods);
  }, [searchTerm, selectedCategory, productos, isClient]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountMenuOpen(false);
      }
      if (
        categoriaRef.current &&
        !categoriaRef.current.contains(event.target)
      ) {
        setCategoriaOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setAccountMenuOpen(false);
    setMenuOpen(false);
    setIsAuthenticated(false);
    router.push("/");
  };

  const handlePublishClick = () => {
    setMenuOpen(false);
    if (isAuthenticated) {
      router.push("/publish");
    } else {
      alert("Primero debes activar o crear tu cuenta");
    }
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
    setAccountMenuOpen(false);
    setCategoriaOpen(false);
  };

  const handleChangePassword = () => {
    setAccountMenuOpen(false);
    setMenuOpen(false);
    router.push("/password");
  };

  const onProductoClick = (id) => {
    setSearchTerm("");
    setFilteredProducts([]);
    router.push(`/product/${id}`);
  };

  return (
    <nav
      className={`${poppins.variable} ${russo.variable} font-sans bg-blue-400 text-white px-4 py-2 shadow-md`}
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center flex-shrink-0 mr-3 sm:mr-6"
          onClick={handleLinkClick}
          aria-label="Ir a la página principal"
        >
          <Image
            src="/logo2.png"
            alt="Logo 2venta"
            width={70}
            height={60}
            priority
            quality={100}
            style={{ objectFit: "contain" }}
          />
        </Link>

        <div className="flex-1 max-w-xl relative flex items-center order-2 sm:order-2 w-full sm:w-auto">
          <div className="relative flex-1 text-black">
            <input
              type="search"
              aria-label="Buscar productos"
              placeholder="Buscar producto..."
              className="w-full bg-white pl-10 pr-3 py-2 rounded shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.6 3.6a7.5 7.5 0 0012.05 12.05z"
              />
            </svg>
          </div>

          <button
            className="sm:hidden ml-3 flex flex-col justify-center items-center gap-[5px]"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Alternar menú"
            aria-expanded={menuOpen}
            type="button"
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

          {isClient && searchTerm !== "" && (
            <div className="absolute top-full left-0 w-full bg-white text-black shadow-lg rounded-b max-h-64 overflow-auto z-50 mt-1">
              {filteredProducts.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredProducts.map((p) => (
                    <li
                      key={p.id}
                      className="px-3 py-2 hover:bg-teal-200 cursor-pointer"
                      onClick={() => onProductoClick(p.id)}
                    >
                      {p.nombre}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-3 text-gray-700 italic">
                  No hay productos con ese nombre.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-6 order-3 flex-shrink-0">
          <Link
            href="/"
            onClick={handleLinkClick}
            className="text-white text-sm hover:text-teal-300"
          >
            Inicio
          </Link>

          <div className="relative" ref={categoriaRef}>
            <button
              onClick={() => setCategoriaOpen((prev) => !prev)}
              className="text-white text-sm hover:text-teal-300 bg-transparent border-none cursor-pointer flex items-center gap-1 focus:outline-none"
              type="button"
              aria-haspopup="true"
              aria-expanded={categoriaOpen}
            >
              Categorías ▾
            </button>
            {categoriaOpen && (
              <ul className="absolute right-0 mt-2 bg-white text-black rounded shadow-md min-w-[140px] z-50 max-h-56 overflow-auto">
                {categorias.map((cat) => (
                  <li
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat === "Todas" ? null : cat);
                      setCategoriaOpen(false);
                      setMenuOpen(false);
                    }}
                    className="px-3 py-2 hover:bg-teal-200 cursor-pointer"
                  >
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            href="/products"
            onClick={handleLinkClick}
            className="text-white text-sm hover:text-teal-300"
          >
            Comprar
          </Link>

          <button
            onClick={handlePublishClick}
            className="text-white text-sm hover:text-teal-300 bg-transparent border-none cursor-pointer"
            type="button"
          >
            Vender
          </button>

          <Link
            href="/car"
            onClick={handleLinkClick}
            className="text-white text-sm hover:text-teal-300"
          >
            Carrito
          </Link>

          {/* Botón Cuenta siempre visible */}
          <div className="relative" ref={accountMenuRef}>
            <button
              onClick={() => setAccountMenuOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={accountMenuOpen}
              className="text-white text-sm hover:text-teal-300 bg-transparent border-none cursor-pointer whitespace-nowrap"
              type="button"
            >
              Cuenta ▾
            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-50 ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:text-white">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setMenuOpen(false);
                      }}
                      className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setMenuOpen(false);
                      }}
                      className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
                    >
                      Registrarse
                    </Link>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menú movil desplegable */}
      {menuOpen && (
        <div className="sm:hidden mt-2 max-w-7xl mx-auto px-4 flex flex-col gap-3 text-center bg-blue-700 rounded">
          <Link
            href="/"
            onClick={handleLinkClick}
            className="text-white text-base hover:text-teal-300"
          >
            Inicio
          </Link>

          <button
            onClick={() => setCategoriaOpen((prev) => !prev)}
            className="text-white text-base hover:text-teal-300 bg-transparent border-none cursor-pointer"
            type="button"
          >
            Categorías ▾
          </button>

          {categoriaOpen && (
            <ul className="bg-white text-black rounded shadow-md max-h-56 overflow-auto mt-1">
              {categorias.map((cat) => (
                <li
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat === "Todas" ? null : cat);
                    setCategoriaOpen(false);
                    setMenuOpen(false);
                  }}
                  className="px-3 py-2 hover:bg-teal-200 cursor-pointer"
                >
                  {cat}
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/products"
            onClick={handleLinkClick}
            className="text-white text-base hover:text-teal-300"
          >
            Comprar
          </Link>

          <button
            onClick={handlePublishClick}
            className="text-white text-base hover:text-teal-300 bg-transparent border-none cursor-pointer"
            type="button"
          >
            Vender
          </button>

          <Link
            href="/car"
            onClick={handleLinkClick}
            className="text-white text-base hover:text-teal-300"
          >
            Carrito
          </Link>

          <button
            onClick={() => {
              setAccountMenuOpen((prev) => !prev);
              setMenuOpen(false);
            }}
            className="text-white text-base hover:text-teal-300 bg-transparent border-none cursor-pointer w-full"
            type="button"
          >
            Cuenta ▾
          </button>
          {accountMenuOpen && (
            <div className="bg-white text-black rounded shadow-md">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      setMenuOpen(false);
                    }}
                    className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => {
                      setAccountMenuOpen(false);
                      setMenuOpen(false);
                    }}
                    className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
                  >
                    Registrarse
                  </Link>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
