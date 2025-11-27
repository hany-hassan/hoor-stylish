import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
    }

    // Convert Decimals to numbers
    const orderWithNumbers = {
      ...order,
      totalAmount: Number(order.totalAmount),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        price: Number(item.price),
        product: {
          ...item.product,
          price: Number(item.product.price),
        },
      })),
    };

    return NextResponse.json(orderWithNumbers);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'خطأ في جلب تفاصيل الطلب' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'الحالة مطلوبة' }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Log activity
    const { logActivity } = await import('@/lib/logger');
    await logActivity('تحديث طلب', `تم تحديث حالة الطلب #${id.slice(-6)} إلى ${status}`);

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        totalAmount: Number(order.totalAmount),
        orderItems: order.orderItems.map((item) => ({
          ...item,
          price: Number(item.price),
          product: {
            ...item.product,
            price: Number(item.product.price),
          },
        })),
      },
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'فشل تحديث حالة الطلب' }, { status: 500 });
  }
}
