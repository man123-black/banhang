import { useCartStore } from '../../store/cartStore';
import { formatVND } from '../../utils/format';

export default function OrderSummary() {
  const items = useCartStore(s => s.items);
  const total = items.reduce((s, i) => s + (i.salePrice || i.price) * i.qty, 0);
  const shipping = total > 500000 ? 0 : 30000;
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-bold mb-3">Đơn hàng của bạn ({items.length} SP)</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {items.map(i => (
          <div key={i._id} className="flex gap-2 text-sm">
            <img src={i.images?.[0]} className="w-12 h-12 object-cover rounded" />
            <div className="flex-1">
              <p className="line-clamp-1">{i.name}</p>
              <p className="text-gray-500">x{i.qty} - {formatVND((i.salePrice || i.price) * i.qty)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t mt-3 pt-3 space-y-1 text-sm">
        <div className="flex justify-between"><span>Tạm tính:</span><span>{formatVND(total)}</span></div>
        <div className="flex justify-between"><span>Phí ship:</span><span>{shipping === 0 ? 'Miễn phí' : formatVND(shipping)}</span></div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Tổng:</span><span className="text-red-600">{formatVND(total + shipping)}</span>
        </div>
      </div>
    </div>
  );
}
