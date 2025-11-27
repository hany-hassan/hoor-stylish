'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Trash2, Edit, Plus, LogOut } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  category?: { name: string };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف المنتج "${name}"؟`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('تم حذف المنتج بنجاح');
        fetchProducts(); // Refresh list
      } else {
        alert('فشل حذف المنتج');
      }
    } catch (error) {
      alert('حدث خطأ أثناء حذف المنتج');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-burgundy-600 hover:text-burgundy-700">
                ← العودة للرئيسية
              </Link>
              <h1 className="text-2xl font-bold text-sage-900">إدارة المنتجات</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              <LogOut size={20} />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-sage-900">
            إجمالي المنتجات: {products.length}
          </h2>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-burgundy-600 text-white px-4 py-2 rounded-lg hover:bg-burgundy-700 transition-colors"
          >
            <Plus size={20} />
            <span>إضافة منتج جديد</span>
          </Link>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sage-100">
                <tr>
                  <th className="px-6 py-3 text-right text-sage-900 font-bold">الصورة</th>
                  <th className="px-6 py-3 text-right text-sage-900 font-bold">اسم المنتج</th>
                  <th className="px-6 py-3 text-right text-sage-900 font-bold">التصنيف</th>
                  <th className="px-6 py-3 text-right text-sage-900 font-bold">السعر</th>
                  <th className="px-6 py-3 text-right text-sage-900 font-bold">المخزون</th>
                  <th className="px-6 py-3 text-right text-sage-900 font-bold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-sage-100 hover:bg-sand-50">
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-sage-900">{product.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-burgundy-100 text-burgundy-700 px-3 py-1 rounded-full text-sm">
                        {product.category?.name || 'غير محدد'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-burgundy-600">${product.price}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                        {product.stock > 0 ? `${product.stock} قطعة` : 'نفذت الكمية'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                          title="تعديل المنتج"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                          title="حذف المنتج"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <Package size={64} className="mx-auto text-sage-300 mb-4" />
              <p className="text-sage-600 text-lg">لا توجد منتجات</p>
              <Link
                href="/admin/products/new"
                className="inline-block mt-4 text-burgundy-600 hover:underline"
              >
                أضف منتجك الأول
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
