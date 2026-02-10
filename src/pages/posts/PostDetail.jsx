import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import { postAPI } from "../../utils/api";
import PostCard from "../../components/posts/PostCard";

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const { data } = await postAPI.getPost(postId);
      setPost(data);
    } catch (error) {
      toast.error("Post not found");
      navigate("/");
    } finally {
      setLoading(false);
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
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
      >
        <FaArrowLeft />
        Back
      </button>

      {post && <PostCard post={post} />}
    </div>
  );
};

export default PostDetail;
