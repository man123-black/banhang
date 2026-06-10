import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { ORDER_STATUS } from '../../utils/constants';
import { formatVND, formatDateTime } from '../../utils/format';
import { toast } from 'react-hot-toast';
import Loading from '../../components/ui/Loading';

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page, filter, search]);

  const fetchOrders = () => {
    setLoading(true);
    API.get(`/admin/orders?page=${page}&limit=20&status=${filter}&search=${search}`).then(r => {
      setOrders(r.data.orders || []);
      setTotalPages(r.data.totalPages || 1);
    }).finally(() => setLoading(false));
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/orders/${id}/status`, { status });
      toast.success('Đã cập nhật');
      fetchOrders();
    } catch { toast.error('Lỗi cập nhật'); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📋 Quản lý đơn hàng</h1>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-wrap gap-2">
        <input placeholder="Tìm mã ĐH, tên, SĐT..." value={search} onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-1 flex-1 min-w-[200px]" />
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded px-3 py-1">
          <option value="all">Tất cả trạng thái</option>
          {Object.entries(ORDER_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {loading ? <Loading /> : (
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o._id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <Link to={`/admin/orders/${o._id}`} className="font-bold text-primary-600">
                    #{o.orderNumber || o._id.slice(-8)}
                  </Link>
                  <p className="text-xs text-gray-500">{formatDateTime(o.createdAt)}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${ORDER_STATUS[o.status]?.color}`}>
                  {ORDER_STATUS[o.status]?.label}
                </span>
              </div>

              <div className="text-sm space-y-1 text-gray-600 mb-3">
                <p><b>Khách:</b> {o.shippingAddress?.fullName} - {o.shippingAddress?.phone}</p>
                <p><b>Địa chỉ:</b> {o.shippingAddress?.address}, {o.shippingAddress?.city}</p>
                <p><b>SP:</b> {o.items?.map(i => i.name).join(', ')}</p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <span className="font-bold text-red-600">{formatVND(o.totalPrice)}</span>
                <div className="flex gap-2">
                  <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm">
                    {Object.entries(ORDER_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <Link to={`/admin/orders/${o._id}`} className="bg-primary-600 text-white px-3 py-1 rounded text-sm">
                    Chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${page === p ? 'bg-primary-600 text-white' : 'bg-white'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
