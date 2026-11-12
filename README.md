# Haircare Salon

Website cho tiệm làm tóc: khách **đặt lịch dịch vụ** và **mua sản phẩm** (giỏ hàng, thanh toán), có đăng nhập bằng số điện thoại.

Viết lại từ dự án Laravel `my-blog` sang **NestJS 12 + Prisma + MongoDB**, giao diện render trên server bằng Handlebars (giữ nguyên template `haircare`).

## Chạy dự án

```bash
# 1. MongoDB (replica set 1 node — Prisma cần replica set)
docker compose up -d
#    Nếu máy đã có MongoDB replica set chạy ở cổng 27017 thì bỏ qua bước này.

# 2. Cấu hình
cp .env.example .env   # sửa DATABASE_URL nếu cần

# 3. Cài đặt, tạo collection và dữ liệu mẫu
npm install            # cũng chạy `prisma generate`
npm run db:push        # tạo collection + index theo prisma/schema.prisma
npm run db:seed        # dữ liệu mẫu (bỏ qua nếu DB đã có dữ liệu)

# 4. Chạy
npm run start:dev      # http://localhost:3000
```

## Cấu trúc

```
prisma/schema.prisma  mô hình dữ liệu (MongoDB)
prisma/seed.ts        dữ liệu mẫu
public/               assets tĩnh (template haircare, css, js phía client)
views/
  layouts/main.hbs    layout chung (menu, giỏ hàng, modal đăng nhập, footer)
  web/*.hbs           các trang khách hàng
  admin/login.hbs     trang đăng nhập admin (chưa có chức năng)
src/
  main.ts             cấu hình Express: static, hbs, session, res.locals
  common/             hbs helpers, session typing, ObjectId pipe, middleware đưa session vào view
  generated/prisma/   Prisma Client (sinh ra bởi `prisma generate`, không commit)
  prisma/             PrismaService (global)
  pages/              trang chủ, admin
  booking/            đặt lịch       GET /Booking, POST /completebooking
  store/              cửa hàng       GET /Store, /collections?sp=, /product-details?id=
  cart/               giỏ hàng       GET /Add-Cart/:id/:num, /Shooping-Cart, /Checkout, ...
  auth/               đăng nhập      GET /Check-User, POST /Login, POST /Add-Account, GET /Logout
```

URL được giữ y hệt bản Laravel để JS phía client (`public/js/*.js`) chỉ phải đổi tên field.

## Mô hình dữ liệu

| Model             | Ghi chú                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `ServiceCategory` | nhóm dịch vụ; `multiSelect = true` cho phép chọn nhiều dịch vụ cùng lúc |
| `Service`         | dịch vụ, giá VND                                                     |
| `Booking`         | lịch đặt: giờ hẹn, tổng tiền, danh sách `serviceIds`, tiện ích miễn phí |
| `ProductCategory` / `Product` | cửa hàng                                                 |
| `User`            | khách hàng, đăng nhập bằng số điện thoại, mật khẩu hash scrypt       |
| `CartItem`        | giỏ hàng lưu DB của khách đã đăng nhập (khách vãng lai dùng session) |

## Lệnh

```bash
npm run start:dev   # dev, tự reload
npm run build && npm run start:prod
npm test            # unit test (vitest)
npm run lint
npm run db:generate # sinh lại Prisma Client sau khi sửa schema
npm run db:push     # đồng bộ schema lên MongoDB
npm run db:seed     # dữ liệu mẫu
```

## Ghi chú

- Prisma 6.x được dùng vì Prisma 7 chưa hỗ trợ MongoDB (bản 8 có nhưng còn RC).
- Xác thực OTP khi đăng ký dùng Firebase phía client (`public/js/main2.js`), cấu hình Firebase nằm trong file đó.
- Trang admin mới chỉ có giao diện đăng nhập, chưa có nghiệp vụ.
# haircare-salon-
