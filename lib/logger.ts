import { prisma } from '@/lib/prisma';
import { getAdminSession } from '@/lib/auth';

export async function logActivity(action: string, details?: string) {
  try {
    const admin = await getAdminSession();
    if (!admin) return;

    await prisma.activityLog.create({
      data: {
        action,
        details,
        adminId: admin.id,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}
