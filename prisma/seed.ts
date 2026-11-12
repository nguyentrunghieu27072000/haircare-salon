/**
 * Sample data for local development. Run with `npm run db:seed`.
 * Does nothing when service categories already exist.
 */
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient();

async function main() {
  if (await prisma.serviceCategory.count()) {
    console.log('Database already seeded, nothing to do.');
    return;
  }

  await prisma.serviceCategory.create({
    data: {
      name: 'Cắt tóc',
      order: 1,
      services: {
        create: [
          { name: 'Cắt tóc nam', description: 'Cắt, tạo kiểu theo yêu cầu', price: 100_000 },
          { name: 'Cắt tóc + gội', description: 'Combo cắt tóc và gội đầu thư giãn', price: 150_000 },
        ],
      },
    },
  });
  await prisma.serviceCategory.create({
    data: {
      name: 'Gội massage',
      order: 2,
      services: {
        create: [
          { name: 'Gội massage 20 phút', description: 'Gội đầu, massage vai gáy', price: 80_000 },
          { name: 'Gội massage 40 phút', description: 'Gội đầu, massage vai gáy, đắp mặt nạ', price: 120_000 },
        ],
      },
    },
  });
  await prisma.serviceCategory.create({
    data: {
      name: 'Uốn / Nhuộm',
      order: 3,
      services: {
        create: [
          { name: 'Uốn tóc', description: 'Uốn Hàn Quốc, giữ nếp lâu', price: 400_000 },
          { name: 'Nhuộm tóc', description: 'Nhuộm thời trang, thuốc nhuộm cao cấp', price: 350_000 },
        ],
      },
    },
  });
  await prisma.serviceCategory.create({
    data: {
      name: 'Dịch vụ thêm',
      order: 4,
      multiSelect: true,
      services: {
        create: [
          { name: 'Cạo mặt', description: 'Cạo mặt, tỉa lông mày', price: 30_000 },
          { name: 'Lấy ráy tai', description: 'Lấy ráy tai nhẹ nhàng', price: 30_000 },
          { name: 'Vuốt sáp tạo kiểu', description: 'Tạo kiểu với sáp cao cấp', price: 20_000 },
        ],
      },
    },
  });

  await prisma.productCategory.create({
    data: {
      name: 'Sáp vuốt tóc',
      image: 'products_1_icon_1.jpg',
      products: {
        create: [
          {
            name: 'Sáp vuốt tóc Clay giữ nếp 24h',
            price: 237_000,
            image: 'product1.jpg',
            info: 'Trọng lượng 100g. Xuất xứ: Việt Nam.',
            description: 'Sáp mờ, độ giữ nếp cao, dễ gội sạch.',
            usage: 'Lấy một lượng nhỏ, xoa đều lòng bàn tay rồi vuốt lên tóc khô.',
          },
          {
            name: 'Pomade gốc nước bóng nhẹ',
            price: 189_000,
            image: 'product2.jpg',
            info: 'Trọng lượng 85g. Xuất xứ: Mỹ.',
            description: 'Bóng nhẹ, giữ nếp trung bình, hương thơm dịu.',
            usage: 'Dùng trên tóc hơi ẩm để dễ tạo kiểu.',
          },
        ],
      },
    },
  });
  await prisma.productCategory.create({
    data: {
      name: 'Dầu gội',
      image: 'product1.jpg',
      products: {
        create: [
          {
            name: 'Dầu gội dưỡng tóc bạc hà',
            price: 159_000,
            image: 'product1.jpg',
            info: 'Dung tích 300ml.',
            description: 'Làm sạch sâu, mát lạnh, giảm gàu.',
            usage: 'Gội 2-3 lần/tuần, massage nhẹ rồi xả sạch.',
          },
          {
            name: 'Dầu xả phục hồi tóc hư tổn',
            price: 175_000,
            image: 'product2.jpg',
            info: 'Dung tích 300ml.',
            description: 'Phục hồi tóc khô xơ sau uốn, nhuộm.',
            usage: 'Thoa lên thân và ngọn tóc, để 3 phút rồi xả.',
          },
        ],
      },
    },
  });
  await prisma.productCategory.create({
    data: {
      name: 'Chăm sóc da',
      image: 'product2.jpg',
      products: {
        create: [
          {
            name: 'Sữa rửa mặt than hoạt tính',
            price: 120_000,
            image: 'product1.jpg',
            info: 'Dung tích 100ml.',
            description: 'Làm sạch bã nhờn, se khít lỗ chân lông.',
            usage: 'Dùng sáng và tối, massage 1 phút rồi rửa sạch.',
          },
          {
            name: 'Lăn khử mùi 48h',
            price: 95_000,
            image: 'product2.jpg',
            info: 'Dung tích 50ml.',
            description: 'Ngăn mồ hôi và mùi cơ thể suốt 48 giờ.',
            usage: 'Lăn đều lên vùng da khô sạch.',
          },
        ],
      },
    },
  });

  console.log('Seeded sample services and products.');
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
