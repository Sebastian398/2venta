export default function Footer() {
  return (
    <footer className="bg-blue-400 text-white p-5 flex justify-center gap-4 items-center font-sans text-sm">
      <p>&copy; {new Date().getFullYear()} SegundaMano. Todos los derechos reservados.</p>
    </footer>
  );
}
