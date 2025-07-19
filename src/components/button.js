export default function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-blue-700 hover:bg-blue-400 text-white font-bold rounded items-center gap-2 transition ${className}`}
    >
      {children}
    </button>
  );
}
