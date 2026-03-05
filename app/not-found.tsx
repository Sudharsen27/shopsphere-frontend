import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-8xl font-bold text-gray-700">404</h1>
      <h2 className="text-2xl font-semibold mt-4 text-gray-300">Page not found</h2>
      <p className="text-gray-400 mt-2 max-w-md">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
