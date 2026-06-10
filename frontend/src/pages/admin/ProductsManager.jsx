import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { formatVND } from '../../utils/format';
import { toast } from 'react-hot-toast';
import Loading from '../../components/ui/Loading';

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const fetchProducts = () => {
    setLoading(true);
    API.get(`/products?page=${page}&limit=20&search=${search}`).then(r => {
      setProducts(r.data.products || []);
      setTotalPages(r.data.totalPages || 1);
    }).finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    try {
      await API.delete(`/products/${id}`);
      toast.success('Đã xóa');
      fetchProducts();
    } catch { toast.error('Lỗi xóa'); }
  };

  const toggleActive = async (p) => {
    await API.put(`/products/${p._id}`, { isActive: !p.isActive });
    fetchProducts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📦 Sản phẩm</h1>
        <Link to="/admin/products/new" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
          + Thêm sản phẩm
        </Link>
      </div>

      <input placeholder="Tìm sản phẩm..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4" />

      {loading ? <Loading /> : (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Hình</th>
                <th className="p-3 text-left">Tên</th>
                <th className="p-3 text-right">Giá</th>
                <th className="p-3 text-right">Tồn kho</th>
                <th className="p-3 text-right">Đã bán</th>
                <th className="p-3 text-center">Trạng thái</th>
                <th className="p-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="p-3"><img src={p.images?.[0]} className="w-12 h-12 object-cover rounded" /></td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-right text-red-600 font-bold">{formatVND(p.salePrice || p.price)}</td>
                  <td className="p-3 text-right">{p.stock}</td>
                  <td className="p-3 text-right">{p.sold}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => toggleActive(p)}
                      className={`px-2 py-1 rounded text-xs ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {p.isActive ? 'Hiển thị' : 'Ẩn'}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <Link to={`/admin/products/${p._id}/edit`} className="bg-yellow-500 text-white px-2 py-1 rounded text-sm mr-1">Sửa</Link>
                    <button onClick={() => handleDelete(p._id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`px-3 py-1 rounded ${page === p ? 'bg-primary-600 text-white' : 'bg-white'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
