import { Link } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-center px-6">
      <h1 className="text-6xl font-extrabold text-gold">404</h1>
      <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center px-4 py-2 bg-gold text-white rounded hover:bg-yellow-600 transition"
      >
        <HiArrowLeft className="mr-2" />
        Go Back Home
      </Link>
    </div>
  );
}
