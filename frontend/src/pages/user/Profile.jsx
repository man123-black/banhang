import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', address: { street: '', city: '', district: '', ward: '' } });

  useEffect(() => {
    API.get('/auth/profile').then(r => {
      setForm({
        name: r.data.name || '',
        phone: r.data.phone || '',
        address: r.data.address || { street: '', city: '', district: '', ward: '' }
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put('/auth/profile', form);
      updateUser(data);
      toast.success('Cập nhật thành công');
    } catch { toast.error('Lỗi cập nhật'); }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Tài khoản của tôi</h1>

      <div className="flex gap-2 mb-4 border-b">
        <Link to="/profile" className="px-4 py-2 border-b-2 border-primary-600 font-medium">Thông tin</Link>
        <Link to="/change-password" className="px-4 py-2 text-gray-500">Đổi mật khẩu</Link>
        <Link to="/addresses" className="px-4 py-2 text-gray-500">Sổ địa chỉ</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input value={user?.email} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Họ tên</label>
          <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            className="w-full border rounded px-3 py-2" />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Số điện thoại</label>
          <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
            className="w-full border rounded px-3 py-2" />
        </div>
        <button className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700">
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
}
