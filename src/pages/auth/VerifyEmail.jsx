import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { authAPI } from "../../utils/api";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      await authAPI.verifyEmail(token);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-500 to-purple-600">
    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
      {status === "verifying" && (
        <>
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>

          <h1 className="text-2xl font-bold mb-2 text-gray-900">
            Verifying Email...
          </h1>

          <p className="text-gray-600">
            Please wait while we verify your email address.
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />

          <h1 className="text-2xl font-bold mb-2 text-gray-900">
            Email Verified!
          </h1>

          <p className="text-gray-600 mb-6">
            Your email has been successfully verified. You can now access all
            features.
          </p>

          <Link
            to="/"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
          >
            Go to Home
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />

          <h1 className="text-2xl font-bold mb-2 text-gray-900">
            Verification Failed
          </h1>

          <p className="text-gray-600 mb-6">
            The verification link is invalid or has expired. Please try again.
          </p>

          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
          >
            Back to Login
          </Link>
        </>
      )}
    </div>
  </div>
);
};

export default VerifyEmail;
