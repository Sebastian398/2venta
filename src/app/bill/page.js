"use client";

import { useState, useEffect } from "react";
import Card from "../../components/card1";
import { useRouter } from "next/navigation";

export default function DetalleFactura() {
  const [productos, setProductos] = useState([]);
  const [metodoPago, setMetodoPago] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      setProductos(carrito);
    }
  }, []);

  const total = productos.reduce(
    (acc, p) => acc + p.precio * (p.cantidad || 1),
    0
  );

  const metodosPagoDisponibles = [
    { id: "efectivo", label: "Efectivo" },
    { id: "tarjeta", label: "Tarjeta de crédito/débito" },
    { id: "paypal", label: "PayPal" },
    { id: "transferencia", label: "Transferencia bancaria" },
  ];

  const confirmarCompra = () => {
    if (!metodoPago) {
      alert("Por favor, selecciona un método de pago antes de confirmar.");
      return;
    }
    alert(
      `Compra confirmada con método de pago: ${metodoPago}. Total a pagar: $${total.toFixed(2)}`
    );
    localStorage.removeItem("carrito");
    setProductos([]);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">Detalle de factura</h1>

      <Card className="max-w-4xl w-full p-6 overflow-auto">
        {/* Listado productos */}
        {productos.length === 0 ? (
          <p className="text-center text-gray-600">
            No hay productos en el carrito.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse text-black">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-100">
                  <th className="py-3 px-6 text-left whitespace-nowrap">Producto</th>
                  <th className="py-3 px-6 text-right whitespace-nowrap">Precio unitario</th>
                  <th className="py-3 px-6 text-right whitespace-nowrap">Cantidad</th>
                  <th className="py-3 px-6 text-right whitespace-nowrap">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {productos.map(({ id, nombre, precio, cantidad = 1 }) => (
                  <tr key={id} className="border-b border-gray-200 even:bg-gray-50">
                    <td className="py-3 px-6 whitespace-nowrap">{nombre}</td>
                    <td className="py-3 px-6 text-right">${precio.toFixed(2)}</td>
                    <td className="py-3 px-6 text-right">{cantidad}</td>
                    <td className="py-3 px-6 text-right">${(precio * cantidad).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Total alineado a la izquierda con margen superior */}
        {productos.length > 0 && (
          <p className="text-left mt-6 text-xl text-black font-semibold">
            Total a pagar: <span className="text-teal-700">${total.toFixed(2)}</span>
          </p>
        )}

        {/* Método de pago */}
        {productos.length > 0 && (
          <div className="mt-8">
            <p className="mb-3 text-black font-semibold">Selecciona método de pago:</p>
            <div className="flex flex-wrap gap-4">
              {metodosPagoDisponibles.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMetodoPago(id)}
                  className={`px-4 py-2 rounded border font-medium transition whitespace-nowrap ${
                    metodoPago === id
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white text-black border-gray-400 hover:bg-teal-100"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Botón confirmar compra centrado */}
        {productos.length > 0 && metodoPago && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={confirmarCompra}
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded font-semibold transition"
            >
              Confirmar compra
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
