import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentAdmin = await getAdminSession();

    if (!currentAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (currentAdmin.id === id) {
      return NextResponse.json(
        { error: 'لا يمكنك حذف حسابك الحالي' },
        { status: 400 }
      );
    }

    // Get admin name for logging
    const targetAdmin = await prisma.admin.findUnique({
      where: { id },
      select: { name: true },
    });

    await prisma.admin.delete({
      where: { id },
    });

    // Log activity
    if (targetAdmin) {
      const { logActivity } = await import('@/lib/logger');
      await logActivity('حذف مشرف', `تم حذف المشرف: ${targetAdmin.name}`);
    }

    return NextResponse.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    return NextResponse.json(
      { error: 'Failed to delete admin' },
      { status: 500 }
    );
  }
}
