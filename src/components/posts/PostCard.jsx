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
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Link to={`/profile/${post.user?._id}`} className="flex items-center gap-3">
          <img 
            src={post.user?.profilePicture || 'https://via.placeholder.com/40'} 
            alt={post.user?.name}
            className="avatar"
          />
          <div>
            <div className="font-semibold text-gray-900">{post.user?.name}</div>
            <div className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </div>
          </div>
        </Link>

        {isOwner && (
          <button 
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            onClick={handleDelete}
            title="Delete post"
          >
            <FaTrash />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-900 whitespace-pre-wrap mb-4">{post.content}</p>

        {post.image && (
          <div className="rounded-lg overflow-hidden mb-4">
            <img src={post.image} alt="Post" className="w-full max-h-[500px] object-cover" />
          </div>
        )}

        {post.codeSnippet?.code && (
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            <div className="bg-gray-800 text-white px-4 py-2 text-xs font-medium uppercase">
              {post.codeSnippet.language}
            </div>
            <pre className="p-4 bg-gray-900 overflow-x-auto">
              <code className="text-gray-100 font-mono text-sm">{post.codeSnippet.code}</code>
            </pre>
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="badge badge-primary">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-4 pb-3 mb-3 border-b border-gray-200 text-sm text-gray-600">
        <span>{post.likes?.length || 0} likes</span>
        <span>{post.comments?.length || 0} comments</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pb-3 mb-3 border-b border-gray-200">
        <button 
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isLiked 
              ? 'text-red-500 hover:bg-red-50' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={handleLike}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          <span>Like</span>
        </button>
        <button 
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
          onClick={() => setShowComments(!showComments)}
        >
          <FaComment />
          <span>Comment</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="space-y-4">
          <form onSubmit={handleComment} className="flex gap-3 items-center">
            <img 
              src={currentUser?.profilePicture || 'https://via.placeholder.com/40'} 
              alt={currentUser?.name}
              className="avatar-sm"
            />
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="input flex-1"
            />
            <button 
              type="submit" 
              className="btn btn-primary btn-sm"
              disabled={!commentText.trim() || submitting}
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </form>

          <div className="space-y-4">
            {post.comments?.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                <img 
                  src={comment.user?.profilePicture || 'https://via.placeholder.com/40'} 
                  alt={comment.user?.name}
                  className="avatar-sm"
                />
                <div className="flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="font-semibold text-sm text-gray-900 mb-1">
                    {comment.user?.name}
                  </div>
                  <div className="text-sm text-gray-900 mb-1">{comment.text}</div>
                  <div className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
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