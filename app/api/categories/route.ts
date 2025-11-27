import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'خطأ في جلب التصنيفات' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'الاسم والرابط مطلوبان' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
      },
    });

    // Log activity
    const { logActivity } = await import('@/lib/logger');
    await logActivity('إضافة تصنيف', `تم إضافة التصنيف: ${name}`);

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'اسم التصنيف أو الرابط موجود بالفعل' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'فشل إنشاء التصنيف' },
      { status: 500 }
    );
  }
}
