// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// const api = axios.create({
//   baseURL: `${API_URL}/api`,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   },
// );

// export const authAPI = {
//   register: (data) => api.post("/auth/register", data),
//   login: (data) => api.post("/auth/login", data),
//   getMe: () => api.get("/auth/me"),
//   forgotPassword: (data) => api.post("/auth/forgot-password", data),
//   resetPassword: (token, data) =>
//     api.put(`/auth/reset-password/${token}`, data),
//   verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
//   resendVerification: () => api.post("/auth/resend-verification"),
// };

// export const userAPI = {
//   getProfile: (id) => api.get(`/users/${id}`),
//   updateProfile: (data) => api.put("/users/profile", data),
//   uploadProfilePicture: (formData) =>
//     api.post("/users/profile/picture", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     }),
//   follow: (id) => api.put(`/users/${id}/follow`),
//   unfollow: (id) => api.put(`/users/${id}/unfollow`),
//   searchUsers: (query) => api.get(`/users/search?q=${query}`),
//   getSuggestions: () => api.get("/users/suggestions/users"),
//   // Add this if you need to get user by username
//   getUserByUsername: (username) => api.get(`/users/username/${username}`),
// };

// export const postAPI = {
//   // Existing methods
//   getPosts: (page = 1, limit = 10) =>
//     api.get(`/posts?page=${page}&limit=${limit}`),
//   getFeed: (page = 1, limit = 10) =>
//     api.get(`/posts/feed/personalized?page=${page}&limit=${limit}`),
//   getPost: (id) => api.get(`/posts/${id}`),
//   createPost: (formData) =>
//     api.post("/posts", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     }),
//   updatePost: (id, data) => api.put(`/posts/${id}`, data),
//   deletePost: (id) => api.delete(`/posts/${id}`),
//   likePost: (id) => api.put(`/posts/${id}/like`),
//   unlikePost: (id) => api.put(`/posts/${id}/unlike`),
//   addComment: (id, data) => api.post(`/posts/${id}/comments`, data),
//   deleteComment: (postId, commentId) =>
//     api.delete(`/posts/${postId}/comments/${commentId}`),

//   // ADD THESE NEW METHODS:
//   getUserPosts: (userId) => api.get(`/posts/user/${userId}`), // Get posts by specific user
//   getUserPostsPaginated: (userId, page = 1, limit = 10) =>
//     api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`),
// };

// export const notificationAPI = {
//   getNotifications: () => api.get("/notifications"),
//   getUnreadCount: () => api.get("/notifications/unread/count"),
//   markAsRead: (id) => api.put(`/notifications/${id}/read`),
//   markAllAsRead: () => api.put("/notifications/read-all"),
// };

// export const messageAPI = {
//   getConversations: () => api.get("/messages/conversations"),
//   getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
//   sendMessage: (data) => api.post("/messages", data),
//   deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
//   markAsRead: (userId) => api.put(`/messages/read/${userId}`),
// };

// export default api;

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Only set Content-Type to JSON if not FormData
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  resetPassword: (token, data) =>
    api.put(`/auth/reset-password/${token}`, data),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  resendVerification: () => api.post("/auth/resend-verification"),
};

export const userAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put("/users/profile", data),
  uploadProfilePicture: (data) => api.put("/users/profile/picture", data), // FormData will be auto-detected
  follow: (id) => api.put(`/users/${id}/follow`),
  unfollow: (id) => api.put(`/users/${id}/unfollow`),
  searchUsers: (query) => api.get(`/users/search?q=${query}`),
  getSuggestions: () => api.get("/users/suggestions/users"),
  getUserByUsername: (username) => api.get(`/users/username/${username}`),
};

export const postAPI = {
  getPosts: (page = 1, limit = 10) =>
    api.get(`/posts?page=${page}&limit=${limit}`),
  getFeed: (page = 1, limit = 10) =>
    api.get(`/posts/feed/personalized?page=${page}&limit=${limit}`),
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (formData) => api.post("/posts", formData), // FormData will be auto-detected
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.put(`/posts/${id}/like`),
  unlikePost: (id) => api.put(`/posts/${id}/unlike`),
  addComment: (id, data) => api.post(`/posts/${id}/comments`, data),
  deleteComment: (postId, commentId) =>
    api.delete(`/posts/${postId}/comments/${commentId}`),
  getUserPosts: (userId) => api.get(`/posts/user/${userId}`),
  getUserPostsPaginated: (userId, page = 1, limit = 10) =>
    api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`),
};

export const notificationAPI = {
  getNotifications: () => api.get("/notifications"),
  getUnreadCount: () => api.get("/notifications/unread/count"),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
};

export const messageAPI = {
  getConversations: () => api.get("/messages/conversations"),
  getConversation: (userId) => api.get(`/messages/conversation/${userId}`),
  sendMessage: (data) => api.post("/messages", data),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
  markAsRead: (userId) => api.put(`/messages/read/${userId}`),
};

export default api;