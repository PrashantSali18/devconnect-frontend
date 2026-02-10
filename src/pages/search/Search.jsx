import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { userAPI, postAPI } from "../../utils/api";
import UserCard from "../../components/common/UserCard";
import PostCard from "../../components/posts/PostCard";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const query = searchParams.get("q");
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
      toast.error("Search failed");
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Search Form */}
      <form
        className="flex flex-col sm:flex-row gap-4 mb-6"
        onSubmit={handleSubmit}
      >
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users, posts..."
            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "users"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("users")}
        >
          Users ({users.length})
        </button>

        <button
          className={`ml-6 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "posts"
              ? "border-b-2 border-indigo-600 text-indigo-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("posts")}
        >
          Posts ({posts.length})
        </button>
      </div>

      {/* Results */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === "users" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {users.length === 0 ? (
                  <div className="col-span-full text-center text-gray-500 py-10">
                    No users found
                  </div>
                ) : (
                  users.map((user) => <UserCard key={user._id} user={user} />)
                )}
              </div>
            )}

            {activeTab === "posts" && (
              <div className="space-y-6">
                {posts.length === 0 ? (
                  <div className="text-center text-gray-500 py-10">
                    No posts found
                  </div>
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
