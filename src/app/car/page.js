"use client";

import { useState, useEffect } from "react";
import Card from "../../components/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

function consolidarProductos(productos) {
  const mapa = new Map();

  productos.forEach((prod) => {
    if (mapa.has(prod.id)) {
      const existente = mapa.get(prod.id);
      mapa.set(prod.id, {
        ...existente,
        cantidad: (existente.cantidad || 1) + (prod.cantidad || 1),
      });
    } else {
      mapa.set(prod.id, { ...prod, cantidad: prod.cantidad || 1 });
    }
  });

  return Array.from(mapa.values());
}

export default function Carrito() {
  const [productos, setProductos] = useState([]);
  const router = useRouter();

  // Estado para cantidades a eliminar por producto
  const [cantidadesEliminar, setCantidadesEliminar] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const carritoRaw = JSON.parse(localStorage.getItem("carrito")) || [];
      const carritoConsolidado = consolidarProductos(carritoRaw);
      setProductos(carritoConsolidado);

      const inicial = {};
      carritoConsolidado.forEach((p) => {
        inicial[p.id] = 1;
      });
      setCantidadesEliminar(inicial);

      localStorage.setItem("carrito", JSON.stringify(carritoConsolidado));
    }
  }, []);

  const total = productos.reduce(
    (acc, p) => acc + p.precio * (p.cantidad || 1),
    0
  );

  const handleCantidadEliminarChange = (id, valor) => {
    let cantidad = parseInt(valor, 10);
    if (isNaN(cantidad) || cantidad < 1) cantidad = 1;
    const producto = productos.find((p) => p.id === id);
    if (producto && cantidad > producto.cantidad) cantidad = producto.cantidad;
    setCantidadesEliminar((prev) => ({ ...prev, [id]: cantidad }));
  };

  const eliminarProductoCantidad = (id) => {
    const cantidadAEliminar = cantidadesEliminar[id] || 1;
    const producto = productos.find((p) => p.id === id);
    if (!producto) return;

    if (cantidadAEliminar >= producto.cantidad) {
      const nuevoCarrito = productos.filter((p) => p.id !== id);
      setProductos(nuevoCarrito);
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
      setCantidadesEliminar((prev) => {
        const copia = { ...prev };
        delete copia[id];
        return copia;
      });
    } else {
      const nuevoCarrito = productos.map((p) => {
        if (p.id === id) {
          return { ...p, cantidad: p.cantidad - cantidadAEliminar };
        }
        return p;
      });
      setProductos(nuevoCarrito);
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));

      setCantidadesEliminar((prev) => ({
        ...prev,
        [id]: Math.min(prev[id] || 1, producto.cantidad - cantidadAEliminar),
      }));
    }
  };

  const vaciarCarrito = () => {
    localStorage.removeItem("carrito");
    setProductos([]);
    router.push("/products");
  };

  const handleComprar = () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        router.push("/bill");
      } else {
        router.push("/register");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-teal-500">Carrito de compras</h1>
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {productos.length === 0 ? (
          <Card>
            <div className="flex flex-col items-center justify-center p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                No hay productos aún
              </h2>
              <p className="text-gray-500 text-center">
                Agrega productos a tu carrito para verlos aquí.
              </p>
            </div>
          </Card>
        ) : (
          productos.map(({ id, nombre, precio, imagen, cantidad = 1 }) => (
            <Card key={id}>
              <div className="flex flex-col items-center p-4 gap-4">
                <div className="flex flex-col xl:flex-row items-start sm:items-center gap-6 w-full">
                  {imagen ? (
                    <div className="w-40 h-40 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={imagen}
                        alt={nombre}
                        width={160}
                        height={160}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400">Sin imagen</span>
                    </div>
                  )}

                  <div className="flex-1 text-left">
                    <h2 className="text-lg font-bold text-teal-600">{nombre}</h2>
                    <p className="text-black font-semibold mb-1">
                      Precio unitario: ${precio.toFixed(2)}
                    </p>
                    <p className="mb-1 text-lg text-black font-semibold">Cantidad: {cantidad}</p>
                    <p className="text-black font-semibold">
                      Subtotal: ${(precio * cantidad).toFixed(2)}
                    </p>
                  </div>
                </div>

                {cantidad > 1 && (
                  <div className="w-full flex justify-center items-center gap-2">
                    <label
                      htmlFor={`cantidad-eliminar-${id}`}
                      className="text-black font-semibold"
                    >
                      Eliminar cantidad:
                    </label>
                    <input
                      type="number"
                      id={`cantidad-eliminar-${id}`}
                      min={1}
                      max={cantidad}
                      value={cantidadesEliminar[id] || 1}
                      onChange={(e) => handleCantidadEliminarChange(id, e.target.value)}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-center text-black"
                    />
                  </div>
                )}

                <div className="w-full flex justify-center">
                  <button
                    onClick={() => eliminarProductoCantidad(id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition"
                    aria-label={`Eliminar producto ${nombre} del carrito`}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      <br />

      {productos.length > 0 && (
        <Card className="mt-8 max-w-2xl w-full p-6 flex flex-col items-center gap-6">
          <p className="text-xl font-bold text-black text-center">
            Total: <span className="text-black">${total.toFixed(2)}</span>
          </p>
          <div className="flex gap-4 justify-center w-full max-w-sm">
            <button
              onClick={vaciarCarrito}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-semibold transition w-1/2"
            >
              Vaciar
            </button>
            <button
              onClick={handleComprar}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded font-semibold transition w-1/2"
            >
              Comprar
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
