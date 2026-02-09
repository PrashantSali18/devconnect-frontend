import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FaGithub, FaLinkedin, FaGlobe, FaMapMarkerAlt, FaCog } from 'react-icons/fa';
import { userAPI, postAPI } from '../../utils/api';
import { selectCurrentUser } from '../../redux/slices/authSlice';
import PostCard from '../../components/posts/PostCard';

const Profile = () => {
  const { userId } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = currentUser?._id === userId;

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const { data } = await userAPI.getProfile(userId);
      setUser(data);
      setFollowing(data.followers?.includes(currentUser?._id));
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const { data } = await postAPI.getUserPosts(userId);
      setPosts(data.posts);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      if (following) {
        await userAPI.unfollow(userId);
        setFollowing(false);
        setUser({ ...user, followers: user.followers.filter(id => id !== currentUser._id) });
      } else {
        await userAPI.follow(userId);
        setFollowing(true);
        setUser({ ...user, followers: [...user.followers, currentUser._id] });
      }
    } catch (error) {
      toast.error('Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="spinner w-10 h-10"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="card mb-6">
        {/* Cover */}
        <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg -m-6 mb-0"></div>

        {/* Profile Info */}
        <div className="flex flex-col sm:flex-row gap-6 mt-[-60px] relative z-10 px-6">
          <img 
            src={user?.profilePicture} 
            alt={user?.name} 
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
          
          <div className="flex-1 pt-16 sm:pt-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-600 mt-1">{user?.bio || 'No bio yet'}</p>
                {user?.location && (
                  <div className="flex items-center gap-2 text-gray-600 mt-2">
                    <FaMapMarkerAlt className="text-sm" />
                    <span className="text-sm">{user.location}</span>
                  </div>
                )}
              </div>

              {isOwnProfile ? (
                <Link to="/profile/edit" className="btn btn-outline">
                  <FaCog />
                  Edit Profile
                </Link>
              ) : (
                <button 
                  className={`btn ${following ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={handleFollow}
                  disabled={followLoading}
                >
                  {followLoading ? 'Loading...' : following ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-4 text-sm">
              <div>
                <span className="font-semibold text-gray-900">{posts.length}</span>
                <span className="text-gray-600 ml-1">Posts</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">{user?.followers?.length || 0}</span>
                <span className="text-gray-600 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900">{user?.following?.length || 0}</span>
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
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <FaGithub size={20} />
                  </a>
                )}
                {user?.linkedinUrl && (
                  <a 
                    href={user.linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <FaLinkedin size={20} />
                  </a>
                )}
                {user?.websiteUrl && (
                  <a 
                    href={user.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
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
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, idx) => (
                <span key={idx} className="badge badge-primary">{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-xl font-bold mb-4">Posts</h2>
        {posts.length === 0 ? (
          <div className="card text-center py-12 text-gray-500">
            No posts yet
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;