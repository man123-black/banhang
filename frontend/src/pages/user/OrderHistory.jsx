import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { ORDER_STATUS } from '../../utils/constants';
import { formatVND, formatDateTime } from '../../utils/format';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/my').then(r => { setOrders(r.data); setLoading(false); });
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h1>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        <button onClick={() => setFilter('all')} className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-white'}`}>Tất cả</button>
        {Object.entries(ORDER_STATUS).map(([k, v]) => (
          <button key={k} onClick={() => setFilter(k)} className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${filter === k ? 'bg-primary-600 text-white' : 'bg-white'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {loading ? <p className="text-center py-10">Đang tải...</p> : filtered.length === 0 ? (
        <p className="text-center py-10 text-gray-500">Chưa có đơn hàng nào</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(o => (
            <Link to={`/orders/${o._id}`} key={o._id} className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold">#{o.orderNumber || o._id.slice(-8)}</p>
                  <p className="text-xs text-gray-500">{formatDateTime(o.createdAt)}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${ORDER_STATUS[o.status]?.color}`}>
                  {ORDER_STATUS[o.status]?.label}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {o.items?.length} sản phẩm: {o.items?.[0]?.name}{o.items?.length > 1 && ` và ${o.items.length - 1} sản phẩm khác`}
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-sm text-gray-500">Tổng tiền:</span>
                <span className="font-bold text-red-600">{formatVND(o.totalPrice)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
