"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Card from "../../../components/card1";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

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

  const [vistaPrevia, setVistaPrevia] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && id) {
      const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
      const producto = productosGuardados.find((p) => p.id === Number(id));

      const userStr = localStorage.getItem("user");
      let user = null;
      if (userStr) {
        try {
          user = JSON.parse(userStr);
          setUsuarioActivo(user);
        } catch {
          user = null;
          setUsuarioActivo(null);
        }
      }

      if (!producto) {
        setMensaje("Producto no encontrado.");
        return;
      }

      // Verificar que el usuario activo sea el creador del producto
      if (!user || user.email !== producto.creador) {
        setMensaje("No tienes permiso para editar este producto.");
        return;
      }

      setFormData({
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        precio: producto.precio?.toString() || "",
        cantidad: producto.cantidad?.toString() || "",
        imagen: producto.imagen || "",
        metodosPago: producto.metodosPago || [],
      });
      setVistaPrevia(producto.imagen || "");
    }
  }, [id]);

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
    const index = productosGuardados.findIndex((p) => p.id === Number(id));
    if (index === -1) {
      setMensaje("Producto no encontrado.");
      return;
    }

    if (!usuarioActivo || usuarioActivo.email !== productosGuardados[index].creador) {
      setMensaje("No tienes permiso para editar este producto.");
      return;
    }

    productosGuardados[index] = {
      ...productosGuardados[index],
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      cantidad: parseInt(formData.cantidad, 10),
      imagen: formData.imagen,
      metodosPago: formData.metodosPago,
    };

    localStorage.setItem("productos", JSON.stringify(productosGuardados));
    setMensaje("Producto editado exitosamente.");

    setTimeout(() => {
      router.push("/products");
    }, 1500);
  };

  if (mensaje === "No tienes permiso para editar este producto." || mensaje === "Producto no encontrado.") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card>
          <div className="max-w-md w-full p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600">{mensaje}</h2>
            <button
              onClick={() => router.push("/products")}
              className="mt-4 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded"
            >
              Volver a Productos
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card>
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Editar producto</h2>
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
              />
            </label>

            {/* Imagen */}
            <label className="block">
              <span className="font-semibold text-gray-700 mb-1">Imagen del producto *</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
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
              <legend className="font-semibold mb-2 text-gray-700">Métodos de pago que aceptas *</legend>
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
              Guardar cambios
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}
