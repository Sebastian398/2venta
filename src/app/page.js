"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faTags } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!user);
    }
  }, []);

  const handleComprarClick = () => {
    if (isAuthenticated) {
      router.push("/products");
    } else {
      alert("Primero debes iniciar sesión");
    }
  };

  const handlePublicarClick = () => {
    if (isAuthenticated) {
      router.push("/publish");
    } else {
      alert("Primero debes iniciar sesión");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 md:px-8 text-white shadow-2xl mb-10"
        style={{ backgroundImage: "url('/ropa3.jpg')" }}
      >
        <div className="bg-black bg-opacity-75 p-6 md:p-10 rounded-xl max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">SegundaMano</h1>
          <p className="text-base md:text-lg mb-6">
            ¿Qué esperas para comprar esos que siempre has querido?
            <br />
            <br />
            En SegundaMano, encuentra productos usados en excelente estado, al mejor precio, y vendedores confiables cerca de ti.
          </p>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="px-4 md:px-10">
        <div className="mx-auto max-w-screen-md rounded-t-lg border-x-2 border-x-teal-600 border-t-2 border-t-teal-600 text-4xl text-center">
          <h1 className="text-teal-500 font-bold">Servicios</h1>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center md:mx-20 lg:mx-60 my-10 gap-10">
          {/* Card 1 */}
          <div className="max-w-xs w-full bg-white rounded-2xl shadow-lg border-2 border-teal-400 overflow-hidden">
            <Image
              src="/ropa5.jpg"
              alt="Imagen"
              className="mt-10 mx-auto rounded-full"
              width={200}
              height={200}
            />
            <div className="p-4 text-center">
              <h2 className="text-xl font-semibold text-black mb-2 flex justify-center items-center gap-2">
                Compra artículos
              </h2>
              <p className="text-gray-600 mb-4">
                Descubre productos usados, desde electrónica hasta muebles, revisados y listos para ti.
              </p>
              <button
                onClick={handleComprarClick}
                className="inline-block bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
              >
                Comprar
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="max-w-xs w-full bg-white rounded-2xl shadow-lg border-2 border-teal-400 overflow-hidden">
            <Image
              src="/ropa2.jpg"
              alt="Imagen"
              className="mt-10 mx-auto rounded-full"
              width={200}
              height={200}
            />
            <div className="p-4 text-center">
              <h2 className="text-xl font-semibold text-black mb-2 flex justify-center items-center gap-2">
                Vende tus productos
              </h2>
              <p className="text-gray-600 mb-4">
                Publica tus artículos usados de forma sencilla y llega a compradores interesados.
              </p>
              <button
                onClick={handlePublicarClick}
                className="inline-block bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
              >
                Publicar
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="max-w-xs w-full bg-white rounded-2xl shadow-lg border-2 border-teal-400 overflow-hidden">
            <Image
              src="/garantia.jpg"
              alt="Imagen"
              className="mt-10 mx-auto rounded-full"
              width={200}
              height={200}
            />
            <div className="p-4 text-center">
              <h2 className="text-xl font-semibold text-black mb-2 flex justify-center items-center gap-2">
                Garantía y soporte
              </h2>
              <p className="text-gray-600 mb-4">
                Te ofrecemos seguridad y asistencia para que comprar y vender sea confiable y sencillo.
              </p>
              <Link
                href="/"
                className="inline-block bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
              >
                Soporte
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Acerca de nosotros */}
      <section className="flex justify-center items-center text-black px-4 my-20">
        <div className="shadow-lg max-w-4xl w-full rounded-2xl bg-white p-6 md:p-10 border-2 border-teal-400">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
            <div className="w-12 p-2 rounded-full bg-teal-500 flex items-center justify-center">
              <FontAwesomeIcon icon={faTags} className="fa-fw text-white" width={30} height={30} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">Acerca de nosotros</h1>
          </div>
          <div className="mt-4 text-center md:text-left">
            <p>
              Nuestra página está diseñada para apoyar a los usuarios en la compra y
              venta de productos usados, facilitando transacciones seguras y acceso a
              una comunidad confiable.
            </p>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="px-4">
        <div className="max-w-screen-xl mx-auto mb-20 flex flex-wrap justify-center gap-10 text-black px-6 py-8">
          <div className="bg-white max-w-xs w-full py-6 rounded-2xl shadow-lg border-2 border-teal-400 px-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-11 h-11 flex items-center justify-center rounded-full bg-teal-500">
                <FontAwesomeIcon icon={faEnvelope} className="text-white" width={30} height={30} />
              </div>
            </div>
            <h1 className="font-bold text-xl text-center mb-3">Información de contacto</h1>
            <p className="text-center text-sm">
              📧 Correo electrónico: atencion@SegundaMano.com
              <br />
              <br />
              🌐 Sitio web: www.SegundaMano.com
              <br />
              <br />
              🕒 Horario de atención:
              <br />
              Lunes a Viernes: 8:00 a.m. – 5:00 p.m.
              <br />
              Sábados: 9:00 a.m. – 1:00 p.m.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
