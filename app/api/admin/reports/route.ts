import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Get total revenue
    const orders = await prisma.order.findMany({
      where: { status: { not: 'cancelled' } }, // Exclude cancelled orders
      include: { orderItems: { include: { product: true } } },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

    // 2. Get sales data for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrders = orders.filter(
      (order) => new Date(order.createdAt) >= sevenDaysAgo
    );

    const salesData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const dayTotal = recentOrders
        .filter((order) => new Date(order.createdAt).toDateString() === date.toDateString())
        .reduce((sum, order) => sum + Number(order.totalAmount), 0);

      salesData.push({ date: dateString, total: dayTotal });
    }

    // 3. Get top products
    const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        const productId = item.productId;
        if (!productSales[productId]) {
          productSales[productId] = {
            name: item.product.name,
            sales: 0,
            revenue: 0,
          };
        }
        productSales[productId].sales += item.quantity;
        productSales[productId].revenue += Number(item.price) * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return NextResponse.json({
      totalRevenue,
      salesData,
      topProducts,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
