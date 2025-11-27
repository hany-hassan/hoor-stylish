import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // تجاهل صفحة تسجيل الدخول والملفات الثابتة والـ API routes
  const path = request.nextUrl.pathname;
  
  if (
    path.startsWith('/admin/login') ||
    path.startsWith('/api/') ||
    path.startsWith('/_next/') ||
    path.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // التحقق من الجلسة لصفحات المدير
  if (path.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('admin-session');
    
    if (!sessionCookie || !sessionCookie.value) {
      // إعادة التوجيه لصفحة تسجيل الدخول
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
