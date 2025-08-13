"use client";

import { useState, useEffect, useRef } from "react";
import Card from "../../components/card1";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [usuarioActivo, setUsuarioActivo] = useState(null);
  const [expandidos, setExpandidos] = useState({});
  const [mostrarVerMas, setMostrarVerMas] = useState({});
  const router = useRouter();

  const descripcionRefs = useRef({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
      setProductos(productosGuardados);

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

  useEffect(() => {
    const nuevosMostrarVerMas = {};
    Object.entries(descripcionRefs.current).forEach(([id, ref]) => {
      if (ref) {
        const lineHeight = parseFloat(getComputedStyle(ref).lineHeight);
        const maxHeight = lineHeight * 4; // 4 líneas
        nuevosMostrarVerMas[id] = ref.scrollHeight > maxHeight + 1;
      }
    });
    setMostrarVerMas(nuevosMostrarVerMas);
  }, [productos, expandidos]);

  const agregarAlCarrito = (producto) => {
    if (typeof window === "undefined") return;
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    carritoGuardado.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carritoGuardado));
    alert(`“${producto.nombre}” añadido al carrito.`);
  };

  const eliminarProducto = (id) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    const nuevosProductos = productos.filter((p) => p.id !== id);
    localStorage.setItem("productos", JSON.stringify(nuevosProductos));
    setProductos(nuevosProductos);
  };

  const editarProducto = (id) => {
    router.push(`/edit/${id}`);
  };

  const toggleExpandir = (id) => {
    setExpandidos((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const descripcionRestriccion = {
    display: "-webkit-box",
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center">
      {productos.length === 0 ? (
        <Card>
          <div className="p-6 text-center">
            <h2 className="text-xl text-black font-semibold mb-2">No hay productos publicados</h2>
            <p className="text-gray-600">Cuando algún usuario publique un producto, aparecerá aquí.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
          {productos.map(({ id, nombre, descripcion, precio, imagen, creador }) => {
            const esPropietario = usuarioActivo?.email === creador;
            const estaExpandido = expandidos[id] || false;
            const mostrarBoton = mostrarVerMas[id] || false;

            return (
              <Card key={id} className="w-full max-w-sm">
                <div className="flex flex-col items-center p-4 w-full">
                  {imagen ? (
                    <div className="w-[192px] h-[192px] mb-4 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={imagen}
                        alt={nombre}
                        width={192}
                        height={192}
                        className="object-cover w-full h-full"
                        priority={true}
                      />
                    </div>
                  ) : (
                    <div className="w-[192px] h-[192px] bg-gray-200 flex items-center justify-center rounded-lg mb-4 flex-shrink-0">
                      <span className="text-gray-400">Sin imagen</span>
                    </div>
                  )}

                  <h2 className="text-lg text-black font-bold mb-2 text-center">{nombre}</h2>

                  {descripcion ? (
                    <div className="mb-4 text-center text-gray-700 relative w-full max-w-[400px]">
                      <p
                        ref={(el) => (descripcionRefs.current[id] = el)}
                        style={estaExpandido ? {} : descripcionRestriccion}
                      >
                        {descripcion}
                      </p>
                      {mostrarBoton && (
                        <button
                          className="text-teal-600 font-semibold mt-1 underline cursor-pointer bg-transparent border-0 p-0"
                          onClick={() => toggleExpandir(id)}
                          aria-label={estaExpandido ? "Ver menos descripción" : "Ver más descripción"}
                        >
                          {estaExpandido ? "Ver menos" : "Ver más"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="mb-4 text-center text-gray-400 italic w-full">Sin descripción</p>
                  )}

                  <p className="text-teal-600 font-semibold text-center mb-4">${precio.toFixed(2)}</p>

                  <button
                    onClick={() => agregarAlCarrito({ id, nombre, descripcion, precio, imagen })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition mb-3 w-full max-w-xs"
                  >
                    Añadir al carrito
                  </button>

                  {esPropietario && (
                    <div className="flex gap-4 w-full justify-center">
                      <button
                        onClick={() => editarProducto(id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition flex-1 max-w-xs"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProducto(id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition flex-1 max-w-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
