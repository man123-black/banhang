import { useAuthStore } from '../store/authStore';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { user, login, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      login(data.user, data.token);
      toast.success('Đăng nhập thành công!');
      navigate(data.user.isAdmin ? '/admin' : '/');
      return true;
    } catch (err) { return false; }
  };

  const handleRegister = async (form) => {
    try {
      const { data } = await API.post('/auth/register', form);
      login(data.user, data.token);
      toast.success('Đăng ký thành công!');
      navigate('/');
      return true;
    } catch (err) { return false; }
  };

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất');
    navigate('/');
  };

  return { user, login, logout, updateUser, handleLogin, handleRegister, handleLogout };
};
