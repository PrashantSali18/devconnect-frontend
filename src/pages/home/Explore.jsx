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
      <div className="home-container">
        <div className="loading-container">
          <div
            className="spinner"
            style={{ width: "40px", height: "40px" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="page-header">
        <h1>Explore</h1>
        <p>Discover posts from the DevConnect community</p>
      </div>

      <div className="posts-feed">
        {posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts found</p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}

            {hasMore && (
              <div className="load-more-container">
                <button
                  className="btn btn-outline"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;
