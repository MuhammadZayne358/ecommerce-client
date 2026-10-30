// src/pages/shop/NotFound.tsx
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-serif text-8xl font-semibold text-violet-600">404</p>

      <h1 className="mt-4 font-serif text-3xl font-semibold text-gray-800">
        Page not found
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-8 rounded-full bg-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;