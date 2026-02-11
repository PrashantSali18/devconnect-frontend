import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { notificationAPI } from "../../utils/api";
import {
  setNotifications,
  markAsRead,
  markAllAsRead,
} from "../../redux/slices/notificationSlice";

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector(
    (state) => state.notifications,
  );

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationAPI.getNotifications();
      dispatch(setNotifications(data.notifications));
    } catch (error) {
      toast.error("Failed to load notifications");
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      dispatch(markAsRead(id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      dispatch(markAllAsRead());
      toast.success("All marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>

        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div className="divide-y">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notif) => (
            <Link
              key={notif._id}
              to={notif.link || "#"}
              onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
              className={`flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition relative ${
                !notif.isRead ? "bg-blue-50" : ""
              }`}
            >
              {/* Avatar */}
              <img
                src={
                  notif.sender?.profilePicture ||
                  "/avatar.png"
                }
                alt={notif.sender?.name}
                className="w-10 h-10 rounded-full object-cover border"
              />

              {/* Content */}
              <div className="flex-1">
                <p className="text-sm text-gray-800">{notif.message}</p>

                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notif.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {/* Unread Dot */}
              {!notif.isRead && (
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2"></span>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
