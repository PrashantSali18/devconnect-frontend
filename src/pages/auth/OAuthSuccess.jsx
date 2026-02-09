import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { setCredentials } from '../../redux/slices/authSlice';
import { authAPI } from '../../utils/api';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('OAuth authentication failed');
      navigate('/login');
      return;
    }

    if (token) {
      localStorage.setItem('token', token);
      
      // Fetch user data
      const fetchUser = async () => {
        try {
          const { data } = await authAPI.getMe();
          dispatch(setCredentials({ user: data, token }));
          toast.success('Welcome to DevConnect!');
          navigate('/');
        } catch (err) {
          toast.error('Failed to fetch user data');
          navigate('/login');
        }
      };

      fetchUser();
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1rem' }}></div>
        <p>Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthSuccess;