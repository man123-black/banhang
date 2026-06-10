# 🛒 MyShop E-commerce Pro

## Yêu cầu
- Docker & Docker Compose
- Node.js 18+ (nếu chạy local)

## Cài đặt nhanh
```bash
# 1. Tạo file .env
cp backend/.env.example backend/.env

# 2. Chạy Docker
docker-compose up -d --build

# 3. Seed dữ liệu mẫu
docker-compose exec backend node seed.js
