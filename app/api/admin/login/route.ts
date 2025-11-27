import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { checkRateLimit, getIP, resetRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // التحقق من البيانات
    if (!email || !password) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      );
    }

    // Rate limiting بناءً على IP
    const ip = getIP(request);
    const rateLimitKey = `login:${ip}:${email}`;
    const rateLimit = checkRateLimit(rateLimitKey, {
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000,
      lockDurationMs: 30 * 60 * 1000,
    });

    if (!rateLimit.allowed) {
      const minutesLeft = rateLimit.lockedUntil
        ? Math.ceil((rateLimit.lockedUntil - Date.now()) / 60000)
        : 0;

      return NextResponse.json(
        {
          error: `تم تجاوز عدد المحاولات المسموح بها. يرجى المحاولة بعد ${minutesLeft} دقيقة`,
        },
        { status: 429 }
      );
    }

    // البحث عن المدير
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // التحقق من حالة الحساب
    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'هذا الحساب معطل. يرجى التواصل مع المسؤول' },
        { status: 403 }
      );
    }

    // التحقق من القفل
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (admin.lockedUntil.getTime() - Date.now()) / 60000
      );
      return NextResponse.json(
        {
          error: `الحساب مقفل مؤقتاً. يرجى المحاولة بعد ${minutesLeft} دقيقة`,
        },
        { status: 403 }
      );
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await verifyPassword(password, admin.password);

    if (!isPasswordValid) {
      // زيادة عدد المحاولات الفاشلة
      const loginAttempts = admin.loginAttempts + 1;
      const shouldLock = loginAttempts >= 5;

      await prisma.admin.update({
        where: { id: admin.id },
        data: {
          loginAttempts,
          lockedUntil: shouldLock
            ? new Date(Date.now() + 30 * 60 * 1000)
            : null,
        },
      });

      if (shouldLock) {
        return NextResponse.json(
          {
            error: 'تم قفل الحساب لمدة 30 دقيقة بسبب المحاولات الفاشلة المتكررة',
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          error: `البريد الإلكتروني أو كلمة المرور غير صحيحة. المحاولات المتبقية: ${
            5 - loginAttempts
          }`,
        },
        { status: 401 }
      );
    }

    // تسجيل دخول ناجح
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date(),
      },
    });

    // إعادة تعيين rate limit
    resetRateLimit(rateLimitKey);

    // إنشاء response مع cookie
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    // إضافة session cookie
    response.cookies.set('admin-session', admin.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    );
  }
}
