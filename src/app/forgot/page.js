"use client";

import { useState } from "react";
import Card from "../../components/card";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [nuevoPassword, setNuevoPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [resetExitoso, setResetExitoso] = useState(false);
  const [error, setError] = useState("");

  // Envía el email con el link o código de recuperación
  const enviarEmailRecuperacion = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");
    if (!email.trim()) {
      setError("Por favor ingresa tu correo electrónico.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Formato de correo inválido.");
      return;
    }

    try {
      const res = await fetch("/api/email-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error enviando el correo.");
      }

      setEmailEnviado(true);
      setMensaje(`Se envió un enlace de recuperación a ${email}. Revisa tu correo.`);
    } catch (err) {
      setError(err.message || "Error enviando email. Inténtalo más tarde.");
    }
  };

  // Cambia la contraseña con nueva password
  const cambiarPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!nuevoPassword || !confirmarPassword) {
      setError("Por favor completa ambos campos de contraseña.");
      return;
    }
    if (nuevoPassword !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (nuevoPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const res = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nuevoPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al cambiar la contraseña.");
      }

      setResetExitoso(true);
      setMensaje("Contraseña cambiada exitosamente. Ahora puedes iniciar sesión.");
    } catch (err) {
      setError(err.message || "Error al cambiar la contraseña. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <Card>
        <div className="max-w-md w-full p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
            Olvidé mi contraseña
          </h2>

          {!emailEnviado && !resetExitoso && (
            <>
              <p className="mb-3 text-center text-gray-700">
                Ingresa tu correo para recibir instrucciones para restablecer tu contraseña.
              </p>
              <form onSubmit={enviarEmailRecuperacion} className="space-y-4">
                <label className="block">
                  <span className="block text-gray-700 mb-1">Correo electrónico</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-black focus:outline-none"
                    placeholder="tuemail@example.com"
                    required
                  />
                </label>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {mensaje && <p className="text-green-600 text-sm">{mensaje}</p>}
                <button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded font-semibold"
                >
                  Enviar enlace de recuperación
                </button>
              </form>
            </>
          )}

          {emailEnviado && !resetExitoso && (
            <>
              <p className="mb-3 text-center text-gray-700">
                Ingresa tu nueva contraseña para la cuenta: <strong>{email}</strong>
              </p>
              <form onSubmit={cambiarPassword} className="space-y-4">
                <label className="block">
                  <span className="block text-gray-700 mb-1">Nueva contraseña</span>
                  <input
                    type="password"
                    value={nuevoPassword}
                    onChange={(e) => setNuevoPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nueva contraseña"
                    required
                  />
                </label>
                <label className="block">
                  <span className="block text-gray-700 mb-1">Confirmar contraseña</span>
                  <input
                    type="password"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirma tu contraseña"
                    required
                  />
                </label>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {mensaje && <p className="text-green-600 text-sm">{mensaje}</p>}
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
                >
                  Cambiar contraseña
                </button>
              </form>
            </>
          )}

          {resetExitoso && (
            <div className="text-center">
              <p className="text-green-700 font-semibold">
                Contraseña actualizada con éxito, ya puedes iniciar sesión.
              </p>
              <Link
                href="/login"
                className="inline-block mt-4 text-blue-700 hover:underline"
                onClick={() => setEmailEnviado(false)}
              >
                Ir a Iniciar sesión
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
