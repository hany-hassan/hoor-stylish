import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hasPermission, Permission, Role } from '@/lib/permissions';

// تشفير كلمة المرور
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// التحقق من كلمة المرور
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * نوع بيانات المستخدم الحالي
 */
export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  permissions?: Permission[];
}

// الحصول على بيانات المدير من الجلسة
export async function getAdminSession(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin-session');
  
  if (!sessionCookie) {
    return null;
  }

  try {
    const adminId = sessionCookie.value;
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        permissions: true,
        isActive: true,
      },
    });

    if (!admin || !admin.isActive) {
      return null;
    }

    // تحويل permissions من JSON string إلى array
    let customPermissions: Permission[] | undefined;
    if (admin.permissions) {
      try {
        customPermissions = JSON.parse(admin.permissions);
      } catch (e) {
        console.warn('Failed to parse admin permissions:', admin.id);
      }
    }

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role as Role,
      permissions: customPermissions,
    };
  } catch (error) {
    console.error('Failed to get admin session:', error);
    return null;
  }
}

// إنشاء جلسة للمدير
export async function createAdminSession(adminId: string) {
  const cookieStore = await cookies();
  cookieStore.set('admin-session', adminId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// حذف جلسة المدير (تسجيل الخروج)
export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-session');
}

// التحقق من تسجيل الدخول (الدالة القديمة للتوافقية)
export async function requireAdmin() {
  const admin = await getAdminSession();
  if (!admin) {
    throw new Error('Unauthorized');
  }
  return admin;
}

/**
 * Middleware للتحقق من تسجيل الدخول (النسخة الجديدة)
 */
export async function requireAuth(): Promise<CurrentUser | NextResponse> {
  const user = await getAdminSession();

  if (!user) {
    return NextResponse.json(
      { error: 'غير مصرح. يرجى تسجيل الدخول' },
      { status: 401 }
    );
  }

  return user;
}

/**
 * Middleware للتحقق من الصلاحية
 * @param requiredPermission الصلاحية المطلوبة
 */
export async function requirePermission(
  requiredPermission: Permission
): Promise<CurrentUser | NextResponse> {
  const userOrResponse = await requireAuth();

  // إذا كان Response (غير مسجل دخول)
  if (userOrResponse instanceof NextResponse) {
    return userOrResponse;
  }

  const user = userOrResponse as CurrentUser;

  // تحقق من الصلاحية
  if (!hasPermission(user.role, requiredPermission, user.permissions)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Permission denied:', {
        userId: user.id,
        userRole: user.role,
        requiredPermission,
      });
    }

    return NextResponse.json(
      { error: 'ليس لديك صلاحية للقيام بهذا الإجراء' },
      { status: 403 }
    );
  }

  return user;
}

/**
 * Middleware للتحقق من أحد الأدوار
 * @param allowedRoles الأدوار المسموح بها
 */
export async function requireRole(
  ...allowedRoles: Role[]
): Promise<CurrentUser | NextResponse> {
  const userOrResponse = await requireAuth();

  // إذا كان Response (غير مسجل دخول)
  if (userOrResponse instanceof NextResponse) {
    return userOrResponse;
  }

  const user = userOrResponse as CurrentUser;

  // تحقق من الدور
  if (!allowedRoles.includes(user.role)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Role check failed:', {
        userId: user.id,
        userRole: user.role,
        allowedRoles,
      });
    }

    return NextResponse.json(
      { error: 'ليس لديك صلاحية الوصول لهذا المورد' },
      { status: 403 }
    );
  }

  return user;
}

/**
 * مساعد لاستخراج المستخدم من نتيجة middleware
 */
export function extractUser(
  userOrResponse: CurrentUser | NextResponse
): { user: CurrentUser | null; response: NextResponse | null } {
  if (userOrResponse instanceof NextResponse) {
    return { user: null, response: userOrResponse };
  }
  return { user: userOrResponse, response: null };
}
