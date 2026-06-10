import { useEffect, useState } from 'react';
import API from '../../api/axios';
import Chart from '../../components/admin/Chart';
import { formatVND } from '../../utils/format';

export default function RevenueReport() {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState({ start: '', end: '' });

  useEffect(() => {
    const end = new Date();
    const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    setPeriod({ start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] });
  }, []);

  useEffect(() => {
    if (period.start && period.end) {
      API.get(`/analytics/revenue?startDate=${period.start}&endDate=${period.end}`).then(r => setData(r.data));
    }
  }, [period]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">💰 Báo cáo doanh thu</h1>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex gap-2">
        <input type="date" value={period.start} onChange={e => setPeriod({...period, start: e.target.value})}
          className="border rounded px-3 py-2" />
        <span className="self-center">đến</span>
        <input type="date" value={period.end} onChange={e => setPeriod({...period, end: e.target.value})}
          className="border rounded px-3 py-2" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Chart data={data.map(d => ({ name: d._id, value: d.revenue }))} type="line" />
      </div>

      <div className="bg-white rounded-lg shadow-sm mt-4 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Ngày</th>
              <th className="p-3 text-right">Đơn hàng</th>
              <th className="p-3 text-right">Doanh thu</th>
              <th className="p-3 text-right">TB/Đơn</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{d._id}</td>
                <td className="p-3 text-right">{d.orders}</td>
                <td className="p-3 text-right text-red-600 font-bold">{formatVND(d.revenue)}</td>
                <td className="p-3 text-right">{formatVND(d.avgOrderValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
