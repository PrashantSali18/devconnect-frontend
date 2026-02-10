import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authAPI } from "./utils/api.js";
import {
  setUser,
  selectIsAuthenticated,
  selectAuthToken,
} from "./redux/slices/authSlice.js";
import useSocket from './hooks/useScoket.js';

// Layout
import Layout from "./components/layout/Layout.jsx";
import PrivateRoute from "./components/auth/PrivateRoute.jsx";

// Auth Pages
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import OAuthSuccess from "./pages/auth/OAuthSuccess.jsx";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";

// Main Pages
import Home from "./pages/home/Home.jsx";
import Explore from "./pages/home/Explore.jsx";
import Profile from "./pages/profile/Profile.jsx";
import EditProfile from "./pages/profile/EditProfile.jsx";
import Notifications from "./pages/notifications/Notifications.jsx";
import Chat from "./pages/chats/Chat.jsx";
import Search from "./pages/search/Search.jsx";
import PostDetail from "./pages/posts/PostDetail.jsx";
import Settings from "./pages/setting/Setting.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectAuthToken);

  useSocket();

  useEffect(() => {
    const fetchUser = async () => {
      if (token && !isAuthenticated) {
        try {
          const { data } = await authAPI.getMe();
          dispatch(setUser(data));
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };

    fetchUser();
  }, [token, isAuthenticated, dispatch]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/oauth/success" element={<OAuthSuccess />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="chat" element={<Chat />} />
        <Route path="search" element={<Search />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="posts/:postId" element={<PostDetail />} />
        <Route path="profile/:userId" element={<Profile />} />
        <Route path="profile/edit" element={<EditProfile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
