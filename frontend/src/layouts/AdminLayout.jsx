import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function AdminLayout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const link = ({ isActive }) => `block px-4 py-2 rounded ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`;

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">⚙️ Admin</h2>
        <nav className="space-y-1">
          <NavLink to="/admin" end className={link}>📊 Dashboard</NavLink>
          <NavLink to="/admin/products" className={link}>📦 Sản phẩm</NavLink>
          <NavLink to="/admin/orders" className={link}>📋 Đơn hàng</NavLink>
          <NavLink to="/admin/customers" className={link}>👥 Khách hàng</NavLink>
          <NavLink to="/admin/categories" className={link}>📁 Danh mục</NavLink>
          <NavLink to="/admin/coupons" className={link}>🎟️ Mã giảm giá</NavLink>
          <NavLink to="/admin/analytics" className={link}>📈 Thống kê</NavLink>
        </nav>
        <button onClick={() => { logout(); navigate('/'); }} className="mt-6 w-full bg-red-500 text-white py-2 rounded">Đăng xuất</button>
      </aside>
      <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
    </div>
  );
}
