import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { notificationAPI } from '../../utils/api';
import { setNotifications, markAsRead, markAllAsRead } from '../../redux/slices/notificationSlice';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationAPI.getNotifications();
      dispatch(setNotifications(data.notifications));
    } catch (error) {
      toast.error('Failed to load notifications');
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
      toast.success('All marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notifications</h1>
        {notifications.length > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={handleMarkAllAsRead}>Mark all as read</button>
        )}
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">No notifications</div>
        ) : (
          notifications.map((notif) => (
            <Link
              key={notif._id}
              to={notif.link || '#'}
              className={`notification-item ${!notif.isRead ? 'notification-unread' : ''}`}
              onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
            >
              <img src={notif.sender?.profilePicture} alt={notif.sender?.name} className="avatar avatar-sm" />
              <div className="notification-content">
                <p>{notif.message}</p>
                <span className="notification-time">
                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                </span>
              </div>
              {!notif.isRead && <div className="notification-dot"></div>}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;