export default function Card({ children }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto mt-10 border border-green-300">
      {children}
    </div>
  );
}
