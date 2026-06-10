import { Link, useParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

export default function OrderSuccess() {
  const { id } = useParams();
  return (
    <div className="container mx-auto px-4 py-12 text-center max-w-md">
      <FiCheckCircle className="mx-auto text-green-500" size={80} />
      <h1 className="text-2xl font-bold mt-4 mb-2">Đặt hàng thành công!</h1>
      <p className="text-gray-600 mb-1">Mã đơn hàng: <span className="font-bold text-primary-600">#{id?.slice(-8)}</span></p>
      <p className="text-gray-500 mb-6">Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
      <div className="flex gap-3 justify-center">
        <Link to="/orders" className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700">Xem đơn hàng</Link>
        <Link to="/" className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300">Về trang chủ</Link>
      </div>
    </div>
  );
}
