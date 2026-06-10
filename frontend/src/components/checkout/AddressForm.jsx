import Input from '../ui/Input';

export default function AddressForm({ data, setData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Input label="Họ tên" required value={data.fullName} onChange={e => setData({...data, fullName: e.target.value})} />
      <Input label="Số điện thoại" required type="tel" value={data.phone} onChange={e => setData({...data, phone: e.target.value})} />
      <Input label="Địa chỉ" required className="md:col-span-2" value={data.address} onChange={e => setData({...data, address: e.target.value})} />
      <Input label="Tỉnh/Thành phố" required value={data.city} onChange={e => setData({...data, city: e.target.value})} />
      <Input label="Quận/Huyện" value={data.district} onChange={e => setData({...data, district: e.target.value})} />
      <Input label="Phường/Xã" className="md:col-span-2" value={data.ward} onChange={e => setData({...data, ward: e.target.value})} />
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Ghi chú</label>
        <textarea value={data.note || ''} onChange={e => setData({...data, note: e.target.value})}
          className="w-full border rounded px-3 py-2" rows="2" placeholder="Ghi chú cho đơn hàng..." />
      </div>
    </div>
  );
}
