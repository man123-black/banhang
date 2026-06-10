import { useState } from 'react';
import API from '../../api/axios';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/auth/forgot-password', { email });
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center">Quên mật khẩu?</h1>
        {sent ? (
          <p className="text-green-600 text-center">Email khôi phục đã được gửi. Vui lòng kiểm tra hộp thư.</p>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-4 text-center">Nhập email để nhận link đặt lại mật khẩu</p>
            <input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4" />
            <button className="w-full bg-primary-600 text-white py-2 rounded">Gửi yêu cầu</button>
          </>
        )}
        <Link to="/login" className="block text-center mt-4 text-sm text-primary-600">← Quay lại đăng nhập</Link>
      </form>
    </div>
  );
}
