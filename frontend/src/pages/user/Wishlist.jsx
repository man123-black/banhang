import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <FiHeart className="mx-auto text-pink-400" size={80} />
      <h1 className="text-2xl font-bold mt-4">Danh sách yêu thích</h1>
      <p className="text-gray-500 mt-2 mb-6">Bạn chưa có sản phẩm yêu thích nào</p>
      <Link to="/products" className="bg-primary-600 text-white px-6 py-2 rounded-full inline-block">
        Khám phá sản phẩm
      </Link>
    </div>
  );
}
