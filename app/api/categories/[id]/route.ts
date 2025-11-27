import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'التصنيف غير موجود' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'خطأ في جلب التصنيف' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description } = body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
      },
    });

    // Log activity
    const { logActivity } = await import('@/lib/logger');
    await logActivity('تحديث تصنيف', `تم تحديث التصنيف: ${name}`);

    return NextResponse.json(category);
  } catch (error: any) {
    console.error('Error updating category:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'اسم التصنيف أو الرابط موجود بالفعل' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if category has products
    const categoryCheck = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (categoryCheck && categoryCheck._count.products > 0) {
      return NextResponse.json(
        { error: 'لا يمكن حذف تصنيف يحتوي على منتجات' },
        { status: 400 }
      );
    }

    // Get category name for logging
    const category = await prisma.category.findUnique({
      where: { id },
      select: { name: true },
    });

    await prisma.category.delete({
      where: { id },
    });

    // Log activity
    if (category) {
      const { logActivity } = await import('@/lib/logger');
      await logActivity('حذف تصنيف', `تم حذف التصنيف: ${category.name}`);
    }

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
