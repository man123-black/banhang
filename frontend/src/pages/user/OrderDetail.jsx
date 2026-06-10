import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import { ORDER_STATUS, PAYMENT_METHODS } from '../../utils/constants';
import { formatVND, formatDateTime } from '../../utils/format';
import { toast } from 'react-hot-toast';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    API.get(`/orders/${id}`).then(r => setOrder(r.data));
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    try {
      const { data } = await API.put(`/orders/${id}/cancel`, { reason: 'Khách hàng hủy' });
      setOrder(data);
      toast.success('Đã hủy đơn hàng');
    } catch (err) { toast.error('Không thể hủy đơn hàng này'); }
  };

  if (!order) return <p className="container py-10 text-center">Đang tải...</p>;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Link to="/orders" className="text-primary-600 mb-4 inline-block">← Quay lại</Link>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl font-bold">Đơn hàng #{order.orderNumber || order._id.slice(-8)}</h1>
            <p className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</p>
          </div>
          <span className={`px-3 py-1 rounded text-sm font-medium ${ORDER_STATUS[order.status]?.color}`}>
            {ORDER_STATUS[order.status]?.label}
          </span>
        </div>

        {order.statusHistory?.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium mb-2">Lịch sử đơn hàng</h3>
            <div className="space-y-2">
              {order.statusHistory.map((s, i) => (
                <div key={i} className="text-sm flex justify-between">
                  <span>{ORDER_STATUS[s.status]?.label || s.status} {s.note && `- ${s.note}`}</span>
                  <span className="text-gray-500">{formatDateTime(s.updatedAt)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
        <h2 className="font-bold mb-3">Sản phẩm</h2>
        {order.items?.map((item, i) => (
          <div key={i} className="flex gap-3 py-3 border-b last:border-0">
            <img src={item.image} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">x{item.qty}</p>
            </div>
            <p className="text-red-600 font-bold">{formatVND(item.price * item.qty)}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
        <h2 className="font-bold mb-3">Thông tin giao hàng</h2>
        <p className="text-sm">{order.shippingAddress?.fullName} - {order.shippingAddress?.phone}</p>
        <p className="text-sm text-gray-600">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
        {order.trackingNumber && <p className="text-sm mt-2">Mã vận đơn: <b>{order.trackingNumber}</b></p>}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="font-bold mb-3">Thanh toán</h2>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span>Tạm tính:</span><span>{formatVND(order.itemsPrice)}</span></div>
          <div className="flex justify-between"><span>Phí ship:</span><span>{formatVND(order.shippingPrice)}</span></div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Tổng:</span><span className="text-red-600">{formatVND(order.totalPrice)}</span>
          </div>
          <p className="mt-2 text-gray-500">Phương thức: {PAYMENT_METHODS[order.paymentMethod]?.label}</p>
        </div>

        {['pending', 'confirmed'].includes(order.status) && (
          <button onClick={handleCancel} className="mt-4 w-full bg-red-100 text-red-600 py-2 rounded hover:bg-red-200">
            Hủy đơn hàng
          </button>
        )}
      </div>
    </div>
  );
}
