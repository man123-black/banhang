import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../api/axios';
import ProductCard from '../../components/ui/ProductCard';
import ProductFilter from '../../components/product/ProductFilter';
import ProductSort from '../../components/product/ProductSort';
import Pagination from '../../components/ui/Pagination';
import Loading from '../../components/ui/Loading';

export default function ProductList() {
  const [params] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('newest');
  const [filters, setFilters] = useState({ category: '', minPrice: 0, maxPrice: 0 });

  useEffect(() => {
    setLoading(true);
    const search = params.get('search') || '';
    const category = params.get('category') || filters.category;
    const query = new URLSearchParams({
      page, limit: 12, sort, search,
      ...(category && { category }),
      ...(filters.minPrice && { minPrice: filters.minPrice }),
      ...(filters.maxPrice && { maxPrice: filters.maxPrice })
    });
    API.get(`/products?${query}`).then(r => {
      setProducts(r.data.products || []);
      setTotalPages(r.data.totalPages || 1);
    }).finally(() => setLoading(false));
  }, [page, sort, filters, params]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-64 flex-shrink-0">
          <ProductFilter filters={filters} setFilters={setFilters} />
        </aside>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-4 bg-white p-3 rounded">
            <h1 className="text-lg font-bold">
              {params.get('search') ? `Tìm kiếm: "${params.get('search')}"` : 'Tất cả sản phẩm'}
            </h1>
            <ProductSort sort={sort} setSort={setSort} />
          </div>

          {loading ? <Loading /> : products.length === 0 ? (
            <p className="text-center py-20 text-gray-500">Không tìm thấy sản phẩm</p>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
