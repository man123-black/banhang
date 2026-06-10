import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', price: 0, salePrice: 0, stock: 0,
    category: '', brand: '', images: [''], isActive: true, isFeatured: false, tags: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    API.get('/categories').then(r => setCategories(r.data));
    if (id) {
      API.get(`/products/${id}`).then(r => setForm({ ...r.data, tags: r.data.tags?.join(', ') || '' }));
    }
  }, [id]);

  const handleImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const { data } = await API.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const newImages = [...form.images];
      newImages[index] = data.url;
      setForm({ ...form, images: newImages });
    } catch { toast.error('Upload thất bại'); }
    setUploading(false);
  };

  const addImageField = () => setForm({ ...form, images: [...form.images, ''] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    try {
      if (id) {
        await API.put(`/products/${id}`, payload);
        toast.success('Đã cập nhật');
      } else {
        await API.post('/products', payload);
        toast.success('Đã thêm sản phẩm');
      }
      navigate('/admin/products');
    } catch (err) { toast.error('Lỗi lưu sản phẩm'); }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Sửa' : 'Thêm'} sản phẩm</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Tên sản phẩm *</label>
          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
            className="w-full border rounded px-3 py-2" rows="4" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Giá *</label>
            <input type="number" required value={form.price} onChange={e => setForm({...form, price: +e.target.value})}
              className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Giá khuyến mãi</label>
            <input type="number" value={form.salePrice} onChange={e => setForm({...form, salePrice: +e.target.value})}
              className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tồn kho *</label>
            <input type="number" required value={form.stock} onChange={e => setForm({...form, stock: +e.target.value})}
              className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Danh mục</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              className="w-full border rounded px-3 py-2">
              <option value="">-- Chọn --</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thương hiệu</label>
            <input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})}
              className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags (phân cách dấu phẩy)</label>
          <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})}
            className="w-full border rounded px-3 py-2" placeholder="iphone, apple, 5g" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Hình ảnh</label>
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={img} onChange={e => {
                const arr = [...form.images]; arr[i] = e.target.value; setForm({...form, images: arr});
              }} className="flex-1 border rounded px-3 py-2" placeholder="URL hoặc upload" />
              <input type="file" accept="image/*" onChange={e => handleImageUpload(e, i)} className="hidden" id={`file-${i}`} />
              <label htmlFor={`file-${i}`} className="bg-gray-200 px-3 py-2 rounded cursor-pointer">{uploading ? '...' : '📤'}</label>
              {img && <img src={img} className="w-10 h-10 object-cover rounded" />}
            </div>
          ))}
          <button type="button" onClick={addImageField} className="text-sm text-primary-600">+ Thêm hình</button>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} /> Hiển thị</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} /> Nổi bật</label>
        </div>

        <div className="flex gap-2 pt-4">
          <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700">Lưu</button>
          <button type="button" onClick={() => navigate('/admin/products')} className="bg-gray-200 px-6 py-2 rounded">Hủy</button>
        </div>
      </form>
    </div>
  );
}
