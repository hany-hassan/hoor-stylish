import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: { orderItems: true },
        },
      },
    });

    // Convert Decimal to number
    const ordersWithNumbers = orders.map(order => ({
      ...order,
      totalAmount: Number(order.totalAmount),
    }));

    return NextResponse.json(ordersWithNumbers);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'خطأ في جلب الطلبات' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, address, city, items } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !address || !city || !items || items.length === 0) {
      return NextResponse.json({ error: 'جميع الحقول مطلوبة' }, { status: 400 });
    }

    // Calculate total amount
    const totalAmount = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    // Create order with order items
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        address,
        city,
        totalAmount,
        orderItems: {
          create: items.map((item: { productId: string; quantity: number; price: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      order: {
        ...order,
        totalAmount: Number(order.totalAmount),
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'خطأ في إنشاء الطلب' }, { status: 500 });
  }
}
