import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useCartStore } from '../../store/cartStore';
import { toast } from 'react-hot-toast';
import { calculateDiscount } from '../../utils/helpers';
import { formatVND } from '../../utils/format';

export default function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem);
  const discount = calculateDiscount(product.price, product.salePrice);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden group">
      <Link to={`/product/${product._id}`} className="block relative">
        <img src={product.images?.[0] || 'https://via.placeholder.com/300'} alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition" />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-{discount}%</span>
        )}
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition">
          <FiHeart size={16} />
        </button>
      </Link>
      <div className="p-3">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary-600 min-h-[2.5rem]">{product.name}</h3>
        </Link>
        <div className="mt-2">
          {product.salePrice ? (
            <div>
              <span className="text-red-600 font-bold">{formatVND(product.salePrice)}</span>
              <span className="text-gray-400 line-through text-xs ml-2">{formatVND(product.price)}</span>
            </div>
          ) : (
            <span className="text-red-600 font-bold">{formatVND(product.price)}</span>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center text-xs text-gray-500">
            <span className="text-yellow-500">⭐</span>
            <span className="ml-1">{product.rating || 'N/A'}</span>
            <span className="mx-1">|</span>
            <span>Đã bán {product.sold || 0}</span>
          </div>
        </div>
        <button
          onClick={() => { addItem(product); toast.success('Đã thêm vào giỏ'); }}
          className="w-full mt-2 bg-primary-600 text-white text-sm py-1.5 rounded hover:bg-primary-700">
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
