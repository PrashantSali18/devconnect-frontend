import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaMapMarkerAlt,
  FaCog,
} from "react-icons/fa";
import { userAPI, postAPI } from "../../utils/api.js";
import { selectCurrentUser } from "../../redux/slices/authSlice";
import PostCard from "../../components/posts/PostCard";

const Profile = () => {
  const { userId } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);

  const isOwnProfile = currentUser?._id === userId;

  useEffect(() => {
    if (userId) {
      fetchUserData();
      fetchUserPosts();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data } = await userAPI.getProfile(userId);
      setUser(data);
      // Check if current user is following this user
      if (currentUser && data.followers) {
        const isFollowing = data.followers.some((follower) =>
          typeof follower === "object"
            ? follower._id === currentUser._id
            : follower === currentUser._id,
        );
        // setFollowing(isFollowing); // If you have following state
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setPostsLoading(true);
      // Use the correct method name
      const { data } = await postAPI.getUserPosts(userId);
      // The response structure might vary - adjust based on your backend
      setPosts(data.posts || data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load user posts");
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      toast.error("Please login to follow users");
      return;
    }

    setFollowLoading(true);
    try {
      if (
        user?.followers?.some((follower) =>
          typeof follower === "object"
            ? follower._id === currentUser._id
            : follower === currentUser._id,
        )
      ) {
        // Unfollow
        await userAPI.unfollow(userId);
        setUser((prev) => ({
          ...prev,
          followers: prev.followers.filter((follower) =>
            typeof follower === "object"
              ? follower._id !== currentUser._id
              : follower !== currentUser._id,
          ),
        }));
        toast.success("Unfollowed successfully");
      } else {
        // Follow
        await userAPI.follow(userId);
        setUser((prev) => ({
          ...prev,
          followers: [...prev.followers, currentUser._id],
        }));
        toast.success("Followed successfully");
      }
    } catch (error) {
      console.error("Follow error:", error);
      toast.error("Failed to update follow status");
    } finally {
      setFollowLoading(false);
    }
  };

  // Check if current user is following this user
  const isFollowing = user?.followers?.some(
    (follower) =>
      currentUser &&
      (typeof follower === "object"
        ? follower._id === currentUser._id
        : follower === currentUser._id),
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="spinner w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white border border-gray-200 shadow-md rounded-xl text-center p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            User not found
          </h2>

          <p className="text-gray-600 mb-6">
            The user you're looking for doesn't exist.
          </p>

          <Link
            to="/"
            className="inline-block px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white shadow-md rounded-xl mb-6 overflow-hidden border border-gray-200">
        {/* Cover */}
        <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

        {/* Profile Info */}
        <div className="flex flex-col sm:flex-row gap-6 px-6 pb-6 relative -mt-16">
          <img
            src={user?.profilePicture || "/avatar.png"}
            alt={user?.name}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-white"
            onError={(e) => {
              e.target.src = user.profilePicture || "/avatar.png";
            }}
          />

          <div className="flex-1 pt-4 sm:pt-16">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.name}
                </h1>

                <p className="text-gray-600 mt-1">
                  {user?.bio || "No bio yet"}
                </p>

                {user?.location && (
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <FaMapMarkerAlt className="text-sm" />
                    <span className="text-sm">{user.location}</span>
                  </div>
                )}
              </div>

              {isOwnProfile ? (
                <Link
                  to="/profile/edit"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition"
                >
                  <FaCog className="mr-2" />
                  Edit Profile
                </Link>
              ) : (
                <button
                  onClick={handleFollow}
                  disabled={followLoading || !currentUser}
                  className={`px-4 py-2 rounded-lg font-medium text-white transition disabled:opacity-50 ${
                    isFollowing
                      ? "bg-gray-500 hover:bg-gray-600"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {followLoading
                    ? "Loading..."
                    : isFollowing
                      ? "Unfollow"
                      : "Follow"}
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-4 text-sm">
              <div>
                <span className="font-semibold text-gray-900">
                  {posts.length}
                </span>
                <span className="text-gray-600 ml-1">Posts</span>
              </div>

              <div>
                <span className="font-semibold text-gray-900">
                  {Array.isArray(user?.followers) ? user.followers.length : 0}
                </span>
                <span className="text-gray-600 ml-1">Followers</span>
              </div>

              <div>
                <span className="font-semibold text-gray-900">
                  {Array.isArray(user?.following) ? user.following.length : 0}
                </span>
                <span className="text-gray-600 ml-1">Following</span>
              </div>
            </div>

            {/* Social Links */}
            {(user?.githubUrl || user?.linkedinUrl || user?.websiteUrl) && (
              <div className="flex gap-4">
                {user?.githubUrl && (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition"
                  >
                    <FaGithub size={20} />
                  </a>
                )}

                {user?.linkedinUrl && (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
                    <FaLinkedin size={20} />
                  </a>
                )}

                {user?.websiteUrl && (
                  <a
                    href={user.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-indigo-600 transition"
                  >
                    <FaGlobe size={20} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {user?.skills?.length > 0 && (
          <div className="px-6 pb-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-3 mt-4">Skills</h3>

            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-xl font-bold mb-4">Posts</h2>

        {postsLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white shadow-md rounded-xl p-8 text-center text-gray-500 border border-gray-200">
            {isOwnProfile
              ? "You haven't created any posts yet"
              : "No posts yet"}
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
