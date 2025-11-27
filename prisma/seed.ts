import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء إضافة البيانات الوهمية...');

  // حذف البيانات القديمة
  await prisma.activityLog.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // إنشاء Super Admin
  console.log('🔐 إنشاء Super Admin...');
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@hoorstylish.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log('✅ تم إنشاء Super Admin');
  console.log('   📧 Email:', admin.email);
  console.log('   🔑 Password: Admin@123');
  console.log('   👑 Role:', admin.role);


  // إنشاء التصنيفات
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'عبايات',
        slug: 'abayat',
        description: 'عبايات فاخرة بتصاميم عصرية ومحتشمة',
      },
    }),
    prisma.category.create({
      data: {
        name: 'حجاب وطرح',
        slug: 'hijab-tarh',
        description: 'طرح وحجابات بألوان وتصاميم متنوعة',
      },
    }),
    prisma.category.create({
      data: {
        name: 'نقاب',
        slug: 'niqab',
        description: 'نقاب بتصاميم أنيقة ومريحة',
      },
    }),
    prisma.category.create({
      data: {
        name: 'فساتين محتشمة',
        slug: 'modest-dresses',
        description: 'فساتين محتشمة للمناسبات المختلفة',
      },
    }),
    prisma.category.create({
      data: {
        name: 'جلابيات',
        slug: 'jalabiyas',
        description: 'جلابيات مريحة وأنيقة للارتداء اليومي',
      },
    }),
  ]);

  console.log('✅ تم إنشاء التصنيفات');

  // إنشاء المنتجات
  const products = await Promise.all([
    // عبايات
    prisma.product.create({
      data: {
        name: 'عباية سوداء كلاسيكية',
        slug: 'classic-black-abaya',
        description: 'عباية سوداء فاخرة بقصة كلاسيكية أنيقة، مصنوعة من قماش عالي الجودة',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1583846112903-f6b16c345564?w=500',
        stock: 25,
        featured: true,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'عباية مطرزة بالذهبي',
        slug: 'gold-embroidered-abaya',
        description: 'عباية راقية مطرزة بخيوط ذهبية على الأكمام والياقة',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500',
        stock: 15,
        featured: true,
        categoryId: categories[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'عباية كشمير فاخرة',
        slug: 'luxury-cashmere-abaya',
        description: 'عباية من الكشمير الفاخر، مثالية للشتاء',
        price: 449.99,
        image: 'https://images.unsplash.com/photo-1585487000160-ff0a34e43c2b?w=500',
        stock: 10,
        featured: false,
        categoryId: categories[0].id,
      },
    }),

    // حجاب وطرح
    prisma.product.create({
      data: {
        name: 'طرحة حرير فاخرة',
        slug: 'luxury-silk-hijab',
        description: 'طرحة من الحرير الطبيعي بألوان زاهية',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1601924357840-3c6b3c2b2ecb?w=500',
        stock: 50,
        featured: true,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'حجاب قطني يومي',
        slug: 'daily-cotton-hijab',
        description: 'حجاب قطني مريح للاستخدام اليومي، متوفر بعدة ألوان',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1610846921273-f8d5d7e1f76d?w=500',
        stock: 100,
        featured: false,
        categoryId: categories[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'طرحة شيفون مزخرفة',
        slug: 'decorated-chiffon-scarf',
        description: 'طرحة شيفون خفيفة مزينة بتطريز جميل',
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500',
        stock: 35,
        featured: false,
        categoryId: categories[1].id,
      },
    }),

    // نقاب
    prisma.product.create({
      data: {
        name: 'نقاب ثلاث طبقات',
        slug: 'three-layer-niqab',
        description: 'نقاب عملي بثلاث طبقات، مريح وأنيق',
        price: 39.99,
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500',
        stock: 40,
        featured: false,
        categoryId: categories[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'نقاب حرير فاخر',
        slug: 'luxury-silk-niqab',
        description: 'نقاب من الحرير الناعم بتصميم راقي',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500',
        stock: 20,
        featured: true,
        categoryId: categories[2].id,
      },
    }),

    // فساتين محتشمة
    prisma.product.create({
      data: {
        name: 'فستان سهرة محتشم',
        slug: 'modest-evening-dress',
        description: 'فستان سهرة طويل محتشم بتصميم أنيق للمناسبات',
        price: 349.99,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
        stock: 12,
        featured: true,
        categoryId: categories[3].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'فستان يومي كاجوال',
        slug: 'daily-casual-dress',
        description: 'فستان محتشم مريح للارتداء اليومي',
        price: 129.99,
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500',
        stock: 30,
        featured: false,
        categoryId: categories[3].id,
      },
    }),

    // جلابيات
    prisma.product.create({
      data: {
        name: 'جلابية قطنية مريحة',
        slug: 'comfortable-cotton-jalabiya',
        description: 'جلابية قطنية فضفاضة مريحة للمنزل',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=500',
        stock: 45,
        featured: false,
        categoryId: categories[4].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'جلابية مخملية فاخرة',
        slug: 'luxury-velvet-jalabiya',
        description: 'جلابية من المخمل الفاخر بتطريز راقي',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500',
        stock: 18,
        featured: true,
        categoryId: categories[4].id,
      },
    }),
  ]);

  console.log('✅ تم إنشاء المنتجات');
  console.log(`📦 تم إضافة ${categories.length} تصنيفات و ${products.length} منتج`);
  console.log('✨ اكتملت عملية إضافة البيانات بنجاح!');
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إضافة البيانات:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
