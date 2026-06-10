import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';

export default function Cart() {
  const { items } = useCartStore();
  const total = items.reduce((s, i) => s + (i.salePrice || i.price) * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-6">Hãy khám phá thêm sản phẩm nhé!</p>
        <Link to="/" className="bg-primary-600 text-white px-6 py-3 rounded-full inline-block hover:bg-primary-700">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng ({items.length} sản phẩm)</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          {items.map(item => <CartItem key={item._id} item={item} />)}
        </div>
        <div>
          <CartSummary total={total} itemCount={items.length} />
        </div>
      </div>
    </div>
  );
}
