import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { authAPI } from "../../utils/api";
import { logout, selectCurrentUser } from "../../redux/slices/authSlice";

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const [activeTab, setActiveTab] = useState("password");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // You'll need to add this endpoint to your backend
      // For now, this is a placeholder
      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    const confirmation = window.prompt(
      'Type "DELETE" to confirm account deletion:',
    );
    if (confirmation !== "DELETE") {
      toast.error("Account deletion cancelled");
      return;
    }

    try {
      // Add delete account endpoint
      toast.success("Account deleted");
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {[
              { key: "password", label: "Change Password" },
              { key: "notifications", label: "Notifications" },
              { key: "privacy", label: "Privacy" },
              { key: "danger", label: "Danger Zone" },
            ].map((tab, index) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? tab.key === "danger"
                      ? "bg-red-600 text-white"
                      : "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-50"
                } ${index === 0 ? "rounded-t-xl" : ""} ${
                  index === 3 ? "rounded-b-xl" : ""
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            {/* PASSWORD TAB */}
            {activeTab === "password" && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Change Password</h2>

                <form onSubmit={handlePasswordChange} className="space-y-5">
                  {["current", "new", "confirm"].map((field, i) => {
                    const labels = [
                      "Current Password",
                      "New Password",
                      "Confirm New Password",
                    ];

                    const values = [
                      passwordData.currentPassword,
                      passwordData.newPassword,
                      passwordData.confirmPassword,
                    ];

                    return (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          {labels[i]}
                        </label>

                        <div className="relative">
                          <input
                            type={showPasswords[field] ? "text" : "password"}
                            value={values[i]}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                [field === "current"
                                  ? "currentPassword"
                                  : field === "new"
                                    ? "newPassword"
                                    : "confirmPassword"]: e.target.value,
                              })
                            }
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            required
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPasswords({
                                ...showPasswords,
                                [field]: !showPasswords[field],
                              })
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords[field] ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <div>
                <h2 className="text-lg font-semibold mb-6">
                  Notification Preferences
                </h2>

                <div className="space-y-4">
                  {[
                    "Email Notifications",
                    "Like Notifications",
                    "Comment Notifications",
                    "Follow Notifications",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div>
                        <div className="font-medium">{item}</div>
                        <div className="text-sm text-gray-500">
                          Manage your {item.toLowerCase()}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 accent-indigo-600"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* PRIVACY TAB */}
            {activeTab === "privacy" && (
              <div>
                <h2 className="text-lg font-semibold mb-6">Privacy Settings</h2>

                <div className="space-y-4">
                  {[
                    "Private Profile",
                    "Show Online Status",
                    "Allow Messages",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div>
                        <div className="font-medium">{item}</div>
                        <div className="text-sm text-gray-500">
                          Control your {item.toLowerCase()}
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 accent-indigo-600"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* DANGER TAB */}
            {activeTab === "danger" && (
              <div>
                <h2 className="text-lg font-semibold text-red-600 mb-6">
                  Danger Zone
                </h2>

                <div className="border border-red-300 bg-red-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Delete Account</h3>

                  <p className="text-sm text-gray-600 mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>

                  <button
                    onClick={handleDeleteAccount}
                    className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
