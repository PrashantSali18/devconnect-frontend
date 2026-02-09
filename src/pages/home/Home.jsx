import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import CreatePost from '../../components/posts/CreatePost';
import PostCard from '../../components/posts/PostCard';
import { postAPI } from '../../utils/api';
import { setFeed, setLoading } from '../../redux/slices/postSlice';

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
      dispatch(setFeed({ 
        posts: data.posts, 
        page: 1, 
        hasMore: data.currentPage < data.totalPages 
      }));
    } catch (error) {
      toast.error('Failed to load feed');
      console.error(error);
    }
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const { data } = await postAPI.getFeed(nextPage, 10);
      dispatch(setFeed({ 
        posts: data.posts, 
        page: nextPage, 
        hasMore: data.currentPage < data.totalPages 
      }));
    } catch (error) {
      toast.error('Failed to load more posts');
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
          <div className="text-center py-12 px-4">
            <div className="text-gray-500 mb-2">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">
              No posts yet. Follow some users to see their posts here!
            </p>
            <button 
              onClick={() => window.location.href = '/explore'}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
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
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : 'Load More'}
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