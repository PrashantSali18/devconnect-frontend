import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setCredentials } from "../../redux/slices/authSlice";
import { authAPI } from "../../utils/api";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      toast.error("OAuth authentication failed");
      navigate("/login");
      return;
    }

    if (token) {
      localStorage.setItem("token", token);

      // Fetch user data
      const fetchUser = async () => {
        try {
          const { data } = await authAPI.getMe();
          dispatch(setCredentials({ user: data, token }));
          toast.success("Welcome to DevConnect!");
          navigate("/");
        } catch (err) {
          toast.error("Failed to fetch user data");
          navigate("/login");
        }
      };

      fetchUser();
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate, dispatch]);

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
    <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
      {/* Spinner */}
      <div className="flex justify-center mb-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <p className="text-gray-700 font-medium">Completing authentication...</p>
    </div>
  </div>
);
};

export default OAuthSuccess;
