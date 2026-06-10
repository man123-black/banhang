import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiSearch, FiHeart, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCartStore } from '../../store/cartStore';
import { useUIStore } from '../../store/uiStore';

export default function Header() {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const count = useCartStore(s => s.items.reduce((sum, i) => sum + i.qty, 0));
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore();
  const [search, setSearch] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="bg-primary-600 text-white text-sm py-1.5">
        <div className="container mx-auto px-4 flex justify-between">
          <span>📞 Hotline: 1900 6868</span>
          <span>Miễn phí ship đơn từ 500k</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        <button className="md:hidden" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <Link to="/" className="text-2xl font-bold text-primary-600">🛍️ MyShop</Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Tìm sản phẩm, thương hiệu..." />
          </div>
        </form>

        <div className="flex items-center gap-4">
          <Link to="/wishlist" className="hidden md:block"><FiHeart size={22} /></Link>
          <Link to="/cart" className="relative">
            <FiShoppingCart size={22} />
            {count > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{count}</span>}
          </Link>
          {user ? (
            <div
              className="relative"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <button className="flex items-center gap-1">
                <FiUser size={20} />
                <span className="hidden md:inline text-sm">{user.name}</span>
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  {user.isAdmin && <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100 text-red-600 font-medium">⚙️ Admin Panel</Link>}
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Tài khoản</Link>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">Đơn hàng</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="text-sm hover:text-primary-600">Đăng nhập</Link>
              <Link to="/register" className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700">Đăng ký</Link>
            </div>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white p-4">
          <form onSubmit={handleSearch} className="mb-3">
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-2 border rounded" placeholder="Tìm sản phẩm..." />
          </form>
          <Link to="/products" className="block py-2">Sản phẩm</Link>
          {user && <Link to="/orders" className="block py-2">Đơn hàng</Link>}
        </div>
      )}
    </header>
  );
}
