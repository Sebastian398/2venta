"use client";

import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const modo = localStorage.getItem("darkMode");
      if (modo === "true") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const nuevoModo = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", nuevoModo.toString());
        if (nuevoModo) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return nuevoModo;
    });
  };

  return (
    <button
      onClick={toggleDarkMode}
      className={`fixed bottom-4 left-4 z-50 rounded-md px-4 py-2 border transition
        ${
          darkMode
            ? "bg-white text-black border-gray-300"
            : "bg-black text-white border-gray-700"
        }
        hover:ring-2 hover:ring-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500`}
      aria-label="Alternar modo oscuro"
    >
      {darkMode ? "Desactivar modo oscuro" : "Activar modo oscuro"}
    </button>
  );
}
