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
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <Link to={`/profile/${user._id}`} className="block">
        <div className="flex flex-col items-center text-center">
          <img
            src={user.profilePicture || "/avatar.png"}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border mb-4"
          />

          <h3 className="font-semibold text-base text-gray-900 mb-1">
            {user.name}
          </h3>

          {user.bio && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {user.bio}
            </p>
          )}

          {user.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {user.skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full"
                >
                  {skill}
                </span>
              ))}

              {user.skills.length > 3 && (
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  +{user.skills.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      {!isOwnProfile && (
        <button
          onClick={handleFollow}
          disabled={loading}
          className={`w-full py-2 rounded-lg font-medium transition ${
            following
              ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? "Loading..." : following ? "Unfollow" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default UserCard;