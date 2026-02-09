import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  feed: [],
  currentPost: null,
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.loading = false;
    },
    setFeed: (state, action) => {
      if (action.payload.page === 1) {
        state.feed = action.payload.posts;
      } else {
        state.feed = [...state.feed, ...action.payload.posts];
      }
      state.page = action.payload.page;
      state.hasMore = action.payload.hasMore;
      state.loading = false;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
      state.feed.unshift(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
      const feedIndex = state.feed.findIndex(p => p._id === action.payload._id);
      if (feedIndex !== -1) {
        state.feed[feedIndex] = action.payload;
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(p => p._id !== action.payload);
      state.feed = state.feed.filter(p => p._id !== action.payload);
    },
    likePost: (state, action) => {
      const { postId, userId } = action.payload;
      const updateLike = (post) => {
        if (post._id === postId && !post.likes.includes(userId)) {
          post.likes.push(userId);
        }
      };
      state.posts.forEach(updateLike);
      state.feed.forEach(updateLike);
    },
    unlikePost: (state, action) => {
      const { postId, userId } = action.payload;
      const updateUnlike = (post) => {
        if (post._id === postId) {
          post.likes = post.likes.filter(id => id !== userId);
        }
      };
      state.posts.forEach(updateUnlike);
      state.feed.forEach(updateUnlike);
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const addCommentToPost = (post) => {
        if (post._id === postId) {
          post.comments.push(comment);
        }
      };
      state.posts.forEach(addCommentToPost);
      state.feed.forEach(addCommentToPost);
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setPosts,
  setFeed,
  addPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  setCurrentPost,
  setLoading,
  setError,
  clearError,
} = postSlice.actions;

export default postSlice.reducer;