import { useEffect, useState } from 'react';
import API from '../../api/axios';
import StatsCard from '../../components/admin/StatsCard';
import Chart from '../../components/admin/Chart';
import Loading from '../../components/ui/Loading';
import { Link } from 'react-router-dom';
import { formatVND, formatDateTime } from '../../utils/format';
import { ORDER_STATUS } from '../../utils/constants';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/admin/dashboard'),
      API.get('/analytics/revenue?startDate=' + new Date(Date.now() - 30*24*60*60*1000).toISOString() + '&endDate=' + new Date().toISOString()),
      API.get('/admin/orders?limit=5')
    ]).then(([s, r, o]) => {
      setStats(s.data);
      setRevenue(r.data);
      setRecentOrders(o.data.orders || o.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loading size="lg" />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Tổng doanh thu" value={formatVND(stats?.totalRevenue)} icon="💰" color="green" />
        <StatsCard title="Doanh thu tháng" value={formatVND(stats?.monthRevenue)} icon="📈" color="blue" trend={stats?.monthGrowth} />
        <StatsCard title="Đơn hàng" value={stats?.totalOrders} icon="📦" color="purple" />
        <StatsCard title="Khách hàng" value={stats?.totalCustomers} icon="👥" color="indigo" />
        <StatsCard title="Đơn hôm nay" value={stats?.todayOrders} icon="🛒" color="yellow" />
        <StatsCard title="Chờ xử lý" value={stats?.pendingOrders} icon="⏳" color="red" />
        <StatsCard title="Sắp hết hàng" value={stats?.lowStockProducts} icon="⚠️" color="red" />
        <StatsCard title="DT hôm nay" value={formatVND(stats?.todayRevenue)} icon="💵" color="green" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-bold mb-4">Doanh thu 30 ngày qua</h3>
          <Chart data={revenue.map(r => ({ name: r._id, value: r.revenue }))} type="line" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Đơn hàng gần đây</h3>
            <Link to="/admin/orders" className="text-primary-600 text-sm">Xem tất cả →</Link>
          </div>
          <div className="space-y-2">
            {recentOrders.map(o => (
              <div key={o._id} className="border-b pb-2 last:border-0">
                <div className="flex justify-between">
                  <p className="font-medium text-sm">#{o.orderNumber || o._id.slice(-8)}</p>
                  <span className={`text-xs px-2 rounded ${ORDER_STATUS[o.status]?.color}`}>
                    {ORDER_STATUS[o.status]?.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{formatDateTime(o.createdAt)}</p>
                <p className="text-sm text-red-600 font-bold">{formatVND(o.totalPrice)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
