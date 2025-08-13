"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evitar renderizado antes de montaje para que SSR y cliente coincidan
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Determina el tema actual efectivo, considerando modo sistema
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className={`
        fixed bottom-4 left-4 z-50 rounded-md px-3 py-1.5 border text-sm font-semibold font-sans transition
        ${
          currentTheme === "dark"
            ? "bg-white text-black border-gray-300"
            : "bg-black text-white border-gray-700"
        }
        hover:ring-2 hover:ring-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500
      `}
      aria-label="Alternar modo oscuro"
    >
      {currentTheme === "dark" ? "Desactivar modo oscuro" : "Activar modo oscuro"}
    </button>
  );
}
