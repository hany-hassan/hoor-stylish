import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 });
    }

    // Convert Decimal to number
    const productWithNumberPrice = {
      ...product,
      price: Number(product.price),
    };

    return NextResponse.json(productWithNumberPrice);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'خطأ في جلب المنتج' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const stock = formData.get('stock') as string;
    const featured = formData.get('featured') === 'true';
    const categoryId = formData.get('categoryId') as string;
    const imageFile = formData.get('image') as File | null;

    let imagePath = undefined;

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`;
      const path = require('path');
      const fs = require('fs/promises');
      
      // Ensure directory exists
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      try {
        await fs.access(uploadDir);
      } catch {
        await fs.mkdir(uploadDir, { recursive: true });
      }

      await fs.writeFile(path.join(uploadDir, filename), buffer);
      imagePath = `/uploads/${filename}`;
    } else if (formData.get('imageUrl')) {
       imagePath = formData.get('imageUrl') as string;
    }

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        ...(imagePath ? { image: imagePath } : {}),
        stock: parseInt(stock),
        featured,
        categoryId,
      },
      include: {
        category: true,
      },
    });

    // Log activity
    const { logActivity } = await import('@/lib/logger');
    await logActivity('تحديث منتج', `تم تحديث المنتج: ${name}`);

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        price: Number(product.price),
      },
    });
  } catch (error: any) {
    console.error('Update error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'اسم المنتج أو الـ slug موجود بالفعل' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'فشل تحديث المنتج' },
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

    // Get product name for logging before delete
    const product = await prisma.product.findUnique({
      where: { id },
      select: { name: true },
    });

    // حذف المنتج
    await prisma.product.delete({
      where: { id },
    });

    // Log activity
    if (product) {
      const { logActivity } = await import('@/lib/logger');
      await logActivity('حذف منتج', `تم حذف المنتج: ${product.name}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'فشل حذف المنتج' },
      { status: 500 }
    );
  }
}
