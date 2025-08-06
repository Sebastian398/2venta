"use client";

import { useState } from "react";
import Card from "../../components/card1";
import Button from "../../components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioEncontrado = usuariosGuardados.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (usuarioEncontrado) {
      const { password, ...usuarioSinPass } = usuarioEncontrado;
      localStorage.setItem("user", JSON.stringify(usuarioSinPass));
      setSuccess("Inicio de sesión exitoso!");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } else {
      setError("Correo o contraseña incorrectos.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card>
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <label className="block">
            <span className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
              <FontAwesomeIcon icon={faEnvelope} /> Correo electrónico
            </span>
            <input
              type="email"
              name="email"
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>

          <label className="block">
            <span className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
              <FontAwesomeIcon icon={faLock} /> Contraseña
            </span>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>

          {error && <p className="text-red-600 font-semibold">{error}</p>}
          {success && <p className="text-green-600 font-semibold">{success}</p>}

          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </Card>
    </div>
  );
}
