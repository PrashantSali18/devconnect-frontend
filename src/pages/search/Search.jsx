import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaSearch } from 'react-icons/fa';
import { userAPI, postAPI } from '../../utils/api';
import UserCard from '../../components/common/UserCard';
import PostCard from '../../components/posts/PostCard';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, [searchParams]);

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const [usersRes, postsRes] = await Promise.all([
        userAPI.searchUsers(query),
        postAPI.searchPosts(query),
      ]);

      setUsers(usersRes.data);
      setPosts(postsRes.data);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    }
  };

  return (
    <div className="search-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users, posts..."
            className="input search-input"
          />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      <div className="search-tabs">
        <button
          className={`search-tab ${activeTab === 'users' ? 'search-tab-active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
        <button
          className={`search-tab ${activeTab === 'posts' ? 'search-tab-active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Posts ({posts.length})
        </button>
      </div>

      <div className="search-results">
        {loading ? (
          <div className="loading-container">
            <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
          </div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="users-grid">
                {users.length === 0 ? (
                  <div className="empty-state">No users found</div>
                ) : (
                  users.map((user) => <UserCard key={user._id} user={user} />)
                )}
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="posts-feed">
                {posts.length === 0 ? (
                  <div className="empty-state">No posts found</div>
                ) : (
                  posts.map((post) => <PostCard key={post._id} post={post} />)
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;