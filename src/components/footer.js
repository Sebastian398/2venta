export default function Footer() {
  return (
    <footer className="bg-blue-400 text-white-700 p-5 flex justify-center gap-4 items-center">
      <p>&copy; {new Date().getFullYear()} SegundaMano. Todos los derechos reservados.</p>
    </footer>
  );
}
