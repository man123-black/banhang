import { useEffect, useState } from 'react';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';

export default function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({ street: '', city: '', district: '', ward: '' });

  useEffect(() => {
    API.get('/auth/profile').then(r => setAddresses(r.data.addresses || []));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const newAddresses = [...addresses, form];
    await API.put('/auth/profile', { addresses: newAddresses });
    setAddresses(newAddresses);
    setForm({ street: '', city: '', district: '', ward: '' });
    toast.success('Đã thêm địa chỉ');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Sổ địa chỉ</h1>
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <input placeholder="Địa chỉ" required value={form.street} onChange={e => setForm({...form, street: e.target.value})} className="w-full border rounded px-3 py-2 mb-2" />
        <div className="grid grid-cols-3 gap-2">
          <input placeholder="Phường/Xã" value={form.ward} onChange={e => setForm({...form, ward: e.target.value})} className="border rounded px-3 py-2" />
          <input placeholder="Quận/Huyện" value={form.district} onChange={e => setForm({...form, district: e.target.value})} className="border rounded px-3 py-2" />
          <input placeholder="Tỉnh/TP" required value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="border rounded px-3 py-2" />
        </div>
        <button className="mt-2 w-full bg-primary-600 text-white py-2 rounded">+ Thêm địa chỉ</button>
      </form>

      {addresses.map((a, i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow-sm mb-2">
          <p>{a.street}, {a.ward}, {a.district}, {a.city}</p>
        </div>
      ))}
    </div>
  );
}
