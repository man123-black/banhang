import { formatVND } from '../../utils/format';
import { Link } from 'react-router-dom';

export default function CartSummary({ total, itemCount }) {
  const shipping = total > 500000 ? 0 : 30000;
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm sticky top-32">
      <h3 className="font-bold mb-3">Tóm tắt đơn hàng</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span>Tạm tính ({itemCount} SP)</span><span>{formatVND(total)}</span></div>
        <div className="flex justify-between"><span>Phí vận chuyển</span><span>{shipping === 0 ? 'Miễn phí' : formatVND(shipping)}</span></div>
        <div className="border-t pt-2 flex justify-between font-bold text-lg">
          <span>Tổng cộng</span>
          <span className="text-red-600">{formatVND(total + shipping)}</span>
        </div>
      </div>
      <Link to="/checkout" className="block text-center mt-4 bg-primary-600 text-white py-3 rounded hover:bg-primary-700">
        Tiến hành thanh toán
      </Link>
    </div>
  );
}
