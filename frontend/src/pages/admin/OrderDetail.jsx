import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { ORDER_STATUS, PAYMENT_METHODS } from '../../utils/constants';
import { formatVND, formatDateTime } from '../../utils/format';
import { toast } from 'react-hot-toast';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    API.get(`/admin/orders/${id}`).then(r => {
      setOrder(r.data);
      setTracking(r.data.trackingNumber || '');
    });
  }, [id]);

  const updateStatus = async (status) => {
    try {
      const { data } = await API.put(`/admin/orders/${id}/status`, { status, trackingNumber: tracking, note });
      setOrder(data);
      toast.success('Đã cập nhật');
    } catch { toast.error('Lỗi'); }
  };

  if (!order) return <p>Đang tải...</p>;

  return (
    <div>
      <button onClick={() => navigate('/admin/orders')} className="text-primary-600 mb-4">← Quay lại</button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-xl font-bold">#{order.orderNumber || order._id.slice(-8)}</h1>
                <p className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</p>
              </div>
              <span className={`px-3 py-1 rounded text-sm ${ORDER_STATUS[order.status]?.color}`}>
                {ORDER_STATUS[order.status]?.label}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-bold mb-3">Sản phẩm</h2>
            {order.items?.map((item, i) => (
              <div key={i} className="flex gap-3 py-2 border-b last:border-0">
                <img src={item.image} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">x{item.qty}</p>
                </div>
                <p className="font-bold">{formatVND(item.price * item.qty)}</p>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t text-right">
              <p className="font-bold text-lg">Tổng: <span className="text-red-600">{formatVND(order.totalPrice)}</span></p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-bold mb-3">Lịch sử đơn hàng</h2>
            <div className="space-y-2">
              {order.statusHistory?.map((s, i) => (
                <div key={i} className="text-sm flex justify-between border-l-2 border-primary-500 pl-3">
                  <div>
                    <p className="font-medium">{ORDER_STATUS[s.status]?.label}</p>
                    {s.note && <p className="text-gray-500">{s.note}</p>}
                  </div>
                  <span className="text-gray-500">{formatDateTime(s.updatedAt)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold mb-3">Khách hàng</h3>
            <p className="text-sm">{order.user?.name}</p>
            <p className="text-sm text-gray-500">{order.user?.email}</p>
            <p className="text-sm text-gray-500">{order.user?.phone}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold mb-3">Giao hàng</h3>
            <p className="text-sm">{order.shippingAddress?.fullName}</p>
            <p className="text-sm text-gray-500">{order.shippingAddress?.phone}</p>
            <p className="text-sm text-gray-500 mt-1">{order.shippingAddress?.address}</p>
            <p className="text-sm text-gray-500">{order.shippingAddress?.city}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-bold mb-3">Cập nhật đơn</h3>
            <label className="block text-sm mb-1">Mã vận đơn</label>
            <input value={tracking} onChange={e => setTracking(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3" placeholder="VD: SPX123456" />
            <label className="block text-sm mb-1">Ghi chú</label>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3" rows="2" />
            <select onChange={e => updateStatus(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-2">
              <option value="">-- Đổi trạng thái --</option>
              {Object.entries(ORDER_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
