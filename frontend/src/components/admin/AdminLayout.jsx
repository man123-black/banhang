import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useEffect, useState } from 'react';
import { socket } from '../../App';
import { toast } from 'react-hot-toast';

export default function AdminLayout() {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  useEffect(() => {
    if (user?.isAdmin) {
      socket.emit('admin:join');
      socket.on('new-order', (order) => {
        setNewOrdersCount(c => c + 1);
        toast.success(`🔔 Đơn mới từ ${order.shippingAddress?.fullName}`, { duration: 5000 });
        new Audio('/notification.mp3').play().catch(() => {});
      });
    }
    return () => { socket.off('new-order'); };
  }, [user]);

  const linkClass = ({ isActive }) =>
    `flex items-center justify-between gap-2 px-4 py-2 rounded-lg transition ${isActive ? 'bg-primary-600 text-white' : 'hover:bg-gray-100'}`;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow flex flex-col">
        <div className="p-4 border-b">
          <Link to="/" className="text-xl font-bold text-primary-600">🛍️ MyShop</Link>
          <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavLink to="/admin" end className={linkClass}>📊 Dashboard</NavLink>
          <NavLink to="/admin/products" className={linkClass}>📦 Sản phẩm</NavLink>
          <NavLink to="/admin/orders" className={linkClass}>
            <span>📋 Đơn hàng</span>
            {newOrdersCount > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-2">{newOrdersCount}</span>}
          </NavLink>
          <NavLink to="/admin/customers" className={linkClass}>👥 Khách hàng</NavLink>
          <NavLink to="/admin/categories" className={linkClass}>📁 Danh mục</NavLink>
          <NavLink to="/admin/coupons" className={linkClass}>🎟️ Mã giảm giá</NavLink>
          <NavLink to="/admin/reviews" className={linkClass}>⭐ Đánh giá</NavLink>
          <NavLink to="/admin/banners" className={linkClass}>🖼️ Banner</NavLink>
          <NavLink to="/admin/analytics" className={linkClass}>📈 Thống kê</NavLink>
          <NavLink to="/admin/revenue" className={linkClass}>💰 Doanh thu</NavLink>
          <NavLink to="/admin/settings" className={linkClass}>⚙️ Cài đặt</NavLink>
        </nav>
        <div className="p-3 border-t">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center font-bold">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full bg-red-500 text-white py-2 rounded text-sm">Đăng xuất</button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
