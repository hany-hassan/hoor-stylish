import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🔐 إنشاء Super Admin افتراضي...');

  // حذف المدير القديم إذا كان موجوداً
  await prisma.admin.deleteMany({
    where: { email: 'admin@hoorstylish.com' },
  });

  const hashedPassword = await hashPassword('Admin@123');

  const admin = await prisma.admin.create({
    data: {
      email: 'admin@hoorstylish.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log('✅ تم إنشاء Super Admin بنجاح!');
  console.log('📧 البريد الإلكتروني:', admin.email);
  console.log('🔑 كلمة المرور: Admin@123');
  console.log('👑 الدور:', admin.role);
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
