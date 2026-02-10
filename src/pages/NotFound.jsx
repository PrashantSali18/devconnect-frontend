import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
return (
  <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
    <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-4">404</h1>

    <p className="text-gray-500 text-lg mb-8">Page not found</p>

    <Link
      to="/"
      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
    >
      Go Home
    </Link>
  </div>
);
};

export default NotFound;
