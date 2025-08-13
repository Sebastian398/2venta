export default function Card({ children }) {
  return (
    <div className="break-inside-avoid max-w-xs w-full mx-auto bg-white rounded-2xl shadow-lg border-2 border-teal-400 overflow-hidden">
      {children}
    </div>
  );
}
