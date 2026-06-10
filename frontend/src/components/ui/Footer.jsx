import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">🛍️ MyShop</h3>
          <p className="text-sm">Website thương mại điện tử uy tín hàng đầu Việt Nam</p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="hover:text-white"><FiFacebook size={20} /></a>
            <a href="#" className="hover:text-white"><FiInstagram size={20} /></a>
            <a href="#" className="hover:text-white"><FiYoutube size={20} /></a>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Về chúng tôi</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">Giới thiệu</Link></li>
            <li><Link to="/contact" className="hover:text-white">Liên hệ</Link></li>
            <li><Link to="/careers" className="hover:text-white">Tuyển dụng</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Hỗ trợ</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><FiPhone size={14} /> 1900 6868</li>
            <li className="flex items-center gap-2"><FiMail size={14} /> support@myshop.com</li>
            <li className="flex items-center gap-2"><FiMapPin size={14} /> Hà Nội, Việt Nam</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Chính sách</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/policy/shipping" className="hover:text-white">Vận chuyển</Link></li>
            <li><Link to="/policy/return" className="hover:text-white">Đổi trả</Link></li>
            <li><Link to="/policy/payment" className="hover:text-white">Thanh toán</Link></li>
            <li><Link to="/policy/privacy" className="hover:text-white">Bảo mật</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-sm">
        © 2026 MyShop. All rights reserved.
      </div>
    </footer>
  );
}
