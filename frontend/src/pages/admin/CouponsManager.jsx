import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';
import { formatVND, formatDate } from '../../utils/format';

export default function CouponsManager() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: 0, minOrder: 0, maxDiscount: 0, usageLimit: 100, isActive: true });

  useEffect(() => { API.get('/coupons').then(r => setCoupons(r.data)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/coupons', { ...form, code: form.code.toUpperCase() });
      toast.success('Đã tạo mã');
      setForm({ code: '', type: 'percentage', value: 0, minOrder: 0, maxDiscount: 0, usageLimit: 100, isActive: true });
      const { data } = await API.get('/coupons');
      setCoupons(data);
    } catch { toast.error('Lỗi'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa?')) return;
    await API.delete(`/coupons/${id}`);
    setCoupons(coupons.filter(c => c._id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🎟️ Mã giảm giá</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        <input required placeholder="CODE" value={form.code} onChange={e => setForm({...form, code: e.target.value})} className="border rounded px-3 py-2" />
        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="border rounded px-3 py-2">
          <option value="percentage">% Giảm</option>
          <option value="fixed">Số tiền</option>
        </select>
        <input type="number" placeholder="Giá trị" value={form.value} onChange={e => setForm({...form, value: +e.target.value})} className="border rounded px-3 py-2" />
        <input type="number" placeholder="Đơn tối thiểu" value={form.minOrder} onChange={e => setForm({...form, minOrder: +e.target.value})} className="border rounded px-3 py-2" />
        <button className="bg-primary-600 text-white px-4 py-2 rounded col-span-2 md:col-span-4">+ Tạo mã</button>
      </form>

      <div className="bg-white rounded-lg shadow-sm">
        {coupons.map(c => (
          <div key={c._id} className="flex items-center gap-3 p-3 border-b">
            <div className="flex-1">
              <p className="font-bold text-primary-600">{c.code}</p>
              <p className="text-sm text-gray-500">
                {c.type === 'percentage' ? `Giảm ${c.value}%` : `Giảm ${formatVND(c.value)}`}
                {' • '}Đơn tối thiểu {formatVND(c.minOrder)}
                {' • '}Đã dùng: {c.usedCount}/{c.usageLimit}
              </p>
            </div>
            <button onClick={() => handleDelete(c._id)} className="text-red-500">Xóa</button>
          </div>
        ))}
      </div>
    </div>
  );
}
