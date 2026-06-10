export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }
  return (
    <div className="flex justify-center gap-2 mt-6">
      <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50">←</button>
      {pages.map((p, i) => (
        <button key={i} onClick={() => typeof p === 'number' && onPageChange(p)}
          className={`px-3 py-1 border rounded ${p === currentPage ? 'bg-primary-600 text-white' : ''} ${p === '...' ? 'cursor-default' : ''}`}>
          {p}
        </button>
      ))}
      <button disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50">→</button>
    </div>
  );
}
