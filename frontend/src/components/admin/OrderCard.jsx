import { ORDER_STATUS } from '../../utils/constants';
import { formatVND, formatDateTime } from '../../utils/format';

export default function OrderCard({ order, onUpdateStatus }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-bold">#{order.orderNumber || order._id.slice(-8)}</p>
          <p className="text-sm text-gray-500">{formatDateTime(order.createdAt)}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${ORDER_STATUS[order.status]?.color}`}>
          {ORDER_STATUS[order.status]?.label}
        </span>
      </div>
      <div className="text-sm space-y-1">
        <p><b>Khách:</b> {order.shippingAddress?.fullName} - {order.shippingAddress?.phone}</p>
        <p><b>Địa chỉ:</b> {order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
        <p><b>Sản phẩm:</b> {order.items?.length} món</p>
      </div>
      <div className="flex justify-between items-center mt-3 pt-3 border-t">
        <span className="font-bold text-red-600 text-lg">{formatVND(order.totalPrice)}</span>
        <select value={order.status} onChange={(e) => onUpdateStatus(order._id, e.target.value)}
          className="border rounded px-2 py-1 text-sm">
          {Object.keys(ORDER_STATUS).map(s => <option key={s} value={s}>{ORDER_STATUS[s].label}</option>)}
        </select>
      </div>
    </div>
  );
}
