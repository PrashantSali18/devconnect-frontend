import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import CreatePost from "../../components/posts/CreatePost";
import PostCard from "../../components/posts/PostCard";
import { postAPI } from "../../utils/api";
import { setFeed, setLoading } from "../../redux/slices/postSlice";
import { FiMessageCircle } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";

const Home = () => {
  const dispatch = useDispatch();
  const { feed, loading, hasMore, page } = useSelector((state) => state.posts);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      dispatch(setLoading(true));
      const { data } = await postAPI.getFeed(1, 10);
      dispatch(
        setFeed({
          posts: data.posts,
          page: 1,
          hasMore: data.currentPage < data.totalPages,
        }),
      );
    } catch (error) {
      toast.error("Failed to load feed");
      console.error(error);
    }
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const { data } = await postAPI.getFeed(nextPage, 10);
      dispatch(
        setFeed({
          posts: data.posts,
          page: nextPage,
          hasMore: data.currentPage < data.totalPages,
        }),
      );
    } catch (error) {
      toast.error("Failed to load more posts");
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading && feed.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <CreatePost onPostCreated={fetchFeed} />
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <CreatePost onPostCreated={fetchFeed} />

      <div className="space-y-6 mt-6">
        {feed.length === 0 ? (
          <div className="text-center py-14 px-4">
            <FiMessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />

            <p className="text-gray-600 mb-6">
              No posts yet. Follow some users to see their posts here!
            </p>

            <button
              onClick={() => (window.location.href = "/explore")}
              className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
            >
              Explore Users
            </button>
          </div>
        ) : (
          <>
            {feed.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}

            {hasMore && (
              <div className="flex justify-center py-4">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <FaSpinner className="animate-spin text-indigo-600" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
