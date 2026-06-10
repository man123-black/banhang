import { useState } from 'react';
import API from '../../api/axios';
import { useEffect } from 'react';

export default function ProductFilter({ filters, setFilters }) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    API.get('/categories').then(r => setCategories(r.data));
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm sticky top-32">
      <h3 className="font-bold mb-3">Bộ lọc</h3>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Danh mục</h4>
        <label className="flex items-center gap-2 py-1">
          <input type="radio" name="cat" checked={!filters.category} onChange={() => setFilters({...filters, category: ''})} />
          <span>Tất cả</span>
        </label>
        {categories.map(c => (
          <label key={c._id} className="flex items-center gap-2 py-1">
            <input type="radio" name="cat" checked={filters.category === c._id} onChange={() => setFilters({...filters, category: c._id})} />
            <span>{c.name}</span>
          </label>
        ))}
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Giá</h4>
        {[
          { label: 'Dưới 1 triệu', min: 0, max: 1000000 },
          { label: '1 - 5 triệu', min: 1000000, max: 5000000 },
          { label: '5 - 20 triệu', min: 5000000, max: 20000000 },
          { label: 'Trên 20 triệu', min: 20000000, max: 0 }
        ].map((r, i) => (
          <label key={i} className="flex items-center gap-2 py-1">
            <input type="radio" name="price"
              checked={filters.minPrice === r.min && filters.maxPrice === r.max}
              onChange={() => setFilters({...filters, minPrice: r.min, maxPrice: r.max})} />
            <span>{r.label}</span>
          </label>
        ))}
      </div>

      <button onClick={() => setFilters({ category: '', minPrice: 0, maxPrice: 0 })}
        className="w-full bg-gray-100 py-2 rounded hover:bg-gray-200 text-sm">
        Xóa bộ lọc
      </button>
    </div>
  );
}
