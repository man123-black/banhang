export default function StatsCard({ title, value, icon, color = 'blue', trend }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {typeof value === 'number' ? new Intl.NumberFormat('vi-VN').format(value) : value}
          </p>
          {trend !== undefined && (
            <p className={`text-xs mt-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% so với tháng trước
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
