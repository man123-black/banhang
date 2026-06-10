import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../hooks/useAuth';
import { formatVND, formatNumber } from '../../utils/format';
import { calculateDiscount } from '../../utils/helpers';
import { toast } from 'react-hot-toast';
import ProductReviews from '../../components/product/ProductReviews';
import RelatedProducts from '../../components/product/RelatedProducts';
import Loading from '../../components/ui/Loading';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const addItem = useCartStore(s => s.addItem);
  const { user } = useAuth();

  useEffect(() => {
    API.get(`/products/${id}`).then(r => setProduct(r.data)).catch(() => navigate('/'));
    API.post('/analytics/track', { type: 'view', productId: id }).catch(() => {});
  }, [id]);

  if (!product) return <Loading />;

  const discount = calculateDiscount(product.price, product.salePrice);
  const finalPrice = product.salePrice || product.price;

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập trước khi thêm vào giỏ hàng');
      setTimeout(() => {
        navigate('/login', { state: { from: `/product/${id}` } });
      }, 1200);
      return;
    }

    addItem(product, qty);
    toast.success('Đã thêm vào giỏ hàng');
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập trước khi thanh toán');
      setTimeout(() => {
        navigate('/login', { state: { from: `/product/${id}` } });
      }, 1200);
      return;
    }

    addItem(product, qty);
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <img src={product.images?.[activeImage]} alt={product.name}
              className="w-full rounded-lg border" />
            {product.images?.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img, i) => (
                  <img key={i} src={img} onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${activeImage === i ? 'border-primary-500' : 'border-gray-200'}`} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
              <span className="text-yellow-500">⭐ {product.rating || 'N/A'}</span>
              <span>|</span>
              <span>{formatNumber(product.numReviews)} đánh giá</span>
              <span>|</span>
              <span>Đã bán {formatNumber(product.sold)}</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-red-600">{formatVND(finalPrice)}</span>
                {discount > 0 && (
                  <>
                    <span className="text-gray-400 line-through">{formatVND(product.price)}</span>
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">-{discount}%</span>
                  </>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Số lượng còn: <b className="text-gray-800">{product.stock}</b></p>
              <div className="flex items-center gap-3">
                <span className="text-sm">Số lượng:</span>
                <div className="flex items-center border rounded">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1 hover:bg-gray-100">-</button>
                  <span className="px-4 border-x">{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-1 hover:bg-gray-100">+</button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium">
                🛒 Thêm vào giỏ
              </button>
              <button onClick={handleBuyNow} disabled={product.stock === 0}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium">
                Mua ngay
              </button>
            </div>

            <div className="border-t pt-4 text-sm space-y-1 text-gray-600">
              <p>✅ Cam kết chính hãng 100%</p>
              <p>🚚 Miễn phí ship đơn từ 500k</p>
              <p>🔄 Đổi trả trong 7 ngày</p>
              <p>💳 Thanh toán khi nhận hàng (COD)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <h2 className="text-xl font-bold mb-3">Mô tả sản phẩm</h2>
        <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <ProductReviews productId={id} />
      </div>

      <RelatedProducts categoryId={product.category?._id} currentId={id} />
    </div>
  );
}
