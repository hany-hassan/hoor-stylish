'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, LogOut, Home, ShoppingBag, Clock, User, BarChart } from 'lucide-react';

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/admin/session');
        if (!res.ok) {
          router.push('/admin/login');
          return;
        }
        const data = await res.json();
        setAdmin(data.admin);
        setLoading(false);
      } catch (error) {
        router.push('/admin/login');
      }
    };

    const fetchStats = async () => {
      try {
        const [productsRes, categoriesRes, ordersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
          fetch('/api/orders'),
        ]);
        const products = await productsRes.json();
        const categories = await categoriesRes.json();
        const orders = await ordersRes.json();
        setStats({
          products: products.length || 0,
          categories: categories.length || 0,
          orders: orders.length || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats');
      }
    };

    checkSession();
    fetchStats();
  }, [router]);

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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-burgundy-600">لوحة تحكم حور ستايلش</h1>
            <p className="text-sage-600">مرحباً، {admin?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sage-600 mb-2">إجمالي المنتجات</p>
                <p className="text-4xl font-bold text-burgundy-600">{stats.products}</p>
              </div>
              <Package size={48} className="text-burgundy-300" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sage-600 mb-2">التصنيفات</p>
                <p className="text-4xl font-bold text-burgundy-600">{stats.categories}</p>
              </div>
              <Home size={48} className="text-burgundy-300" />
            </div>
          </div>

          <Link href="/admin/orders" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sage-600 mb-2">الطلبات</p>
                <p className="text-4xl font-bold text-burgundy-600">{stats.orders}</p>
              </div>
              <ShoppingBag size={48} className="text-burgundy-300" />
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-sage-900 mb-6">إجراءات سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/products"
              className="block p-6 border-2 border-burgundy-200 rounded-lg hover:border-burgundy-600 hover:bg-burgundy-50 transition-all"
            >
              <Package size={32} className="text-burgundy-600 mb-2" />
              <h3 className="text-xl font-bold text-sage-900 mb-1">إدارة المنتجات</h3>
              <p className="text-sage-600">عرض، إضافة، تعديل أو حذف المنتجات</p>
            </Link>

            <Link
              href="/admin/categories"
              className="block p-6 border-2 border-sage-200 rounded-lg hover:border-sage-600 hover:bg-sage-50 transition-all"
            >
              <Home size={32} className="text-sage-600 mb-2" />
              <h3 className="text-xl font-bold text-sage-900 mb-1">إدارة التصنيفات</h3>
              <p className="text-sage-600">عرض، إضافة، تعديل أو حذف التصنيفات</p>
            </Link>

            <Link
              href="/admin/activity"
              className="block p-6 border-2 border-sage-200 rounded-lg hover:border-sage-600 hover:bg-sage-50 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock size={32} className="text-sage-600" />
              </div>
              <h3 className="text-xl font-bold text-sage-900 mb-1">سجل النشاطات</h3>
              <p className="text-sage-600">عرض سجل تحركات المشرفين</p>
            </Link>

            <Link
              href="/admin/admins"
              className="block p-6 border-2 border-sage-200 rounded-lg hover:border-sage-600 hover:bg-sage-50 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <User size={32} className="text-sage-600" />
              </div>
              <h3 className="text-xl font-bold text-sage-900 mb-1">إدارة المشرفين</h3>
              <p className="text-sage-600">إضافة وحذف المشرفين</p>
            </Link>

            <Link
              href="/admin/reports"
              className="block p-6 border-2 border-sage-200 rounded-lg hover:border-sage-600 hover:bg-sage-50 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <BarChart size={32} className="text-sage-600" />
              </div>
              <h3 className="text-xl font-bold text-sage-900 mb-1">التقارير</h3>
              <p className="text-sage-600">إحصائيات المبيعات والمنتجات</p>
            </Link>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">📋 ملاحظة</h3>
          <p className="text-blue-800">
            النظام الأساسي جاهز! يمكنك الآن إدارة المنتجات.
            <br />
            <strong>قريباً:</strong> إدارة كاملة للمنتجات مع إضافة وتعديل وحذف.
          </p>
        </div>
      </div>
    </div>
  );
}
