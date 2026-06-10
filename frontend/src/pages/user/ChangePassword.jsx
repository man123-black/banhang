import { useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function ChangePassword() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirm: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    try {
      await API.put('/auth/change-password', { oldPassword: form.oldPassword, newPassword: form.newPassword });
      toast.success('Đổi mật khẩu thành công');
      setForm({ oldPassword: '', newPassword: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi'); }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Đổi mật khẩu</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
        <input type="password" placeholder="Mật khẩu cũ" required value={form.oldPassword}
          onChange={e => setForm({...form, oldPassword: e.target.value})} className="w-full border rounded px-3 py-2 mb-3" />
        <input type="password" placeholder="Mật khẩu mới" required minLength={6} value={form.newPassword}
          onChange={e => setForm({...form, newPassword: e.target.value})} className="w-full border rounded px-3 py-2 mb-3" />
        <input type="password" placeholder="Xác nhận mật khẩu mới" required value={form.confirm}
          onChange={e => setForm({...form, confirm: e.target.value})} className="w-full border rounded px-3 py-2 mb-3" />
        <button className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700">
          Cập nhật
        </button>
        <Link to="/profile" className="block text-center mt-3 text-sm text-gray-500">← Quay lại</Link>
      </form>
    </div>
  );
}
