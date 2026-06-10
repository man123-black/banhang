import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';
import { formatVND, formatDateTime } from '../../utils/format';
import { ORDER_STATUS } from '../../utils/constants';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    API.get(`/users/${id}`).then(r => setCustomer(r.data));
  }, [id]);

  if (!customer) return <p>Đang tải...</p>;

  return (
    <div>
      <button onClick={() => navigate('/admin/customers')} className="text-primary-600 mb-4">← Quay lại</button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full mx-auto flex items-center justify-center text-2xl font-bold">
              {customer.name?.[0]}
            </div>
            <h2 className="text-xl font-bold mt-3">{customer.name}</h2>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">SĐT:</span><span>{customer.phone || '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Đăng ký:</span><span>{formatDateTime(customer.createdAt)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tổng đơn:</span><span className="font-bold">{customer.orderCount || 0}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tổng chi:</span><span className="text-red-600 font-bold">{formatVND(customer.totalSpent || 0)}</span></div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-bold mb-3">Địa chỉ</h3>
          {customer.address ? (
            <p className="text-sm">
              {customer.address.street}, {customer.address.ward}, {customer.address.district}, {customer.address.city}
            </p>
          ) : <p className="text-sm text-gray-500">Chưa cập nhật</p>}
        </div>
      </div>
    </div>
  );
}
