import { useEffect, useState } from 'react';
import API from '../../api/axios';
import ProductCard from '../../components/ui/ProductCard';
import { Link } from 'react-router-dom';
import Loading from '../../components/ui/Loading';
import { formatVND } from '../../utils/format';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/products/featured'),
      API.get('/products?sort=newest&limit=8'),
      API.get('/products?sort=best_selling&limit=8'),
      API.get('/banners?position=home_top'),
      API.get('/categories')
    ]).then(([f, n, b, ban, cat]) => {
      setFeatured(f.data);
      setNewArrivals(n.data.products || n.data);
      setBestSellers(b.data.products || b.data);
      setBanners(ban.data);
      setCategories(cat.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loading size="lg" />;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl p-8 md:p-12 mb-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-3">🛒 Mua sắm thông minh</h1>
          <p className="text-lg md:text-xl mb-6">Hàng triệu sản phẩm chính hãng - Giá tốt nhất thị trường</p>
          <Link to="/products" className="inline-block bg-white text-primary-600 px-6 py-3 rounded-full font-medium hover:shadow-lg transition">
            Khám phá ngay →
          </Link>
        </div>
      </div>

      {/* Categories */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Danh mục nổi bật</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.slice(0, 6).map(c => (
            <Link key={c._id} to={`/products?category=${c._id}`} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition text-center">
              <img src={c.image || 'https://via.placeholder.com/80'} alt={c.name} className="w-16 h-16 mx-auto object-cover rounded-full mb-2" />
              <p className="text-sm font-medium">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale / Featured */}
      {featured.length > 0 && (
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-red-600">🔥 Sản phẩm nổi bật</h2>
            <Link to="/products" className="text-primary-600 text-sm hover:underline">Xem tất cả →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">🏆 Bán chạy nhất</h2>
          <Link to="/products?sort=best_selling" className="text-primary-600 text-sm hover:underline">Xem tất cả →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {bestSellers.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">✨ Hàng mới về</h2>
          <Link to="/products?sort=newest" className="text-primary-600 text-sm hover:underline">Xem tất cả →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
