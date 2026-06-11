require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');
const User = require('./src/models/User');
const Banner = require('./src/models/Banner');

// Hàm tạo ảnh SVG placeholder đáng tin cậy 100% (luôn hiển thị)
const generateImage = (text, bgColor = '3B82F6', textColor = 'ffffff') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="#${bgColor}"/>
    <text x="200" y="220" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="#${textColor}" text-anchor="middle">${text}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

const generateBanner = (text, bgColor = '2563eb') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:#${bgColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="1200" height="400" fill="url(#grad)"/>
    <text x="600" y="220" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="white" text-anchor="middle">${text}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Xóa dữ liệu cũ
    await Promise.all([
      Product.deleteMany({}),
      Category.deleteMany({}),
      User.deleteMany({}),
      Banner.deleteMany({})
    ]);
    console.log('🗑️  Cleared old data');

    // ============ CATEGORIES ============
    const cats = await Category.insertMany([
      { 
        name: 'Điện thoại', 
        slug: 'dien-thoai', 
        image: generateImage('Phone', '1E40AF'),
        description: 'Điện thoại thông minh các loại'
      },
      { 
        name: 'Laptop', 
        slug: 'laptop', 
        image: generateImage('Laptop', '059669'),
        description: 'Laptop các thương hiệu'
      },
      { 
        name: 'Phụ kiện', 
        slug: 'phu-kien', 
        image: generateImage('Accessory', 'DC2626'),
        description: 'Phụ kiện công nghệ'
      },
      { 
        name: 'Thời trang', 
        slug: 'thoi-trang', 
        image: generateImage('Fashion', '7C3AED'),
        description: 'Thời trang nam nữ'
      },
      { 
        name: 'Đồ gia dụng', 
        slug: 'do-gia-dung', 
        image: generateImage('Home', 'EA580C'),
        description: 'Đồ gia dụng thông minh'
      }
    ]);
    console.log('📁 Created', cats.length, 'categories');

    // ============ PRODUCTS ============
    const products = [
      {
        name: 'iPhone 15 Pro Max 256GB - Titan Tự Nhiên',
        slug: 'iphone-15-pro-max-256gb',
        description: 'iPhone 15 Pro Max với chip A17 Pro, khung titan, camera 48MP zoom 5x. Màn hình Super Retina XDR 6.7 inch với ProMotion 120Hz.',
        price: 29990000,
        salePrice: 28490000,
        images: [generateImage('iPhone 15', '1E40AF'), generateImage('Back', '1E3A8A')],
        category: cats[0]._id,
        brand: 'Apple',
        stock: 50,
        sold: 245,
        rating: 4.9,
        numReviews: 180,
        isFeatured: true,
        isActive: true,
        tags: ['iphone', 'apple', '5g', 'titan']
      },
      {
        name: 'Samsung Galaxy S24 Ultra 512GB',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Galaxy S24 Ultra với S Pen tích hợp, AI Galaxy, camera 200MP zoom 100x, màn hình Dynamic AMOLED 2X 6.8 inch.',
        price: 31990000,
        salePrice: 29990000,
        images: [generateImage('Galaxy S24', '059669')],
        category: cats[0]._id,
        brand: 'Samsung',
        stock: 35,
        sold: 156,
        rating: 4.8,
        numReviews: 120,
        isFeatured: true,
        isActive: true,
        tags: ['samsung', 'galaxy', '5g', 'spen']
      },
      {
        name: 'Xiaomi 14 Pro 12GB/256GB',
        slug: 'xiaomi-14-pro',
        description: 'Xiaomi 14 Pro với camera Leica, chip Snapdragon 8 Gen 3, sạc nhanh 120W.',
        price: 19990000,
        salePrice: 17990000,
        images: [generateImage('Xiaomi 14', 'DC2626')],
        category: cats[0]._id,
        brand: 'Xiaomi',
        stock: 80,
        sold: 320,
        rating: 4.7,
        numReviews: 95,
        isActive: true,
        tags: ['xiaomi', 'leica']
      },
      {
        name: 'MacBook Air M3 13 inch 8GB/256GB',
        slug: 'macbook-air-m3-13',
        description: 'MacBook Air với chip M3, màn hình Liquid Retina 13.6 inch, thời lượng pin lên đến 18 giờ.',
        price: 32990000,
        salePrice: 30990000,
        images: [generateImage('MacBook', '0F172A')],
        category: cats[1]._id,
        brand: 'Apple',
        stock: 25,
        sold: 89,
        rating: 5.0,
        numReviews: 67,
        isFeatured: true,
        isActive: true,
        tags: ['macbook', 'apple', 'm3']
      },
      {
        name: 'Dell XPS 15 9530 i7/16GB/512GB',
        slug: 'dell-xps-15-9530',
        description: 'Dell XPS 15 với màn hình OLED 3.5K, chip Intel Core i7 thế hệ 13, RTX 4060.',
        price: 45990000,
        salePrice: 41990000,
        images: [generateImage('Dell XPS', '1E40AF')],
        category: cats[1]._id,
        brand: 'Dell',
        stock: 15,
        sold: 42,
        rating: 4.7,
        numReviews: 38,
        isActive: true,
        tags: ['dell', 'xps', 'laptop']
      },
      {
        name: 'ASUS ROG Strix G16 Gaming',
        slug: 'asus-rog-strix-g16',
        description: 'Laptop gaming ASUS ROG với RTX 4060, i9-13980HX, màn hình 240Hz QHD+.',
        price: 39990000,
        images: [generateImage('ROG', 'DC2626')],
        category: cats[1]._id,
        brand: 'ASUS',
        stock: 20,
        sold: 65,
        rating: 4.8,
        numReviews: 52,
        isActive: true,
        tags: ['asus', 'rog', 'gaming']
      },
      {
        name: 'AirPods Pro 2 USB-C',
        slug: 'airpods-pro-2',
        description: 'AirPods Pro thế hệ 2 với chip H2, chống ồn chủ động, âm thanh không gian.',
        price: 5990000,
        salePrice: 5490000,
        images: [generateImage('AirPods', '8B5CF6')],
        category: cats[2]._id,
        brand: 'Apple',
        stock: 100,
        sold: 456,
        rating: 4.8,
        numReviews: 320,
        isFeatured: true,
        isActive: true,
        tags: ['airpods', 'tai nghe']
      },
      {
        name: 'Apple Watch Series 9 GPS 45mm',
        slug: 'apple-watch-series-9',
        description: 'Apple Watch Series 9 với chip S9, màn hình Always-On Retina, GPS.',
        price: 9990000,
        salePrice: 8990000,
        images: [generateImage('Watch', 'EC4899')],
        category: cats[2]._id,
        brand: 'Apple',
        stock: 60,
        sold: 234,
        rating: 4.8,
        numReviews: 187,
        isActive: true,
        tags: ['apple watch', 'smartwatch']
      },
      {
        name: 'Samsung Galaxy Buds3 Pro',
        slug: 'samsung-galaxy-buds3',
        description: 'Tai nghe không dây Samsung với chống ồn ANC, âm thanh 360 độ.',
        price: 4990000,
        images: [generateImage('Buds', '0EA5E9')],
        category: cats[2]._id,
        brand: 'Samsung',
        stock: 80,
        sold: 178,
        rating: 4.6,
        numReviews: 124,
        isActive: true,
        tags: ['buds', 'tai nghe']
      },
      {
        name: 'Áo thun nam Premium Cotton',
        slug: 'ao-thun-nam-premium',
        description: 'Áo thun nam chất liệu cotton 100% organic, form regular fit, nhiều màu.',
        price: 299000,
        salePrice: 199000,
        images: [generateImage('T-Shirt', '7C3AED')],
        category: cats[3]._id,
        brand: 'Local Brand',
        stock: 200,
        sold: 856,
        rating: 4.5,
        numReviews: 234,
        isFeatured: true,
        isActive: true,
        tags: ['ao thun', 'thoi trang nam']
      },
      {
        name: 'Quần Jean Nam Slim Fit',
        slug: 'quan-jean-nam-slim',
        description: 'Quần jean nam form slim fit, chất liệu denim co giãn, bền đẹp.',
        price: 699000,
        salePrice: 549000,
        images: [generateImage('Jeans', '1E40AF')],
        category: cats[3]._id,
        brand: 'Local Brand',
        stock: 150,
        sold: 432,
        rating: 4.6,
        numReviews: 187,
        isActive: true,
        tags: ['quan jean', 'thoi trang nam']
      },
      {
        name: 'Robot hút bụi Xiaomi Vacuum Mop 2 Pro',
        slug: 'xiaomi-vacuum-mop-2',
        description: 'Robot hút bụi lau nhà thông minh, lực hút 4000Pa, điều khiển qua app.',
        price: 8990000,
        salePrice: 6990000,
        images: [generateImage('Robot', '059669')],
        category: cats[4]._id,
        brand: 'Xiaomi',
        stock: 30,
        sold: 124,
        rating: 4.7,
        numReviews: 89,
        isActive: true,
        tags: ['robot', 'smart home']
      }
    ];
    await Product.insertMany(products);
    console.log('📦 Created', products.length, 'products');

    // ============ USERS ============
    await User.create({
      name: 'Admin MyShop',
      email: 'admin@myshop.com',
      password: 'Admin@123',
      isAdmin: true,
      phone: '0901234567',
      avatar: generateImage('A', 'DC2626')
    });

    await User.create({
      name: 'Nguyễn Văn A',
      email: 'user@myshop.com',
      password: 'User@123',
      phone: '0912345678',
      avatar: generateImage('U', '3B82F6'),
      address: { street: '123 Nguyễn Huệ', city: 'Hồ Chí Minh', district: 'Quận 1', ward: 'Bến Nghé' }
    });

    await User.create({
      name: 'Trần Thị B',
      email: 'tranthib@myshop.com',
      password: 'User@123',
      phone: '0923456789',
      avatar: generateImage('B', 'EC4899'),
      address: { street: '456 Lê Lợi', city: 'Hồ Chí Minh', district: 'Quận 3', ward: 'Bến Thành' }
    });

    console.log('👤 Created 3 users');

    // ============ BANNERS ============
    await Banner.insertMany([
      {
        title: 'Khuyến mãi lớn mùa hè - Giảm đến 50%',
        subtitle: 'Hàng ngàn sản phẩm giảm giá sốc',
        image: generateBanner('SUMMER SALE 50% OFF', 'DC2626'),
        link: '/products',
        buttonText: 'Mua ngay',
        position: 'home_top',
        order: 1,
        isActive: true
      },
      {
        title: 'iPhone 15 Series chính hãng',
        subtitle: 'Trả góp 0% - Thu cũ đổi mới',
        image: generateBanner('iPHONE 15 PRO MAX', '1E40AF'),
        link: '/products?search=iphone',
        buttonText: 'Khám phá',
        position: 'home_mid',
        order: 2,
        isActive: true
      },
      {
        title: 'Laptop Gaming - Làm việc & Giải trí',
        subtitle: 'Giảm thêm 2 triệu khi mua Online',
        image: generateBanner('GAMING LAPTOP', '059669'),
        link: '/products?category=' + cats[1]._id,
        buttonText: 'Xem ngay',
        position: 'home_bottom',
        order: 3,
        isActive: true
      }
    ]);
    console.log('🖼️  Created 3 banners');

    console.log('\n=================================');
    console.log('✅ SEED THÀNH CÔNG!');
    console.log('=================================');
    console.log('📧 Admin:  admin@myshop.com  / Admin@123');
    console.log('📧 User 1: user@myshop.com   / User@123');
    console.log('📧 User 2: tranthib@myshop.com / User@123');
    console.log('=================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    console.error(err);
    process.exit(1);
  }
})();
