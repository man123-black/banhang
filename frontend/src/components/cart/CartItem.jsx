import { FiTrash2 } from 'react-icons/fi';
import { useCartStore } from '../../store/cartStore';
import { formatVND } from '../../utils/format';
import { Link } from 'react-router-dom';

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCartStore();
  return (
    <div className="flex items-center gap-3 p-3 border-b">
      <Link to={`/product/${item._id}`}>
        <img src={item.images?.[0]} className="w-16 h-16 object-cover rounded" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/product/${item._id}`} className="font-medium line-clamp-2 hover:text-primary-600">{item.name}</Link>
        <p className="text-red-600 font-bold mt-1">{formatVND(item.salePrice || item.price)}</p>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => updateQty(item._id, item.qty - 1)} className="w-7 h-7 border rounded">-</button>
        <span className="w-8 text-center">{item.qty}</span>
        <button onClick={() => updateQty(item._id, item.qty + 1)} className="w-7 h-7 border rounded">+</button>
      </div>
      <button onClick={() => removeItem(item._id)} className="text-red-500 p-2"><FiTrash2 /></button>
    </div>
  );
}
