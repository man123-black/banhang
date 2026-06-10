import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-9xl font-bold text-primary-600">404</h1>
      <p className="text-2xl mt-4 mb-2">Không tìm thấy trang</p>
      <p className="text-gray-500 mb-6">Trang bạn đang tìm kiếm không tồn tại.</p>
      <Link to="/" className="bg-primary-600 text-white px-6 py-3 rounded-full inline-block hover:bg-primary-700">
        Về trang chủ
      </Link>
    </div>
  );
}
