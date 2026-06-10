import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { io } from 'socket.io-client';
import { useEffect } from 'react';

import UserLayout from './layouts/UserLayout';
import AdminLayout from './components/admin/AdminLayout';

import Home from './pages/user/Home';
import ProductList from './pages/user/ProductList';
import ProductDetail from './pages/user/ProductDetail';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import OrderSuccess from './pages/user/OrderSuccess';
import OrderHistory from './pages/user/OrderHistory';
import OrderDetail from './pages/user/OrderDetail';
import Profile from './pages/user/Profile';
import ChangePassword from './pages/user/ChangePassword';
import AddressBook from './pages/user/AddressBook';
import Wishlist from './pages/user/Wishlist';
import PolicyPage from './pages/user/PolicyPage';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import ForgotPassword from './pages/user/ForgotPassword';
import NotFound from './pages/user/NotFound';

import Dashboard from './pages/admin/Dashboard';
import ProductsManager from './pages/admin/ProductsManager';
import ProductForm from './pages/admin/ProductForm';
import OrdersManager from './pages/admin/OrdersManager';
import OrderDetailAdmin from './pages/admin/OrderDetail';
import CustomersManager from './pages/admin/CustomersManager';
import CustomerDetail from './pages/admin/CustomerDetail';
import CategoriesManager from './pages/admin/CategoriesManager';
import CouponsManager from './pages/admin/CouponsManager';
import ReviewsManager from './pages/admin/ReviewsManager';
import BannersManager from './pages/admin/BannersManager';
import Analytics from './pages/admin/Analytics';
import RevenueReport from './pages/admin/RevenueReport';
import Settings from './pages/admin/Settings';

export const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', { autoConnect: false });

const Protected = ({ children, admin = false }) => {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/login" />;
  if (admin && !user.isAdmin) return <Navigate to="/" />;
  return children;
};

export default function App() {
  const { user, token } = useAuthStore();
  useEffect(() => {
    if (token) {
      socket.auth = { token };
      socket.connect();
    }
    return () => { socket.disconnect(); };
  }, [token]);

  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
        <Route path="/order-success/:id" element={<Protected><OrderSuccess /></Protected>} />
        <Route path="/orders" element={<Protected><OrderHistory /></Protected>} />
        <Route path="/orders/:id" element={<Protected><OrderDetail /></Protected>} />
        <Route path="/profile" element={<Protected><Profile /></Protected>} />
        <Route path="/change-password" element={<Protected><ChangePassword /></Protected>} />
        <Route path="/addresses" element={<Protected><AddressBook /></Protected>} />
        <Route path="/wishlist" element={<Protected><Wishlist /></Protected>} />
        <Route path="/policy/:slug" element={<PolicyPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/admin" element={<Protected admin><AdminLayout /></Protected>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsManager />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="orders" element={<OrdersManager />} />
        <Route path="orders/:id" element={<OrderDetailAdmin />} />
        <Route path="customers" element={<CustomersManager />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
        <Route path="categories" element={<CategoriesManager />} />
        <Route path="coupons" element={<CouponsManager />} />
        <Route path="reviews" element={<ReviewsManager />} />
        <Route path="banners" element={<BannersManager />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="revenue" element={<RevenueReport />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
