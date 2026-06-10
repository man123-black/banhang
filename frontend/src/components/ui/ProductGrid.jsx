import ProductCard from './ProductCard';

export default function ProductGrid({ products, cols = 4 }) {
  const colsClass = { 2: 'grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-3 lg:grid-cols-4', 5: 'md:grid-cols-4 lg:grid-cols-5' }[cols];
  return (
    <div className={`grid grid-cols-2 ${colsClass} gap-4`}>
      {products.map(p => <ProductCard key={p._id} product={p} />)}
    </div>
  );
}
