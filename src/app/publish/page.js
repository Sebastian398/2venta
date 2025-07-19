"use client";

import { useState } from "react";
import Card from "../../components/card1";

export default function PublicarProducto() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    cantidad: "", // <-- agregado campo cantidad
    imagen: "", // Guardará la base64 de la imagen
  });
  const [mensaje, setMensaje] = useState("");
  const [vistaPrevia, setVistaPrevia] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.nombre ||
      !formData.precio ||
      !formData.imagen ||
      !formData.cantidad
    ) {
      setMensaje("Completa nombre, precio, cantidad y añade una imagen.");
      return;
    }
    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
    const nuevo = {
      id: Date.now(),
      ...formData,
      precio: parseFloat(formData.precio),
      cantidad: parseInt(formData.cantidad, 10),
    };
    productosGuardados.push(nuevo);
    localStorage.setItem("productos", JSON.stringify(productosGuardados));
    setMensaje("¡Producto publicado exitosamente!");
    setFormData({ nombre: "", descripcion: "", precio: "", cantidad: "", imagen: "" });
    setVistaPrevia("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card>
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Publicar nuevo producto</h2>
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
