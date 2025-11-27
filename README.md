# Hoor Stylish - متجر الأزياء الإسلامية

متجر إلكتروني عصري للأزياء الإسلامية مبني بـ Next.js 16 و Prisma.

## ✨ المميزات

- 🛍️ واجهة عصرية وسريعة
- 🔐 نظام صلاحيات متقدم (Super Admin, Admin, Editor)  
- 🛡️ حماية قوية مع Rate Limiting وAccount Locking
- 📊 لوحة تحكم احترافية
- 🌐 دعم كامل للغة العربية (RTL)
- 📱 تصميم متجاوب (Responsive)

## 🚀 التقنيات المستخدمة

- **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (Development), PostgreSQL (Production)
- **ORM**: Prisma
- **Authentication**: Custom JWT-less session system
- **Security**: bcryptjs, Rate Limiting, Permission-based access

## 📦 التثبيت المحلي

### المتطلبات

- Node.js 18+ 
- npm أو yarn

### خطوات التثبيت

```bash
# 1. استنساخ المشروع
git clone https://github.com/hany-php/hoor-stylish.git
cd hoor-stylish

# 2. تثبيت المكتبات
npm install

# 3. إعداد قاعدة البيانات
cp .env.example .env
npx prisma generate
npx prisma migrate dev

# 4. إضافة بيانات تجريبية
npm run db:seed

# 5. تشغيل المشروع
npm run dev
```

المشروع سيعمل على: http://localhost:3000

## 🔑 بيانات تسجيل الدخول الافتراضية

- **Email**: `admin@hoorstylish.com`
- **Password**: `Admin@123`
- **Role**: Super Admin

⚠️ **مهم**: قم بتغيير كلمة المرور في بيئة الإنتاج!

## 🌐 Deployment على Vercel

### الخطوة 1: تجهيز المشروع

```bash
# تأكد من أن جميع التغييرات محفوظة
git add .
git commit -m "Ready for deployment"
git push origin main
```

### الخطوة 2: إنشاء حساب Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخول بـ GitHub
3. اضغط "Import Project"
4. اختر `hoor-stylish` repository

### الخطوة 3: إعداد Environment Variables

في لوحة تحكم Vercel، أضف المتغيرات التالية:

```
DATABASE_URL="postgresql://user:password@host:5432/database"
NODE_ENV="production"
```

### الخطوة 4: Deploy!

Vercel سيقوم بـ:
- ✅ تثبيت المكتبات تلقائياً
- ✅ Build المشروع
- ✅ Deploy تلقائياً

## 📁 هيكل المشروع

```
hoor-stylish/
├── app/                    # Next.js App Router
│   ├── admin/             # لوحة التحكم
│   ├── api/               # API Routes
│   ├── products/          # صفحات المنتجات
│   └── ...
├── lib/                   # Utilities & Helpers
│   ├── auth.ts           # Authentication logic
│   ├── permissions.ts    # Permission system
│   ├── rate-limit.ts     # Rate limiting
│   └── prisma.ts         # Prisma client
├── prisma/               # Database
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
└── public/               # Static files
```

## 🔒 نظام الصلاحيات

### الأدوار

| الدور | الصلاحيات |
|------|-----------|
| **Super Admin** | صلاحيات كاملة، إدارة المديرين |
| **Admin** | إدارة المنتجات والطلبات والتقارير |
| **Editor** | عرض وتعديل المنتجات فقط |

### الصلاحيات المتاحة

- `MANAGE_ADMINS` - إدارة المديرين
- `CREATE_PRODUCT` - إضافة منتجات
- `EDIT_PRODUCT` - تعديل منتجات
- `DELETE_PRODUCT` - حذف منتجات
- `CREATE_CATEGORY` - إضافة تصنيفات
- `UPDATE_ORDER_STATUS` - تحديث حالة الطلبات
- وغيرها...

## 🛡️ الأمان

- ✅ **Rate Limiting**: 5 محاولات / 15 دقيقة
- ✅ **Account Locking**: قفل تلقائي بعد 5 محاولات فاشلة
- ✅ **Password Hashing**: bcryptjs
- ✅ **Session Management**: Secure HTTP-only cookies
- ✅ **Permission-based Access Control**: RBAC system

## 📝 Scripts المتاحة

```bash
npm run dev          # تشغيل Development server
npm run build        # Build للإنتاج
npm start            # تشغيل Production server
npm run db:migrate   # تشغيل Database migrations
npm run db:seed      # إضافة بيانات تجريبية
npm run db:studio    # فتح Prisma Studio
```

## 🐛 Troubleshooting

### المشروع لا يعمل بعد التثبيت؟

```bash
# حذف node_modules وإعادة التثبيت
rm -rf node_modules package-lock.json
npm install

# إعادة generate Prisma Client
npx prisma generate
```

### مشكلة في قاعدة البيانات؟

```bash
# إعادة تعيين قاعدة البيانات
rm prisma/dev.db
npx prisma migrate dev
npm run db:seed
```

## 📄 License

MIT License - يمكنك استخدام المشروع بحرية

## 👨‍💻 المطور

تم التطوير بواسطة فريق Hoor Stylish

---

Made with ❤️ for the Islamic Fashion Community