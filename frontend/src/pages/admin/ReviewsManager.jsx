import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';
import { formatDateTime } from '../../utils/format';

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => { API.get('/reviews').then(r => setReviews(r.data)); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Xóa đánh giá?')) return;
    await API.delete(`/reviews/${id}`);
    setReviews(reviews.filter(r => r._id !== id));
    toast.success('Đã xóa');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">⭐ Quản lý đánh giá</h1>
      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r._id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">{r.user?.name}</p>
                <p className="text-xs text-gray-500">{r.product?.name}</p>
              </div>
              <div className="text-right">
                <p className="text-yellow-500">{'⭐'.repeat(r.rating)}</p>
                <p className="text-xs text-gray-500">{formatDateTime(r.createdAt)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">{r.comment}</p>
            <button onClick={() => handleDelete(r._id)} className="text-red-500 text-sm mt-2">Xóa</button>
          </div>
        ))}
      </div>
    </div>
  );
}
