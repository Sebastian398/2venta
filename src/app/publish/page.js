"use client";

import { useState, useEffect } from "react";
import Card from "../../components/card";
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

  const metodosEnvioDisponibles = [
    "Recoger en tienda",
    "Envío estándar",
    "Envío urgente",
    "Envío internacional",
  ];

  // Categorías usadas
  const categorias = [
    "Todas",
    "Ropa",
    "Utiles",
    "Calzado",
    "Libros",
    "Electrónica",
    "Hogar",
    "Juguetes",
    "Deportes",
    "Accesorios",
  ];

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    cantidad: "",
    imagen: "",
    categoria: "",          // <-- Agregado campo categoría aquí
    metodosPago: [],
    metodosEnvio: [],
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

  const toggleMetodoEnvio = (metodo) => {
    let nuevosMetodos;
    if (formData.metodosEnvio.includes(metodo)) {
      nuevosMetodos = formData.metodosEnvio.filter((m) => m !== metodo);
    } else {
      nuevosMetodos = [...formData.metodosEnvio, metodo];
    }
    setFormData({ ...formData, metodosEnvio: nuevosMetodos });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.nombre ||
      !formData.precio ||
      !formData.imagen ||
      !formData.cantidad ||
      !formData.categoria || // validar categoría seleccionada
      formData.metodosPago.length === 0 ||
      formData.metodosEnvio.length === 0
    ) {
      setMensaje(
        "Completa nombre, precio, cantidad, añade una imagen, selecciona categoría, al menos un método de pago y un método de envío."
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
      categoria: formData.categoria, // guardamos categoría
      metodosPago: formData.metodosPago,
      metodosEnvio: formData.metodosEnvio,
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
      categoria: "",
      metodosPago: [],
      metodosEnvio: [],
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

            {/* Categorías (select) */}
            <label className="block">
              <span className="font-semibold text-gray-700 mb-1">Categoría *</span>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 text-black"
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
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

            {/* Métodos de envío */}
            <fieldset className="border border-gray-300 rounded p-4">
              <legend className="font-semibold mb-2 text-gray-700">
                Métodos de envío que ofreces *
              </legend>
              <div className="flex flex-wrap gap-3">
                {metodosEnvioDisponibles.map((metodo) => {
                  const seleccionado = formData.metodosEnvio.includes(metodo);
                  return (
                    <label
                      key={metodo}
                      className={`cursor-pointer select-none rounded border px-4 py-2 ${
                        seleccionado
                          ? "bg-green-600 border-green-600 text-white"
                          : "bg-white border-gray-300 text-gray-800 hover:bg-green-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="metodosEnvio"
                        value={metodo}
                        checked={seleccionado}
                        onChange={() => toggleMetodoEnvio(metodo)}
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
