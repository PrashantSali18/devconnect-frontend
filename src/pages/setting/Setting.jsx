import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { authAPI } from '../../utils/api';
import { logout, selectCurrentUser } from '../../redux/slices/authSlice';

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  
  const [activeTab, setActiveTab] = useState('password');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // You'll need to add this endpoint to your backend
      // For now, this is a placeholder
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    const confirmation = window.prompt('Type "DELETE" to confirm account deletion:');
    if (confirmation !== 'DELETE') {
      toast.error('Account deletion cancelled');
      return;
    }

    try {
      // Add delete account endpoint
      toast.success('Account deleted');
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="card p-0">
            <button
              onClick={() => setActiveTab('password')}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'password'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              } rounded-t-lg`}
            >
              Change Password
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'privacy'
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Privacy
            </button>
            <button
              onClick={() => setActiveTab('danger')}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'danger'
                  ? 'bg-danger text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              } rounded-b-lg`}
            >
              Danger Zone
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <div className="card">
            {activeTab === 'password' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        className="input pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        className="input pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        className="input pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-600">Receive email updates</div>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-primary rounded" defaultChecked />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div>
                      <div className="font-medium">Like Notifications</div>
                      <div className="text-sm text-gray-600">When someone likes your post</div>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-primary rounded" defaultChecked />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div>
                      <div className="font-medium">Comment Notifications</div>
                      <div className="text-sm text-gray-600">When someone comments on your post</div>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-primary rounded" defaultChecked />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div>
                      <div className="font-medium">Follow Notifications</div>
                      <div className="text-sm text-gray-600">When someone follows you</div>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-primary rounded" defaultChecked />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Privacy Settings</h2>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div>
                      <div className="font-medium">Private Profile</div>
                      <div className="text-sm text-gray-600">Only followers can see your posts</div>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-primary rounded" />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div>
                      <div className="font-medium">Show Online Status</div>
                      <div className="text-sm text-gray-600">Let others see when you're online</div>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-primary rounded" defaultChecked />
                  </label>

                  <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div>
                      <div className="font-medium">Allow Messages</div>
                      <div className="text-sm text-gray-600">Anyone can send you messages</div>
                    </div>
                    <input type="checkbox" className="w-5 h-5 text-primary rounded" defaultChecked />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'danger' && (
              <div>
                <h2 className="text-lg font-semibold text-danger mb-4">Danger Zone</h2>
                <div className="border border-danger rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Delete Account</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="btn btn-danger"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;