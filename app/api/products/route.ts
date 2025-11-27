import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - already exists
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    const where = categoryId ? { categoryId } : {};

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert Decimal to number for JSON
    const productsWithNumberPrice = products.map((product) => ({
      ...product,
      price: Number(product.price),
    }));

    return NextResponse.json(productsWithNumberPrice);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'خطأ في جلب المنتجات' }, { status: 500 });
  }
}

// POST - Create new product
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const stock = formData.get('stock') as string;
    const featured = formData.get('featured') === 'true';
    const categoryId = formData.get('categoryId') as string;
    const imageFile = formData.get('image') as File | null;

    // Validation
    if (!name || !slug || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب أن تكون موجودة' },
        { status: 400 }
      );
    }

    let imagePath = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500';

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
       // Fallback for direct URL if provided (legacy support or external URL)
       imagePath = formData.get('imageUrl') as string;
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        image: imagePath,
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
    await logActivity('إضافة منتج', `تم إضافة المنتج: ${name}`);

    return NextResponse.json({
      success: true,
      product: {
        ...product,
        price: Number(product.price),
      },
    });
  } catch (error: any) {
    console.error('Create product error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'اسم المنتج أو الـ slug موجود بالفعل' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'فشل إنشاء المنتج' },
      { status: 500 }
    );
  }
}
