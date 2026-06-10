import { useEffect, useState } from 'react';
import API from '../../api/axios';
import Chart from '../../components/admin/Chart';
import Loading from '../../components/ui/Loading';

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get('/analytics/overview').then(r => setData(r.data));
  }, []);

  if (!data) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📈 Thống kê chi tiết</h1>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-500">Tổng doanh thu</p>
          <p className="text-3xl font-bold text-green-600">{data.revenue.total.toLocaleString()}đ</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-500">Tổng đơn hàng</p>
          <p className="text-3xl font-bold text-blue-600">{data.revenue.count}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-bold mb-3">Đơn hàng theo trạng thái</h3>
          <Chart data={data.ordersByStatus.map(o => ({ name: o._id, value: o.count }))} type="pie" />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-bold mb-3">Top 10 sản phẩm bán chạy</h3>
          <Chart data={data.topProducts.map(t => ({ name: t.product?.[0]?.name, value: t.sold }))} type="bar" />
        </div>
      </div>
    </div>
  );
}
