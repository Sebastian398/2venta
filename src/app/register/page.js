"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../../components/card1";
import Button from "../../components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faPhone } from "@fortawesome/free-solid-svg-icons";

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    confirmarPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.nombre.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmarPassword
    ) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }
    if (formData.password !== formData.confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (usuariosGuardados.some((u) => u.email === formData.email)) {
      setError("Este correo ya está registrado.");
      return;
    }
    const nuevoUsuario = { ...formData };
    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

    setSuccess("Registro exitoso!");
    setTimeout(() => {
      router.push("/login");
    }, 1500);

    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      password: "",
      confirmarPassword: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card>
        <div className="w-full max-w-md py-8 px-6">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">¡Regístrate!</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
                <FontAwesomeIcon icon={faUser} /> Nombre completo <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="nombre"
                placeholder="Tu nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </label>
            <label className="block">
              <span className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
                <FontAwesomeIcon icon={faEnvelope} /> Correo electrónico <span className="text-red-500">*</span>
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
                <FontAwesomeIcon icon={faPhone} /> Teléfono
              </span>
              <input
                type="tel"
                name="telefono"
                placeholder="Opcional"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="block">
              <span className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
                <FontAwesomeIcon icon={faLock} /> Contraseña <span className="text-red-500">*</span>
              </span>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </label>
            <label className="block">
              <span className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
                <FontAwesomeIcon icon={faLock} /> Confirmar contraseña <span className="text-red-500">*</span>
              </span>
              <input
                type="password"
                name="confirmarPassword"
                placeholder="********"
                value={formData.confirmarPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </label>
            {error && <p className="text-red-600 font-semibold">{error}</p>}
            {success && <p className="text-green-600 font-semibold">{success}</p>}
            <Button type="submit" className="w-full mt-2">
              Registrarme
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
