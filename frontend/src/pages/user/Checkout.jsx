import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { useCartStore } from '../../store/cartStore';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import AddressForm from '../../components/checkout/AddressForm';
import PaymentMethod from '../../components/checkout/PaymentMethod';
import OrderSummary from '../../components/checkout/OrderSummary';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clear } = useCartStore();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    fullName: user?.name || '', phone: user?.phone || '', address: '', city: '', district: '', ward: '', note: ''
  });
  const [payment, setPayment] = useState('COD');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const subtotal = total();
  const shipping = subtotal > 500000 ? 0 : 30000;
  const finalTotal = subtotal + shipping - discount;

  const applyCoupon = async () => {
    if (!coupon) return;
    try {
      const { data } = await API.post('/coupons/validate', { code: coupon, orderTotal: subtotal });
      setDiscount(data.discount);
      toast.success(`Áp dụng mã giảm giá: -${data.discount.toLocaleString()}đ`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Mã không hợp lệ');
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.phone || !address.address || !address.city) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      setStep(1);
      return;
    }
    setLoading(true);
    try {
      const { data: order } = await API.post('/orders', {
        items: items.map(i => ({ productId: i._id, qty: i.qty })),
        shippingAddress: address,
        paymentMethod: payment,
        note: address.note
      });

      if (payment === 'VNPAY') {
        const { data } = await API.post('/payment/vnpay', { orderId: order._id, amount: finalTotal });
        window.location.href = data.paymentUrl;
        return;
      }

      clear();
      toast.success('Đặt hàng thành công!');
      navigate(`/order-success/${order._id}`);
    } catch (err) {
      toast.error('Đặt hàng thất bại');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-4">Thanh toán</h1>

      {/* Stepper */}
      <div className="flex items-center justify-center mb-6">
        {['Địa chỉ', 'Thanh toán', 'Xác nhận'].map((label, i) => (
          <div key={i} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>
              {i + 1}
            </div>
            <span className={`ml-2 ${step >= i + 1 ? 'font-medium' : 'text-gray-500'}`}>{label}</span>
            {i < 2 && <div className="w-12 h-px bg-gray-300 mx-3" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {step === 1 && (
              <>
                <h2 className="text-lg font-bold mb-4">Thông tin giao hàng</h2>
                <AddressForm data={address} setData={setAddress} />
                <button onClick={() => setStep(2)} className="w-full mt-4 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700">
                  Tiếp tục →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-lg font-bold mb-4">Phương thức thanh toán</h2>
                <PaymentMethod value={payment} onChange={setPayment} />
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setStep(1)} className="flex-1 bg-gray-200 py-3 rounded-lg">← Quay lại</button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-primary-600 text-white py-3 rounded-lg">Tiếp tục →</button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-lg font-bold mb-4">Xác nhận đơn hàng</h2>
                <div className="space-y-2 text-sm border-b pb-3 mb-3">
                  <p><b>Người nhận:</b> {address.fullName} - {address.phone}</p>
                  <p><b>Địa chỉ:</b> {address.address}, {address.ward}, {address.district}, {address.city}</p>
                  <p><b>Thanh toán:</b> {payment}</p>
                  {address.note && <p><b>Ghi chú:</b> {address.note}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep(2)} className="flex-1 bg-gray-200 py-3 rounded-lg">← Quay lại</button>
                  <button onClick={handlePlaceOrder} disabled={loading}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50">
                    {loading ? 'Đang xử lý...' : '✅ Đặt hàng'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <OrderSummary />
          <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold mb-2">Mã giảm giá</h3>
            <div className="flex gap-2">
              <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())}
                placeholder="Nhập mã..." className="flex-1 border rounded px-3 py-2 text-sm" />
              <button onClick={applyCoupon} className="bg-primary-600 text-white px-4 rounded text-sm">Áp dụng</button>
            </div>
            {discount > 0 && <p className="text-green-600 text-sm mt-2">Đã giảm: -{discount.toLocaleString()}đ</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
