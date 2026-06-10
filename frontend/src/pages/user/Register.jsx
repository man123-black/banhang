import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }
    setLoading(true);
    const success = await handleRegister({ name: form.name, email: form.email, password: form.password });
    if (success) navigate('/');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Đăng ký tài khoản</h1>
        <input required placeholder="Họ tên" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded px-3 py-2 mb-3" />
        <input type="email" required placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border rounded px-3 py-2 mb-3" />
        <input type="password" required minLength={6} placeholder="Mật khẩu" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full border rounded px-3 py-2 mb-3" />
        <input type="password" required placeholder="Xác nhận mật khẩu" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} className="w-full border rounded px-3 py-2 mb-4" />
        <button disabled={loading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50">
          {loading ? 'Đang xử lý...' : 'Đăng ký'}
        </button>
        <p className="text-center mt-4 text-sm">
          Đã có tài khoản? <Link to="/login" className="text-primary-600 font-medium">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}
