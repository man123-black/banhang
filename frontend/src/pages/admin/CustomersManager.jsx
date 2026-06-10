import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { formatVND, formatDate } from '../../utils/format';
import { toast } from 'react-hot-toast';

export default function CustomersManager() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    API.get('/users').then(r => setCustomers(r.data));
  }, []);

  const toggleBlock = async (id) => {
    try {
      await API.put(`/users/${id}/toggle-block`);
      setCustomers(customers.map(c => c._id === id ? { ...c, isBlocked: !c.isBlocked } : c));
      toast.success('Đã cập nhật');
    } catch { toast.error('Lỗi'); }
  };

  const filtered = customers.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">👥 Khách hàng ({customers.length})</h1>
      <input placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4" />

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Khách hàng</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">SĐT</th>
              <th className="p-3 text-right">Đơn hàng</th>
              <th className="p-3 text-right">Tổng chi</th>
              <th className="p-3 text-center">Trạng thái</th>
              <th className="p-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c._id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <Link to={`/admin/customers/${c._id}`} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center font-bold">
                      {c.name?.[0]}
                    </div>
                    <span className="font-medium">{c.name}</span>
                  </Link>
                </td>
                <td className="p-3 text-sm">{c.email}</td>
                <td className="p-3 text-sm">{c.phone || '—'}</td>
                <td className="p-3 text-right">{c.orderCount || 0}</td>
                <td className="p-3 text-right text-red-600 font-bold">{formatVND(c.totalSpent || 0)}</td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded text-xs ${c.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {c.isBlocked ? 'Đã khóa' : 'Hoạt động'}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => toggleBlock(c._id)}
                    className={`px-3 py-1 rounded text-white text-sm ${c.isBlocked ? 'bg-green-500' : 'bg-red-500'}`}>
                    {c.isBlocked ? 'Mở khóa' : 'Khóa'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
