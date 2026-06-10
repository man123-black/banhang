require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/models/Product');
const Category = require('./src/models/Category');
const User = require('./src/models/User');
const Banner = require('./src/models/Banner');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    await Banner.deleteMany({});

    const cats = await Category.insertMany([
      { name: 'Điện thoại', slug: 'dien-thoai', image: 'https://via.placeholder.com/100?text=Phone' },
      { name: 'Laptop', slug: 'laptop', image: 'https://via.placeholder.com/100?text=Laptop' },
      { name: 'Phụ kiện', slug: 'phu-kien', image: 'https://via.placeholder.com/100?text=Accessory' },
      { name: 'Thời trang', slug: 'thoi-trang', image: 'https://via.placeholder.com/100?text=Fashion' }
    ]);

    const products = [
      { name: 'iPhone 15 Pro Max 256GB', slug: 'iphone-15-pro-max', price: 29990000, salePrice: 28990000, images: ['https://via.placeholder.com/300?text=iPhone15'], category: cats[0]._id, stock: 50, sold: 120, rating: 4.9, numReviews: 245, description: 'iPhone 15 Pro Max - Titan tự nhiên, chip A17 Pro', brand: 'Apple', tags: ['iphone', 'apple', '5g'] },
      { name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24-ultra', price: 31990000, salePrice: 29990000, images: ['https://via.placeholder.com/300?text=Galaxy+S24'], category: cats[0]._id, stock: 30, sold: 80, rating: 4.8, numReviews: 180, description: 'Galaxy S24 Ultra với S Pen và AI', brand: 'Samsung', tags: ['samsung', 'galaxy', '5g'] },
      { name: 'MacBook Air M3 13 inch', slug: 'macbook-air-m3', price: 32990000, images: ['https://via.placeholder.com/300?text=MacBook+Air'], category: cats[1]._id, stock: 20, sold: 50, rating: 5.0, numReviews: 95, description: 'MacBook Air M3 - Mỏng nhẹ, mạnh mẽ', brand: 'Apple', tags: ['macbook', 'apple', 'laptop'] },
      { name: 'Dell XPS 15', slug: 'dell-xps-15', price: 45990000, salePrice: 41990000, images: ['https://via.placeholder.com/300?text=Dell+XPS'], category: cats[1]._id, stock: 15, sold: 30, rating: 4.7, numReviews: 60, description: 'Dell XPS 15 - Laptop cao cấp cho dân chuyên nghiệp', brand: 'Dell', tags: ['dell', 'laptop', 'xps'] },
      { name: 'AirPods Pro 2', slug: 'airpods-pro-2', price: 5990000, images: ['https://via.placeholder.com/300?text=AirPods+Pro'], category: cats[2]._id, stock: 100, sold: 200, rating: 4.7, numReviews: 320, description: 'AirPods Pro 2 với chống ồn chủ động', brand: 'Apple', tags: ['airpods', 'tai nghe'] },
      { name: 'Apple Watch Series 9', slug: 'apple-watch-9', price: 9990000, salePrice: 8990000, images: ['https://via.placeholder.com/300?text=Apple+Watch'], category: cats[2]._id, stock: 60, sold: 150, rating: 4.8, numReviews: 210, description: 'Apple Watch Series 9 - GPS + Cellular', brand: 'Apple', tags: ['apple watch', 'smartwatch'] },
      { name: 'Áo thun nam basic', slug: 'ao-thun-nam-basic', price: 199000, salePrice: 149000, images: ['https://via.placeholder.com/300?text=T-Shirt'], category: cats[3]._id, stock: 200, sold: 500, rating: 4.5, numReviews: 150, description: 'Áo thun cotton 100% thoáng mát', brand: 'Local', tags: ['ao thun', 'thoi trang nam'] },
      { name: 'Quần jean nam', slug: 'quan-jean-nam', price: 599000, images: ['https://via.placeholder.com/300?text=Jeans'], category: cats[3]._id, stock: 100, sold: 250, rating: 4.6, numReviews: 85, description: 'Quần jean nam form slim fit', brand: 'Local', tags: ['quan jean', 'thoi trang nam'] }
    ];
    await Product.insertMany(products);

    await User.create({ name: 'Admin MyShop', email: 'admin@myshop.com', password: 'Admin@123', isAdmin: true, phone: '0901234567' });
    await User.create({ name: 'Nguyễn Văn A', email: 'user@myshop.com', password: 'User@123', phone: '0912345678', address: { street: '123 Nguyễn Huệ', city: 'Hồ Chí Minh' } });

    await Banner.insertMany([
      { title: 'Khuyến mãi lớn mùa hè', image: 'https://via.placeholder.com/1200x300?text=Summer+Sale', link: '/products?category=thoi-trang', position: 'home_top' },
      { title: 'iPhone giá sốc', image: 'https://via.placeholder.com/1200x300?text=iPhone+Sale', link: '/products?search=iphone', position: 'home_mid' }
    ]);

    console.log('✅ Seed thành công!');
    console.log('📧 Admin: admin@myshop.com / Admin@123');
    console.log('📧 User: user@myshop.com / User@123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    process.exit(1);
  }
})();
