import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { userAPI } from '../../utils/api';
import { selectCurrentUser } from '../../redux/slices/authSlice';

const UserCard = ({ user }) => {
  const currentUser = useSelector(selectCurrentUser);
  const [following, setFollowing] = useState(user.followers?.includes(currentUser?._id));
  const [loading, setLoading] = useState(false);

  const isOwnProfile = currentUser?._id === user._id;

  const handleFollow = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (following) {
        await userAPI.unfollow(user._id);
        setFollowing(false);
      } else {
        await userAPI.follow(user._id);
        setFollowing(true);
      }
    } catch (error) {
      toast.error('Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <Link to={`/profile/${user._id}`} className="block">
        <div className="flex flex-col items-center text-center">
          <img
            src={user.profilePicture || 'https://via.placeholder.com/150'}
            alt={user.name}
            className="avatar-xl mb-3"
          />
          <h3 className="font-semibold text-base mb-1">{user.name}</h3>
          {user.bio && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{user.bio}</p>
          )}
          {user.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4 justify-center">
              {user.skills.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="badge badge-primary text-xs">
                  {skill}
                </span>
              ))}
              {user.skills.length > 3 && (
                <span className="badge text-xs">+{user.skills.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </Link>
      
      {!isOwnProfile && (
        <button
          onClick={handleFollow}
          disabled={loading}
          className={`w-full ${following ? 'btn-secondary' : 'btn-primary'} btn`}
        >
          {loading ? 'Loading...' : following ? 'Unfollow' : 'Follow'}
        </button>
      )}
    </div>
  );
};

export default UserCard;