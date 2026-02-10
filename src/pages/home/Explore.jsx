import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import PostCard from "../../components/posts/PostCard";
import { postAPI } from "../../utils/api";
import { setPosts, setLoading } from "../../redux/slices/postSlice";

const Explore = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      dispatch(setLoading(true));
      const { data } = await postAPI.getPosts(1, 10);
      dispatch(setPosts(data.posts));
      setHasMore(data.currentPage < data.totalPages);
    } catch (error) {
      toast.error("Failed to load posts");
    }
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const { data } = await postAPI.getPosts(nextPage, 10);
      dispatch(setPosts([...posts, ...data.posts]));
      setPage(nextPage);
      setHasMore(data.currentPage < data.totalPages);
    } catch (error) {
      toast.error("Failed to load more posts");
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore</h1>
          <p className="text-gray-600">
            Discover posts from the DevConnect community
          </p>
        </div>

        {/* Feed */}
        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No posts found</div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}

            {hasMore && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
