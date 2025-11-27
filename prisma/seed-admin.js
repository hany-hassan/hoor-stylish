const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 إنشاء مستخدم مدير افتراضي...');

  // حذف المديرين القدامى إن وجدوا
  await prisma.admin.deleteMany();

  // تشفير كلمة المرور
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  // إنشاء مدير افتراضي
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@hoorstylish.com',
      password: hashedPassword,
      name: 'المدير العام',
    },
  });

  console.log('✅ تم إنشاء مستخدم المدير بنجاح!');
  console.log('📧 البريد الإلكتروني:', admin.email);
  console.log('🔑 كلمة المرور: Admin@123');
  console.log('⚠️  تذكير: قم بتغيير كلمة المرور في بيئة الإنتاج!');
}

main()
  .catch((e) => {
    console.error('❌ خطأ في إنشاء المدير:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
