"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "./card";

export default function Validation({ onValid }) {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    documento: "",
    telefono: "",
    direccion: "",
    email: "",
  });

  const [errores, setErrores] = useState({});
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [codigoConfirmacion, setCodigoConfirmacion] = useState("");
  const [codigoIngresado, setCodigoIngresado] = useState("");
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");

  const router = useRouter();

  const validarCampos = () => {
    let errs = {};
    if (!formData.nombreCompleto.trim()) {
      errs.nombreCompleto = "Ingrese su nombre completo";
    }
    if (!formData.documento.trim()) {
      errs.documento = "Ingrese número de documento";
    } else if (!/^\d{6,15}$/.test(formData.documento.trim())) {
      errs.documento = "Documento debe tener entre 6 y 15 dígitos numéricos";
    }
    if (!formData.telefono.trim()) {
      errs.telefono = "Ingrese su teléfono";
    } else if (!/^\+?\d{7,15}$/.test(formData.telefono.trim())) {
      errs.telefono = "Teléfono inválido. Solo números y opcional + al inicio";
    }
    if (!formData.direccion.trim()) {
      errs.direccion = "Ingrese su dirección";
    }
    if (!formData.email.trim()) {
      errs.email = "Ingrese su correo electrónico";
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      errs.email = "Formato de correo electrónico inválido";
    }
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (validarCampos()) {
      try {
        const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

        const res = await fetch("/api/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, codigo: generatedCode }),
        });

        let data;
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }

        if (!res.ok) {
          throw new Error(data?.error || text || "Error enviando el correo");
        }

        setCodigoConfirmacion(generatedCode);
        setEmailEnviado(true);
        setMensajeConfirmacion(`Código de confirmación enviado a ${formData.email}. Revisa tu correo.`);
      } catch (error) {
        setMensajeConfirmacion(`No fue posible enviar el correo: ${error.message}`);
        console.error(error);
      }
    }
  };

  const handleConfirmCode = (e) => {
    e.preventDefault();

    if (codigoIngresado === codigoConfirmacion) {
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      const userIndex = usuarios.findIndex((u) => u.email === formData.email);

      if (userIndex !== -1) {
        usuarios[userIndex].emailConfirmado = true;
      } else {
        usuarios.push({ ...formData, emailConfirmado: true });
      }
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      setMensajeConfirmacion("¡Email confirmado! Validando identidad...");
      setTimeout(() => {
        onValid(formData.email);
      }, 1000);
    } else {
      setMensajeConfirmacion("Código incorrecto. Inténtelo de nuevo.");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
      }}
    >
      <Card className="max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Validación de identidad necesaria
        </h2>
        <p className="mb-4 text-center text-gray-700">
          Para publicar o comprar un producto, confirma tu identidad ingresando tus datos y verificando tu email.
        </p>

        {!emailEnviado ? (
          <form onSubmit={handleSendEmail} className="space-y-4">
            <label className="block">
              <span className="font-semibold text-gray-700">Nombre completo *</span>
              <input
                type="text"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 text-black ${
                  errores.nombreCompleto ? "border-red-600" : "border-gray-300"
                }`}
                required
              />
              {errores.nombreCompleto && <p className="text-red-600 text-sm mt-1">{errores.nombreCompleto}</p>}
            </label>

            <label className="block">
              <span className="font-semibold text-gray-700">Número de documento *</span>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 text-black ${
                  errores.documento ? "border-red-600" : "border-gray-300"
                }`}
                required
              />
              {errores.documento && <p className="text-red-600 text-sm mt-1">{errores.documento}</p>}
            </label>

            <label className="block">
              <span className="font-semibold text-gray-700">Teléfono *</span>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 text-black ${
                  errores.telefono ? "border-red-600" : "border-gray-300"
                }`}
                required
              />
              {errores.telefono && <p className="text-red-600 text-sm mt-1">{errores.telefono}</p>}
            </label>

            <label className="block">
              <span className="font-semibold text-gray-700">Dirección *</span>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 text-black ${
                  errores.direccion ? "border-red-600" : "border-gray-300"
                }`}
                required
              />
              {errores.direccion && <p className="text-red-600 text-sm mt-1">{errores.direccion}</p>}
            </label>

            <label className="block">
              <span className="font-semibold text-gray-700">Correo Electrónico *</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 text-black ${
                  errores.email ? "border-red-600" : "border-gray-300"
                }`}
                required
              />
              {errores.email && <p className="text-red-600 text-sm mt-1">{errores.email}</p>}
            </label>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded py-2 font-semibold transition"
            >
              Enviar código de confirmación
            </button>

            {mensajeConfirmacion && (
              <p className="mt-2 text-center text-red-600 font-semibold">{mensajeConfirmacion}</p>
            )}
          </form>
        ) : (
          <form onSubmit={handleConfirmCode} className="space-y-4">
            <p className="text-center text-blue-600 font-medium">{mensajeConfirmacion}</p>
            <label className="block">
              <span className="font-semibold text-gray-700">Código de confirmación *</span>
              <input
                type="text"
                name="codigoIngresado"
                value={codigoIngresado}
                onChange={(e) => setCodigoIngresado(e.target.value)}
                className="w-full border rounded px-3 py-2 text-black"
                required
              />
            </label>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 font-semibold transition"
            >
              Confirmar código
            </button>
            <button
              type="button"
              onClick={() => {
                setEmailEnviado(false);
                setMensajeConfirmacion("");
                setCodigoIngresado("");
              }}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white rounded py-2 font-semibold transition mt-2"
            >
              Reingresar datos
            </button>
          </form>
        )}
      </Card>
    </div>
  );
}
