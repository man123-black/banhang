import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/format';
import { toast } from 'react-hot-toast';

export default function ProductReviews({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    API.get(`/reviews/product/${productId}`).then(r => setReviews(r.data));
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Vui lòng đăng nhập'); return; }
    try {
      await API.post('/reviews', { ...form, product: productId });
      toast.success('Đánh giá thành công!');
      setShowForm(false);
      setForm({ rating: 5, comment: '' });
      const { data } = await API.get(`/reviews/product/${productId}`);
      setReviews(data);
    } catch (err) { toast.error(err.response?.data?.message || 'Lỗi'); }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Đánh giá sản phẩm ({reviews.length})</h2>

      {user && !showForm && (
        <button onClick={() => setShowForm(true)} className="mb-4 bg-primary-600 text-white px-4 py-2 rounded">Viết đánh giá</button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
          <div className="mb-2">
            {[1,2,3,4,5].map(n => (
              <button type="button" key={n} onClick={() => setForm({...form, rating: n})} className="text-2xl">
                {n <= form.rating ? '⭐' : '☆'}
              </button>
            ))}
          </div>
          <textarea value={form.comment} onChange={e => setForm({...form, comment: e.target.value})}
            className="w-full border rounded p-2 mb-2" rows="3" placeholder="Chia sẻ cảm nhận..." required />
          <div className="flex gap-2">
            <button className="bg-primary-600 text-white px-4 py-2 rounded">Gửi</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 px-4 py-2 rounded">Hủy</button>
          </div>
        </form>
      )}

      {reviews.map(r => (
        <div key={r._id} className="bg-white p-4 rounded shadow mb-3">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center font-bold">
                {r.user?.name?.[0] || 'U'}
              </div>
              <span className="font-medium">{r.user?.name || 'User'}</span>
            </div>
            <span className="text-sm text-gray-500">{formatDate(r.createdAt)}</span>
          </div>
          <p className="text-yellow-500 mt-1">{'⭐'.repeat(r.rating)}</p>
          <p className="mt-1 text-gray-700">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
