"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../../components/card1";
import Button from "../../components/button";
import Validation from "../../components/validation"; // Ajusta ruta si necesario
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faLock, faPhone } from "@fortawesome/free-solid-svg-icons";

export default function Registro() {
  const [formData, setFormData] = useState({
    usuario: "",       // Cambiado de nombre a usuario
    email: "",
    telefono: "",
    // dirección eliminada
    password: "",
    confirmarPassword: "",
  });
  const [error, setError] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Validación sencilla de campos obligatorios y contraseñas
  const validateForm = () => {
    if (!formData.usuario.trim() || !formData.email.trim() || !formData.password || !formData.confirmarPassword) {
      setError("Por favor completa todos los campos obligatorios.");
      return false;
    }
    if (formData.password !== formData.confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return false;
    }
    return true;
  };

  // Al pulsar registrar, valida e invoca la validación de email (mostrar componente Validation)
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (validateForm()) {
      setShowValidation(true);
    }
  };

  // Callback que se ejecuta cuando la validación de email confirma el usuario
  const onValidEmail = (emailConfirmado) => {
    // Aquí puedes hacer lógica de guardado (localStorage o API) una vez validado el email
    const usuariosGuardados = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (usuariosGuardados.some(u => u.email === emailConfirmado)) {
      setError("Este correo ya está registrado.");
      return;
    }
    usuariosGuardados.push(formData);
    localStorage.setItem("usuarios", JSON.stringify(usuariosGuardados));

    // Opcional limpiar datos y ocultar validación
    setShowValidation(false);
    setFormData({
      usuario: "",
      email: "",
      telefono: "",
      password: "",
      confirmarPassword: ""
    });

    // Redirigir o mostrar mensaje éxito
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card>
        {!showValidation ? (
          <div className="w-full max-w-md py-8 px-6">
            <h2 className="text-3xl font-bold mb-2 text-center text-blue-700">¡Regístrate!</h2>
            <p className="text-center mb-6 text-gray-600">
              Regístrate para empezar a publicar tus productos y realizar tus compras
            </p>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <label className="block">
                <span className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
                  <FontAwesomeIcon icon={faUser} /> Nombre de usuario <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  name="usuario"
                  placeholder="Tu nombre de usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  autoComplete="username"
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
                  autoComplete="email"
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
                  autoComplete="tel"
                />
              </label>
              {/* Dirección eliminada */}

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
                  autoComplete="new-password"
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
                  autoComplete="new-password"
                />
              </label>
              {error && <p className="text-red-600 font-semibold">{error}</p>}

              <Button type="submit" className="w-full mt-2">
                Registrarme
              </Button>

              {/* Botón "Ya tengo cuenta" */}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full mt-4 text-center text-blue-600 hover:text-blue-800 font-semibold transition"
              >
                Ya tengo cuenta
              </button>
            </form>
          </div>
        ) : (
          <Validation onValid={onValidEmail} />
        )}
      </Card>
    </div>
  );
}
