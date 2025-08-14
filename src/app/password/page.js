"use client";

import { useState } from "react";
import Card from "../../components/card"; // Asegúrate que esta ruta sea la correcta según tu estructura

export default function ChangePasswordPage() {
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (!passwordActual || !passwordNueva || !passwordConfirmar) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (passwordNueva !== passwordConfirmar) {
      setError("La nueva contraseña y la confirmación no coinciden.");
      return;
    }

    if (passwordNueva.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // Aquí conecta con tu API para cambiar la contraseña,
    // por ejemplo enviando passwordActual y passwordNueva.

    // Por ahora simulamos un cambio exitoso con setTimeout:
    setTimeout(() => {
      setExito("Contraseña cambiada con éxito.");
      setPasswordActual("");
      setPasswordNueva("");
      setPasswordConfirmar("");
    }, 1000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="max-w-md w-full p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-teal-600">
          Cambiar contraseña
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col text-gray-700 font-semibold">
            Contraseña actual:
            <input
              type="password"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              autoComplete="current-password"
              minLength={6}
            />
          </label>

          <label className="flex flex-col text-gray-700 font-semibold">
            Nueva contraseña:
            <input
              type="password"
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              autoComplete="new-password"
              minLength={6}
            />
          </label>

          <label className="flex flex-col text-gray-700 font-semibold">
            Confirmar nueva contraseña:
            <input
              type="password"
              value={passwordConfirmar}
              onChange={(e) => setPasswordConfirmar(e.target.value)}
              className="mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
              autoComplete="new-password"
              minLength={6}
            />
          </label>

          {error && <p className="text-red-600 font-semibold">{error}</p>}
          {exito && <p className="text-green-600 font-semibold">{exito}</p>}

          <button
            type="submit"
            className="mt-4 bg-teal-600 text-white font-semibold rounded px-4 py-2 hover:bg-teal-700 transition"
          >
            Cambiar contraseña
          </button>
        </form>
      </Card>
    </main>
  );
}
