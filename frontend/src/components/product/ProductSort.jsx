export default function ProductSort({ sort, setSort }) {
  return (
    <select value={sort} onChange={e => setSort(e.target.value)} className="border rounded px-3 py-1 text-sm">
      <option value="newest">Mới nhất</option>
      <option value="price_asc">Giá tăng dần</option>
      <option value="price_desc">Giá giảm dần</option>
      <option value="best_selling">Bán chạy</option>
      <option value="rating">Đánh giá cao</option>
    </select>
  );
}
