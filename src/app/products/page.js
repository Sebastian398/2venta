"use client";

import { useState, useEffect } from "react";
import Card from "../../components/card1";
import Image from "next/image";

export default function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
      setProductos(productosGuardados);
    }
  }, []);

  // Función para añadir producto al carrito guardado en localStorage
  const agregarAlCarrito = (producto) => {
    if (typeof window === "undefined") return; // Protección SSR
    
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];

    // Opcionalmente evita duplicados por ID: aumenta cantidad o no añade repetidos.
    // Aquí añadimos sin cantidad, solo guardamos el producto.
    carritoGuardado.push(producto);

    localStorage.setItem("carrito", JSON.stringify(carritoGuardado));
    alert(`“${producto.nombre}” añadido al carrito.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">Productos publicados</h1>

      {productos.length === 0 ? (
        <Card>
          <div className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">No hay productos publicados</h2>
            <p className="text-gray-600">Cuando algún usuario publique un producto, aparecerá aquí.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {productos.map(({ id, nombre, descripcion, precio, imagen }) => (
            <Card key={id}>
              <div className="flex flex-col items-center p-4">
                {imagen ? (
                  <Image
                    src={imagen}
                    alt={nombre}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover mb-4"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
                    <span className="text-gray-400">Sin imagen</span>
                  </div>
                )}
                <h2 className="text-lg text-black font-bold mb-2 text-center">{nombre}</h2>
                {descripcion && <p className="text-gray-700 mb-4 text-center">{descripcion}</p>}
                <p className="text-teal-600 font-semibold text-center mb-4">${precio.toFixed(2)}</p>

                <button
                  onClick={() => agregarAlCarrito({ id, nombre, descripcion, precio, imagen })}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                >
                  Añadir al carrito
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
