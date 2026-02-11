import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaImage, FaCode, FaTimes } from "react-icons/fa";
import { postAPI } from "../../utils/api";
import { addPost } from "../../redux/slices/postSlice";
import { selectCurrentUser } from "../../redux/slices/authSlice";

const CreatePost = ({ onPostCreated }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size must be less than 10MB");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !image) {
      toast.error("Please add some content or an image");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("image", image);
      if (code) {
        formData.append("code", code);
        formData.append("language", language);
      }

      const { data } = await postAPI.createPost(formData);
      dispatch(addPost(data));
      toast.success("Post created successfully!");

      setContent("");
      setImage(null);
      setImagePreview(null);
      setCode("");
      setShowCodeInput(false);

      if (onPostCreated) onPostCreated();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
      {/* Top Section */}
      <div className="flex gap-4 mb-4">
        <img
          src={user?.profilePicture || "/avatar.png"}
          alt={user?.name}
          className="w-12 h-12 rounded-full object-cover border border-gray-200"
        />

        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="3"
          className="flex-1 resize-none bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 text-sm"
        />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="relative mb-4 rounded-xl overflow-hidden">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full max-h-96 object-cover"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-black/60 hover:bg-black/80 text-white rounded-full transition"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Code Section */}
      {showCodeInput && (
        <div className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex gap-3 p-3 bg-gray-50 border-b border-gray-200">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="typescript">TypeScript</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setShowCodeInput(false);
                setCode("");
              }}
              className="text-sm px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            >
              Remove
            </button>
          </div>

          <textarea
            placeholder="Paste your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows="8"
            className="w-full p-4 font-mono text-sm bg-gray-50 resize-none focus:outline-none"
          />
        </div>
      )}

      {/* Bottom Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex gap-3">
          <label className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition">
            <FaImage className="text-green-500" />
            <span>Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => setShowCodeInput(!showCodeInput)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <FaCode className="text-blue-500" />
            <span>Code</span>
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || (!content.trim() && !image)}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
