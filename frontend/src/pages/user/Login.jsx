import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogin } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await handleLogin(form.email, form.password);
    if (success) {
      const redirect = location.state?.from || '/';
      navigate(redirect);
    } else {
      toast.error('Sai email hoặc mật khẩu');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h1>
        <input type="email" required placeholder="Email" value={form.email}
          onChange={e => setForm({...form, email: e.target.value})}
          className="w-full border rounded px-3 py-2 mb-3" />
        <input type="password" required placeholder="Mật khẩu" value={form.password}
          onChange={e => setForm({...form, password: e.target.value})}
          className="w-full border rounded px-3 py-2 mb-4" />
        <div className="flex justify-between items-center mb-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" /> Ghi nhớ</label>
          <Link to="/forgot-password" className="text-primary-600">Quên mật khẩu?</Link>
        </div>
        <button disabled={loading}
          className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700 disabled:opacity-50">
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
        <p className="text-center mt-4 text-sm">
          Chưa có tài khoản? <Link to="/register" className="text-primary-600 font-medium">Đăng ký ngay</Link>
        </p>
      </form>
    </div>
  );
}
