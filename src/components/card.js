export default function Card({ children }) {
  return (
    <div className="break-inside-avoid  bg-white shadow-lg rounded-2xl p-8 max-w-md mx-auto shadow-lg border-2 border-teal-400">
      {children}
    </div>
  );
}
