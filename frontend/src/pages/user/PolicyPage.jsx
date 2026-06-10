import { Link, useParams } from 'react-router-dom';

const policyContent = {
  shipping: {
    title: 'Chính sách vận chuyển',
    intro: 'MyShop cam kết giao hàng nhanh, an toàn và rõ ràng cho mọi đơn hàng.',
    sections: [
      { title: 'Thời gian giao hàng', text: 'Đơn hàng nội thành thường được giao trong 24–48 giờ, khu vực khác có thể mất 2–5 ngày làm việc.' },
      { title: 'Chi phí vận chuyển', text: 'Phí vận chuyển được tính tự động ở bước thanh toán và miễn phí cho đơn hàng từ 500.000 đồng trở lên.' },
      { title: 'Theo dõi đơn hàng', text: 'Khách hàng có thể theo dõi tình trạng đơn hàng trực tiếp trên tài khoản hoặc qua email xác nhận.' }
    ]
  },
  return: {
    title: 'Chính sách đổi trả',
    intro: 'Khách hàng có thể đổi hoặc trả sản phẩm trong thời gian quy định nếu sản phẩm bị lỗi hoặc không đúng mô tả.',
    sections: [
      { title: 'Điều kiện đổi trả', text: 'Sản phẩm phải còn nguyên tem mác, chưa qua sử dụng và có đủ hóa đơn/đơn hàng.' },
      { title: 'Thời hạn', text: 'Yêu cầu đổi trả được xử lý trong vòng 7 ngày kể từ khi nhận hàng.' },
      { title: 'Hỗ trợ', text: 'Nếu có vấn đề về chất lượng hoặc sai sản phẩm, đội ngũ hỗ trợ sẽ liên hệ trong vòng 24 giờ.' }
    ]
  },
  payment: {
    title: 'Chính sách thanh toán',
    intro: 'MyShop hỗ trợ nhiều phương thức thanh toán an toàn và minh bạch.',
    sections: [
      { title: 'Phương thức hỗ trợ', text: 'Thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng và thanh toán trực tuyến qua cổng VNPAY.' },
      { title: 'Bảo mật giao dịch', text: 'Thông tin thanh toán được mã hóa và không được lưu trữ dưới dạng văn bản rõ ràng.' },
      { title: 'Hóa đơn', text: 'Hóa đơn điện tử sẽ được gửi tự động qua email sau khi giao dịch hoàn tất.' }
    ]
  },
  privacy: {
    title: 'Chính sách bảo mật',
    intro: 'Thông tin cá nhân của khách hàng được bảo vệ và chỉ sử dụng cho mục đích vận hành dịch vụ.',
    sections: [
      { title: 'Thông tin thu thập', text: 'Chúng tôi thu thập thông tin cần thiết như họ tên, địa chỉ, email và số điện thoại để xử lý đơn hàng.' },
      { title: 'Cách bảo vệ', text: 'Mọi dữ liệu nhạy cảm đều được bảo vệ bằng các biện pháp kỹ thuật và kiểm soát truy cập.' },
      { title: 'Quyền của khách hàng', text: 'Khách hàng có thể yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân của mình bất cứ lúc nào.' }
    ]
  }
};

export default function PolicyPage() {
  const { slug } = useParams();
  const policy = policyContent[slug] || policyContent.shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <Link to="/" className="text-blue-600 hover:underline">← Quay lại trang chủ</Link>
        <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-gray-900">{policy.title}</h1>
          <p className="mt-4 text-gray-600">{policy.intro}</p>
          <div className="mt-8 space-y-6">
            {policy.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                <p className="mt-2 text-gray-700">{section.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
