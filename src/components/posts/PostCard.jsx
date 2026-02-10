import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { FaHeart, FaRegHeart, FaComment, FaTrash } from 'react-icons/fa';
import { postAPI } from '../../utils/api';
import { likePost, unlikePost, deletePost as deletePostAction, addComment } from '../../redux/slices/postSlice';
import { selectCurrentUser } from '../../redux/slices/authSlice';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isLiked = post.likes?.includes(currentUser?._id);
  const isOwner = post.user?._id === currentUser?._id;

  const handleLike = async () => {
    try {
      if (isLiked) {
        await postAPI.unlikePost(post._id);
        dispatch(unlikePost({ postId: post._id, userId: currentUser._id }));
      } else {
        await postAPI.likePost(post._id);
        dispatch(likePost({ postId: post._id, userId: currentUser._id }));
      }
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await postAPI.deletePost(post._id);
      dispatch(deletePostAction(post._id));
      toast.success('Post deleted');
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await postAPI.addComment(post._id, { text: commentText });
      dispatch(addComment({ postId: post._id, comment: data }));
      setCommentText('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to={`/profile/${post.user?._id}`}
          className="flex items-center gap-3"
        >
          <img
            src={"/avatar.png"}
            alt={post.user?.name}
            className="w-11 h-11 rounded-full object-cover border"
          />
          <div>
            <div className="font-semibold text-gray-900">{post.user?.name}</div>
            <div className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>
        </Link>

        {isOwner && (
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
          >
            <FaTrash />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap mb-4">{post.content}</p>

        {post.image && (
          <div className="rounded-xl overflow-hidden mb-4">
            <img
              src={post.image}
              alt="Post"
              className="w-full max-h-[500px] object-cover"
            />
          </div>
        )}

        {post.codeSnippet?.code && (
          <div className="rounded-xl overflow-hidden mb-4 border border-gray-200">
            <div className="bg-gray-800 text-white px-4 py-2 text-xs uppercase font-semibold">
              {post.codeSnippet.language}
            </div>
            <pre className="p-4 bg-gray-900 overflow-x-auto text-sm text-gray-100 font-mono">
              <code>{post.codeSnippet.code}</code>
            </pre>
          </div>
        )}

        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-4 pb-3 mb-3 border-b text-sm text-gray-600">
        <span>{post.likes?.length || 0} likes</span>
        <span>{post.comments?.length || 0} comments</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pb-3 mb-3 border-b">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            isLiked
              ? "text-red-500 hover:bg-red-50"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          Like
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
        >
          <FaComment />
          Comment
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="space-y-4">
          <form onSubmit={handleComment} className="flex gap-3 items-center">
            <img
              src={currentUser?.profilePicture || "/avatar.png"}
              alt={currentUser?.name}
              className="w-9 h-9 rounded-full object-cover border"
            />

            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={!commentText.trim() || submitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Posting..." : "Post"}
            </button>
          </form>

          <div className="space-y-4">
            {post.comments?.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                <img
                  src={comment.user?.profilePicture || "/avatar.png"}
                  alt={comment.user?.name}
                  className="w-9 h-9 rounded-full object-cover border"
                />

                <div className="flex-1 bg-gray-50 rounded-xl p-3">
                  <div className="font-semibold text-sm text-gray-900 mb-1">
                    {comment.user?.name}
                  </div>
                  <div className="text-sm text-gray-800 mb-1">
                    {comment.text}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;