import { useEffect, useState } from 'react';
import API from '../../api/axios';
import ProductCard from '../ui/ProductCard';

export default function RelatedProducts({ categoryId, currentId }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!categoryId) return;
    API.get(`/products?category=${categoryId}&limit=5`).then(r => {
      setProducts((r.data.products || r.data).filter(p => p._id !== currentId).slice(0, 4));
    });
  }, [categoryId, currentId]);

  if (!products.length) return null;
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
}
