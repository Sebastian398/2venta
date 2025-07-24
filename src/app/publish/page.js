"use client";

import { useState, useEffect } from "react";
import Card from "../../components/card1";
import Validation from "../../components/validation";

export default function PublicarProductoWrapper() {
  const [usuarioValidado, setUsuarioValidado] = useState(false);

  const manejarValidacionExitosa = () => {
    setUsuarioValidado(true);
  };

  return usuarioValidado ? (
    <PublicarProducto />
  ) : (
    <Validation onValid={manejarValidacionExitosa} />
  );
}

function PublicarProducto() {
  const metodosDisponibles = [
    "Efectivo",
    "Tarjeta de crédito/débito",
    "PayPal",
    "Transferencia bancaria",
  ];

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    cantidad: "",
    imagen: "",
    metodosPago: [],
  });

  const [mensaje, setMensaje] = useState("");
  const [vistaPrevia, setVistaPrevia] = useState("");
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUsuarioActivo(JSON.parse(userStr));
        } catch {
          setUsuarioActivo(null);
        }
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imagen: reader.result });
        setVistaPrevia(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleMetodoPago = (metodo) => {
    let nuevosMetodos;
    if (formData.metodosPago.includes(metodo)) {
      nuevosMetodos = formData.metodosPago.filter((m) => m !== metodo);
    } else {
      nuevosMetodos = [...formData.metodosPago, metodo];
    }
    setFormData({ ...formData, metodosPago: nuevosMetodos });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.nombre ||
      !formData.precio ||
      !formData.imagen ||
      !formData.cantidad ||
      formData.metodosPago.length === 0
    ) {
      setMensaje(
        "Completa nombre, precio, cantidad, añade una imagen y selecciona al menos un método de pago."
      );
      return;
    }

    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];

    const nuevoProducto = {
      id: Date.now(),
      creador: usuarioActivo ? usuarioActivo.email : null,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      cantidad: parseInt(formData.cantidad, 10),
      imagen: formData.imagen,
      metodosPago: formData.metodosPago,
    };

    productosGuardados.push(nuevoProducto);
    localStorage.setItem("productos", JSON.stringify(productosGuardados));

    setMensaje("¡Producto publicado exitosamente!");
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      cantidad: "",
      imagen: "",
      metodosPago: [],
    });
    setVistaPrevia("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card>
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
            Publicar nuevo producto
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre */}
            <label className="block">
              <span className="font-semibold text-gray-700 mb-1">Nombre del producto *</span>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 text-black"
                placeholder="Ejemplo: Bicicleta usada"
              />
            </label>

            {/* Descripción */}
            <label className="block">
              <span className="font-semibold text-gray-700 mb-1">Descripción</span>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-black"
                rows={2}
                placeholder="Detalles importantes del producto (opcional)"
              />
            </label>

            {/* Precio */}
            <label className="block">
              <span className="font-semibold text-gray-700 mb-1">Precio *</span>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
                min={0}
                step="0.01"
                className="w-full border rounded px-3 py-2 text-black"
                placeholder="Ejemplo: 120000"
              />
            </label>

            {/* Cantidad */}
            <label className="block">
              <span className="font-semibold text-gray-700 mb-1">Cantidad *</span>
              <input
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                required
                min={1}
                step="1"
                className="w-full border rounded px-3 py-2 text-black"
                placeholder="Ejemplo: 3"
              />
            </label>

            {/* Imagen */}
            <label className="block">
              <span className="font-semibold text-gray-700 mb-1">Imagen del producto *</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="block mt-1 text-black bg-white border border-gray-300 rounded px-3 py-2"
              />
              {vistaPrevia && (
                <img
                  src={vistaPrevia}
                  alt="Vista previa"
                  className="w-32 h-32 object-cover rounded-xl mt-2 border mx-auto"
                />
              )}
            </label>

            {/* Métodos de pago */}
            <fieldset className="border border-gray-300 rounded p-4">
              <legend className="font-semibold mb-2 text-gray-700">
                Métodos de pago que aceptas *
              </legend>
              <div className="flex flex-wrap gap-3">
                {metodosDisponibles.map((metodo) => {
                  const seleccionado = formData.metodosPago.includes(metodo);
                  return (
                    <label
                      key={metodo}
                      className={`cursor-pointer select-none rounded border px-4 py-2 ${
                        seleccionado
                          ? "bg-teal-600 border-teal-600 text-white"
                          : "bg-white border-gray-300 text-gray-800 hover:bg-teal-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="metodosPago"
                        value={metodo}
                        checked={seleccionado}
                        onChange={() => toggleMetodoPago(metodo)}
                        className="hidden"
                      />
                      {metodo}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {mensaje && (
              <p className="text-center text-teal-700 font-semibold">{mensaje}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded py-2 font-semibold transition"
            >
              Publicar producto
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
