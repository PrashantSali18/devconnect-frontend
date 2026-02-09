import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FaCamera } from 'react-icons/fa';
import { userAPI } from '../../utils/api';
import { setUser, selectCurrentUser } from '../../redux/slices/authSlice';

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    githubUrl: '',
    linkedinUrl: '',
    websiteUrl: '',
    skills: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        githubUrl: user.githubUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        websiteUrl: user.websiteUrl || '',
        skills: user.skills?.join(', ') || '',
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
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await userAPI.updateProfile({
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      });

      if (profilePicture) {
        const formData = new FormData();
        formData.append('profilePicture', profilePicture);
        await userAPI.uploadProfilePicture(formData);
      }

      dispatch(setUser(data));
      toast.success('Profile updated successfully!');
      navigate(`/profile/${user._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img 
                src={preview || 'https://via.placeholder.com/150'} 
                alt="Preview" 
                className="w-32 h-32 rounded-full object-cover"
              />
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors">
                <FaCamera />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="hidden" 
                />
              </label>
            </div>
            <p className="text-sm text-gray-600">Click camera icon to change photo</p>
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="input" 
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
            <textarea 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              className="input" 
              rows="4"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Skills (comma-separated)
            </label>
            <input 
              type="text" 
              name="skills" 
              value={formData.skills} 
              onChange={handleChange} 
              className="input" 
              placeholder="React, Node.js, MongoDB" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
            <input 
              type="text" 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              className="input" 
              placeholder="City, Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">GitHub URL</label>
            <input 
              type="url" 
              name="githubUrl" 
              value={formData.githubUrl} 
              onChange={handleChange} 
              className="input" 
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn URL</label>
            <input 
              type="url" 
              name="linkedinUrl" 
              value={formData.linkedinUrl} 
              onChange={handleChange} 
              className="input" 
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Website URL</label>
            <input 
              type="url" 
              name="websiteUrl" 
              value={formData.websiteUrl} 
              onChange={handleChange} 
              className="input" 
              placeholder="https://yourwebsite.com"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              className="btn btn-secondary flex-1"
              onClick={() => navigate(`/profile/${user._id}`)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;