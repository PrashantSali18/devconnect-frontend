// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import toast from "react-hot-toast";
// import { FaCamera } from "react-icons/fa";
// import { userAPI } from "../../utils/api";
// import { setUser, selectCurrentUser } from "../../redux/slices/authSlice";

// const EditProfile = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const user = useSelector(selectCurrentUser);
//   const [formData, setFormData] = useState({
//     name: "",
//     bio: "",
//     location: "",
//     githubUrl: "",
//     linkedinUrl: "",
//     websiteUrl: "",
//     skills: "",
//   });
//   const [profilePicture, setProfilePicture] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setFormData({
//         name: user.name || "",
//         bio: user.bio || "",
//         location: user.location || "",
//         githubUrl: user.githubUrl || "",
//         linkedinUrl: user.linkedinUrl || "",
//         websiteUrl: user.websiteUrl || "",
//         skills: user.skills?.join(", ") || "",
//       });
//       setPreview(user.profilePicture);
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setProfilePicture(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const { data } = await userAPI.updateProfile({
//         ...formData,
//         skills: formData.skills
//           .split(",")
//           .map((s) => s.trim())
//           .filter(Boolean),
//       });

//       if (profilePicture) {
//         const formData = new FormData();
//         formData.append("profilePicture", profilePicture);
//         await userAPI.uploadProfilePicture(formData);
//       }

//       dispatch(setUser(data));
//       toast.success("Profile updated successfully!");
//       navigate(`/profile/${user._id}`);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to update profile");
//     } finally {
//       setLoading(false);
//     }
//   };

// return (
//   <div className="max-w-2xl mx-auto px-4 py-8">
//     <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
//       <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Profile Picture */}
//         <div className="flex flex-col items-center gap-4">
//           <div className="relative">
//             <img
//               src={preview || user.profilePicture || "/avatar.png"}
//               alt="Preview"
//               className="w-32 h-32 rounded-full object-cover border"
//             />

//             <label className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition">
//               <FaCamera size={14} />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </label>
//           </div>

//           <p className="text-sm text-gray-600">
//             Click camera icon to change photo
//           </p>
//         </div>

//         {/* Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1.5">
//             Name
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//           />
//         </div>

//         {/* Bio */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1.5">
//             Bio
//           </label>
//           <textarea
//             name="bio"
//             value={formData.bio}
//             onChange={handleChange}
//             rows="4"
//             placeholder="Tell us about yourself..."
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//           />
//         </div>

//         {/* Skills */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1.5">
//             Skills (comma-separated)
//           </label>
//           <input
//             type="text"
//             name="skills"
//             value={formData.skills}
//             onChange={handleChange}
//             placeholder="React, Node.js, MongoDB"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//           />
//         </div>

//         {/* Location */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1.5">
//             Location
//           </label>
//           <input
//             type="text"
//             name="location"
//             value={formData.location}
//             onChange={handleChange}
//             placeholder="City, Country"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//           />
//         </div>

//         {/* GitHub */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1.5">
//             GitHub URL
//           </label>
//           <input
//             type="url"
//             name="githubUrl"
//             value={formData.githubUrl}
//             onChange={handleChange}
//             placeholder="https://github.com/username"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//           />
//         </div>

//         {/* LinkedIn */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1.5">
//             LinkedIn URL
//           </label>
//           <input
//             type="url"
//             name="linkedinUrl"
//             value={formData.linkedinUrl}
//             onChange={handleChange}
//             placeholder="https://linkedin.com/in/username"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//           />
//         </div>

//         {/* Website */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1.5">
//             Website URL
//           </label>
//           <input
//             type="url"
//             name="websiteUrl"
//             value={formData.websiteUrl}
//             onChange={handleChange}
//             placeholder="https://yourwebsite.com"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-4 pt-4">
//           <button
//             type="button"
//             onClick={() => navigate(`/profile/${user._id}`)}
//             className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             disabled={loading}
//             className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
//           >
//             {loading ? "Saving..." : "Save Changes"}
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// );
// };

// export default EditProfile;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa";
import { userAPI } from "../../utils/api";
import { setUser, selectCurrentUser } from "../../redux/slices/authSlice";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    githubUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
    skills: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        location: user.location || "",
        githubUrl: user.githubUrl || "",
        linkedinUrl: user.linkedinUrl || "",
        websiteUrl: user.websiteUrl || "",
        skills: user.skills?.join(", ") || "",
      });
      setPreview(user.profilePicture);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Update basic profile info
      const { data } = await userAPI.updateProfile({
        ...formData,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });

      // 2️⃣ Upload profile picture if a new file is selected
      if (profilePicture) {
        const uploadData = new FormData();
        uploadData.append("picture", profilePicture);

        await userAPI.uploadProfilePicture(uploadData);

        // Fetch updated user data to get new profile picture
        const { data: updatedUser } = await userAPI.getProfile(user._id);
        dispatch(setUser(updatedUser));
      } else {
        // Update Redux with profile info (without new picture)
        dispatch(setUser(data));
      }

      toast.success("Profile updated successfully!");
      navigate(`/profile/${user._id}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={preview || "/default-avatar.png"}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
              />
              <label
                htmlFor="profile-picture"
                className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition shadow-lg"
              >
                <FaCamera size={16} />
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-600">
              Click the camera icon to change your photo
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              placeholder="Your full name"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about yourself, your experience, and what you're passionate about..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Skills
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB, TypeScript, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate skills with commas
            </p>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          {/* Social Links Section */}
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-semibold mb-4">Social Links</h2>

            {/* GitHub */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            {/* LinkedIn */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Personal Website
              </label>
              <input
                type="url"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/profile/${user?._id}`)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
