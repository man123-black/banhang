import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', image: '', isActive: true });
  const [editing, setEditing] = useState(null);

  useEffect(() => { fetch(); }, []);

  const fetch = () => API.get('/categories').then(r => setCategories(r.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/categories/${editing._id}`, form);
      } else {
        await API.post('/categories', form);
      }
      toast.success('Đã lưu');
      setForm({ name: '', image: '', isActive: true });
      setEditing(null);
      fetch();
    } catch { toast.error('Lỗi'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa?')) return;
    await API.delete(`/categories/${id}`);
    fetch();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📁 Danh mục</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm mb-4 flex gap-2">
        <input required placeholder="Tên danh mục" value={form.name}
          onChange={e => setForm({...form, name: e.target.value})} className="flex-1 border rounded px-3 py-2" />
        <input placeholder="URL hình" value={form.image}
          onChange={e => setForm({...form, image: e.target.value})} className="flex-1 border rounded px-3 py-2" />
        <button className="bg-primary-600 text-white px-4 py-2 rounded">
          {editing ? 'Cập nhật' : '+ Thêm'}
        </button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({name:'', image:''}); }} className="bg-gray-200 px-4 py-2 rounded">Hủy</button>}
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {categories.map(c => (
          <div key={c._id} className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-3">
            {c.image && <img src={c.image} className="w-12 h-12 object-cover rounded" />}
            <div className="flex-1">
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-gray-500">{c.isActive ? 'Hiển thị' : 'Ẩn'}</p>
            </div>
            <button onClick={() => { setEditing(c); setForm({name: c.name, image: c.image || '', isActive: c.isActive}); }} className="text-yellow-600">Sửa</button>
            <button onClick={() => handleDelete(c._id)} className="text-red-500">Xóa</button>
          </div>
        ))}
      </div>
    </div>
  );
}
